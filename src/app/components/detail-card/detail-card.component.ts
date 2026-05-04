import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { SpeechService } from '../../core/services/speech.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DrawerCloseData } from '../../model/drawer.model';
import {
  CARD_TYPE_LABEL,
  JapaneseModel,
  JapaneseType,
  JapaneseTypeface,
  KanaType,
} from '../../model/japanese.model';
import { WanakanaService } from '../../core/services/wanakana.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-card-detail.component',
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzListModule,
    NzTypographyModule,
    NzCardModule,
    NzSwitchModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    CommonModule,
    NzTagModule,
  ],
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.less',
})
export class CardDetailComponent {
  @Input() card!: JapaneseModel;
  private _speechService = inject(SpeechService);
  private _drawerRef = inject(NzDrawerRef);
  private _wanakanaService = inject(WanakanaService);
  private _destroyRef = inject(DestroyRef);

  protected isEdit = signal<boolean>(false);
  protected readonly JapaneseType = JapaneseType;
  protected readonly JapaneseTypeface = JapaneseTypeface;
  protected readonly kana = KanaType;
  private _cdr = inject(ChangeDetectorRef);

  editCard!: JapaneseModel;

  // Debouncer subjects
  private termSubject = new Subject<string>();
  private readingSubject = new Subject<string>();

  ngOnInit(): void {
    this.card = { ...this.card, kanaType: Number(this.card.kanaType ?? 0) };

    this.editCard = { ...this.card };

    this.termSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this.applyTermConversion(value);
      });

    this.readingSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this.applyReadingConversion(value);
      });
  }

  onEdit(): void {
    this.isEdit.set(true);
  }

  onSound(text: string): void {
    this._speechService.speak(text);
  }

  formatCardType(type: JapaneseType): string {
    return CARD_TYPE_LABEL[type];
  }

  formatScript(typeface: JapaneseTypeface): string {
    switch (typeface) {
      case 1:
        return 'Hiragana';
      case 2:
        return 'Katakana';
      // case 3:
      //   return 'Kanji';
      default:
        return 'unknown';
    }
  }

  formatKana(type: number): string {
    switch (type) {
      case 1:
        return 'Dakaon';
      case 2:
        return 'Handakuon';
      case 3:
        return 'Yoon';
      case 4:
        return 'Sokuon';
      case 5:
        return 'Smallkana';
      case 6:
        return 'Seion';
      default:
        return 'Mặc định';
    }
  }

  onConfirm(): void {
    this.card = { ...this.editCard };

    this.isEdit.set(false);

    const data: DrawerCloseData<JapaneseModel> = { type: 'edit', closeData: this.card };

    this._drawerRef.close(data);
  }

  onCancel(): void {
    this.isEdit.set(false);
    this.editCard = { ...this.card };
  }

  formatColor(show: boolean): string {
    return show ? 'green' : 'red';
  }

  onTermChange(value: string): void {
    this.editCard.term = value;
    this.termSubject.next(value);
  }

  onReadingChange(value: string): void {
    this.editCard.reading = value;
    this.readingSubject.next(value);
  }

  private applyTermConversion(value: string): void {
    if (!value) {
      this.editCard.term = '';
      this._cdr.detectChanges();
      return;
    }

    if (this.editCard.typeface === JapaneseTypeface.HIRAGANA) {
      this.editCard.term = this._wanakanaService.romajiToHiragana(value);
    }

    if (this.editCard.typeface === JapaneseTypeface.KATAKANA) {
      this.editCard.term = this._wanakanaService.romajiToKatakana(value);
    }

    this._cdr.detectChanges();
  }

  private applyReadingConversion(value: string): void {
    if (!value) {
      this.editCard.reading = '';
      this._cdr.detectChanges();
      return;
    }

    if (this.editCard.typeface === JapaneseTypeface.HIRAGANA) {
      this.editCard.reading = this._wanakanaService.romajiToHiragana(value);
    }

    if (this.editCard.typeface === JapaneseTypeface.KATAKANA) {
      this.editCard.reading = this._wanakanaService.romajiToKatakana(value);
    }

    this._cdr.detectChanges();
  }
}
