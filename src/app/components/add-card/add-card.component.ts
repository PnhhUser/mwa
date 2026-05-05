import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { JapaneseTypeface, JapaneseType, KanaType } from '../../model/japanese.model';
import { CommonModule } from '@angular/common';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { JpInputComponent } from '../../shared/components/jp-input/jp-input.component';

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
    JpInputComponent,
  ],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.less',
})
export class CardAddComponent implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);
  private _drawerRef = inject(NzDrawerRef);

  protected readonly JapaneseType = JapaneseType;
  protected readonly JapaneseTypeface = JapaneseTypeface;
  protected readonly kana = KanaType;

  // Signal để theo dõi loại chữ hiện tại
  protected currentTypeface = signal<JapaneseTypeface>(JapaneseTypeface.HIRAGANA);

  protected addForm = this._fb.nonNullable.group({
    type: [JapaneseType.VOCABULARY],
    typeface: [JapaneseTypeface.HIRAGANA],
    kanaType: [this.kana.Default],
    term: ['', [Validators.required]],
    reading: ['', [Validators.required]],
    meaning: [''],
    show: [true],
    romaji: [''],
    note: [''],
  });

  private typefaceSubscription?: ReturnType<
    typeof this.addForm.controls.typeface.valueChanges.subscribe
  >;

  ngOnInit() {
    // Theo dõi sự thay đổi của typeface để cập nhật signal
    this.typefaceSubscription = this.addForm.controls.typeface.valueChanges.subscribe((value) => {
      this.currentTypeface.set(value);
    });
  }

  /**
   * Xử lý khi term thay đổi từ JpInputComponent
   */
  onTermChange(value: string) {
    this.addForm.controls.term.setValue(value, { emitEvent: false });
  }

  /**
   * Xử lý khi reading thay đổi từ JpInputComponent
   */
  onReadingChange(value: string) {
    this.addForm.controls.reading.setValue(value, { emitEvent: false });
  }

  /**
   * Xử lý khi romaji thay đổi từ JpInputComponent
   */
  // onRomajiChange(value: string) {
  //   this.addForm.controls.romaji.setValue(value, { emitEvent: false });
  // }

  ngOnDestroy() {
    this.typefaceSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.addForm.valid) {
      this._drawerRef.close(this.addForm.getRawValue());
    }
  }
}
