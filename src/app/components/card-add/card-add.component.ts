import { Component, inject } from '@angular/core';
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
import { CARD_TYPE_LABEL, CardType, ScriptType } from '../../model/flash-card.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

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
  ],
  templateUrl: './card-add.component.html',
  styleUrl: './card-add.component.less',
})
export class CardAddComponent {
  private _fb = inject(FormBuilder);

  protected readonly CARD_TYPE_LABEL = CARD_TYPE_LABEL;

  protected addForm = this._fb.nonNullable.group({
    type: ['vocabulary' as CardType],
    script: ['hiragana' as ScriptType],
    term: [{ value: '', disabled: true }, [Validators.required]],
    reading: [''],
    meaning: ['', [Validators.required]],
    show: [true],
  });

  ngOnInit(): void {
    this.addForm.get('reading')?.valueChanges.subscribe((value) => {
      this.addForm.get('term')?.setValue(value);
    });
  }

  onSubmit() {
    if (this.addForm.valid) {
      console.log(this.addForm.getRawValue());
    }
  }
}
