import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  signal,
  OnInit,
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
import { JpInputComponent } from '../../shared/components/jp-input/jp-input.component';
import { DictionaryService } from '../../core/services/Dictionary.service';

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
    JpInputComponent,
  ],
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.less',
})
export class CardDetailComponent implements OnInit {
  @Input() card!: JapaneseModel;

  private _speechService = inject(SpeechService);
  private _drawerRef = inject(NzDrawerRef);
  public dictionaryService = inject(DictionaryService);

  protected isEdit = signal<boolean>(false);
  protected readonly JapaneseType = JapaneseType;
  protected readonly JapaneseTypeface = JapaneseTypeface;
  protected readonly kana = KanaType;

  editCard!: JapaneseModel;
  currentTypeface = signal<JapaneseTypeface>(JapaneseTypeface.HIRAGANA);

  ngOnInit(): void {
    this.card = { ...this.card, kanaType: Number(this.card.kanaType ?? 0) };
    this.editCard = { ...this.card };
    this.currentTypeface.set(this.editCard.typeface);
  }

  onTermChange(value: string) {
    this.editCard.term = value;
  }

  onReadingChange(value: string) {
    this.editCard.reading = value;
  }

  onTypefaceChange(value: JapaneseTypeface) {
    this.editCard.typeface = value;
    this.currentTypeface.set(value);
  }

  onEdit(): void {
    this.isEdit.set(true);
    this.currentTypeface.set(this.editCard.typeface);
  }

  onSound(text: string): void {
    this._speechService.speak(text);
  }

  formatCardType(type: JapaneseType): string {
    return CARD_TYPE_LABEL[type];
  }

  formatScript(typeface: JapaneseTypeface): string {
    switch (typeface) {
      case JapaneseTypeface.HIRAGANA:
        return 'Hiragana';
      case JapaneseTypeface.KATAKANA:
        return 'Katakana';
      case JapaneseTypeface.KANJI:
        return 'Kanji';
      default:
        return 'unknown';
    }
  }

  formatKana(type: number): string {
    switch (type) {
      case 1:
        return 'Dakuon';
      case 2:
        return 'Handakuon';
      case 3:
        return 'Yoon';
      case 4:
        return 'Sokuon';
      case 5:
        return 'SmallKana';
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
    this.currentTypeface.set(this.editCard.typeface);
  }

  formatColor(show: boolean): string {
    return show ? 'green' : 'red';
  }
}
