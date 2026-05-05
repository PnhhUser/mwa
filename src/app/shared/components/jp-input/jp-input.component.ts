import {
  Component,
  inject,
  input,
  output,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WanakanaService } from '../../../core/services/wanakana.service';
import { DictionaryService } from '../../../core/services/Dictionary.service';
import { CommonModule } from '@angular/common';

export type JpInputType = 'hiragana' | 'katakana' | 'kanji';

@Component({
  selector: 'app-jp-input',
  standalone: true,
  imports: [FormsModule, NzInputModule, CommonModule],
  templateUrl: './jp-input.component.html',
  styleUrl: './jp-input.component.less',
})
export class JpInputComponent implements OnInit, OnDestroy {
  private wanakanaService = inject(WanakanaService);
  public dictionaryService = inject(DictionaryService);

  @ViewChild('nativeInput', { static: false }) nativeInput!: ElementRef<HTMLInputElement>;

  inputType = input<JpInputType>('hiragana');
  placeholderText = input<string>('Nhập chữ Romaji...');
  valueConverted = output<string>();

  rawInputValue: string = '';

  showSuggestions = false;
  suggestions: string[] = [];
  selectedSuggestionIndex = -1;

  private valueSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.valueSubject
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.processValueChange(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onValueChange(value: string) {
    this.valueSubject.next(value);
  }

  private processValueChange(value: string) {
    if (!value || !value.trim()) {
      this.rawInputValue = '';
      this.valueConverted.emit('');
      this.showSuggestions = false;
      return;
    }

    const type = this.inputType();

    if (type === 'hiragana') {
      const convertedValue = this.wanakanaService.romajiToHiragana(value);
      this.updateInputValueWithCursor(convertedValue);
      this.valueConverted.emit(convertedValue);
      this.showSuggestions = false;
      return;
    }

    if (type === 'katakana') {
      const convertedValue = this.wanakanaService.romajiToKatakana(value);
      this.updateInputValueWithCursor(convertedValue);
      this.valueConverted.emit(convertedValue);
      this.showSuggestions = false;
      return;
    }

    if (type === 'kanji') {
      const hiraganaSearch = this.wanakanaService.romajiToHiragana(value);

      if (hiraganaSearch.length >= 1 && this.dictionaryService.isLoaded) {
        this.suggestions = this.dictionaryService.searchSuggestions(hiraganaSearch);
        this.showSuggestions = this.suggestions.length > 0;
        this.selectedSuggestionIndex = -1;
      } else {
        this.showSuggestions = false;
      }

      if (this.rawInputValue !== hiraganaSearch) {
        this.updateInputValueWithCursor(hiraganaSearch);
      }

      this.valueConverted.emit(hiraganaSearch);
      return;
    }
  }

  selectSuggestion(suggestion: string) {
    this.rawInputValue = suggestion;
    this.showSuggestions = false;
    this.updateInputValueWithCursor(suggestion);
    this.valueConverted.emit(suggestion);

    this.nativeInput?.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.inputType() !== 'kanji') return;

    // ESC: Đóng dropdown
    if (event.key === 'Escape') {
      this.showSuggestions = false;
      return;
    }

    if (event.key === 'ArrowDown' && this.showSuggestions) {
      event.preventDefault();
      this.selectedSuggestionIndex = Math.min(
        this.selectedSuggestionIndex + 1,
        this.suggestions.length - 1,
      );
      return;
    }

    if (event.key === 'ArrowUp' && this.showSuggestions) {
      event.preventDefault();
      this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
      return;
    }

    if (event.key === 'Enter' && this.showSuggestions) {
      event.preventDefault();
      const index = this.selectedSuggestionIndex >= 0 ? this.selectedSuggestionIndex : 0;
      if (this.suggestions[index]) {
        this.selectSuggestion(this.suggestions[index]);
      }
      return;
    }

    if (event.key === ' ' && !this.showSuggestions) {
      event.preventDefault();
      const hiraganaSearch = this.wanakanaService.romajiToHiragana(this.rawInputValue);
      const exactResults = this.dictionaryService.searchExact(hiraganaSearch);

      if (exactResults.length > 0) {
        this.selectSuggestion(exactResults[0]);
      } else {
        this.rawInputValue += ' ';
        this.updateInputValueWithCursor(this.rawInputValue);
      }
      return;
    }
  }

  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  private updateInputValueWithCursor(newValue: string) {
    if (!this.nativeInput) {
      this.rawInputValue = newValue;
      return;
    }

    const inputEl = this.nativeInput.nativeElement;
    const start = inputEl.selectionStart;
    const end = inputEl.selectionEnd;

    this.rawInputValue = newValue;

    requestAnimationFrame(() => {
      if (inputEl === document.activeElement) {
        inputEl.setSelectionRange(start, end);
      }
    });
  }
}
