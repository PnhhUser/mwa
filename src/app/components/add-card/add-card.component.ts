import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import {
  JapaneseTypeface,
  JapaneseType,
  JapaneseModel,
  KanaType,
} from '../../model/japanese.model';
import { WanakanaService } from '../../core/services/wanakana.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-card-add',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzListModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzSwitchModule,
    CommonModule,
  ],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.less',
})
export class CardAddComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _wanakanaService = inject(WanakanaService);
  private _drawerRef = inject(NzDrawerRef);

  protected readonly JapaneseType = JapaneseType;
  protected readonly JapaneseTypeface = JapaneseTypeface;
  protected readonly kana = KanaType;

  protected addForm = this._fb.nonNullable.group({
    type: [JapaneseType.VOCABULARY],
    typeface: [JapaneseTypeface.HIRAGANA],
    kanaType: [this.kana.default],
    term: ['', [Validators.required]],
    reading: ['', [Validators.required]],
    meaning: [''],
    show: [true],
    romaji: [''],
    note: [''],
  });

  private termSubscription?: Subscription;
  private readingSubscription?: Subscription;

  ngOnInit() {
    this.termSubscription = this.addForm.controls.term.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (!value) return;
        this.convertAndSetValue('term', value);
      });

    this.readingSubscription = this.addForm.controls.reading.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (!value) return;
        this.convertAndSetValue('reading', value);
      });
  }

  private convertAndSetValue(controlName: 'term' | 'reading', value: string): void {
    const script = this.addForm.controls.typeface.value;
    const converted =
      script === JapaneseTypeface.HIRAGANA
        ? this._wanakanaService.romajiToHiragana(value)
        : this._wanakanaService.romajiToKatakana(value);

    if (value !== converted) {
      this.addForm.controls[controlName].setValue(converted, { emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.termSubscription?.unsubscribe();
    this.readingSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.addForm.valid) {
      this._drawerRef.close(this.addForm.getRawValue());
    }
  }
}
