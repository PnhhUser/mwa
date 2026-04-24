import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CARD_TYPE_LABEL, CardType, FlashCard } from '../../model/flash-card.model';
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
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.less',
})
export class CardDetailComponent {
  @Input() card!: FlashCard;
  private _speechService = inject(SpeechService);
  private _drawerRef = inject(NzDrawerRef);

  protected isEdit = signal<boolean>(false);

  editCard!: FlashCard;

  ngOnInit(): void {
    this.editCard = { ...this.card };
  }

  onEdit(): void {
    this.isEdit.set(true);
  }

  onSound(term: string): void {
    this._speechService.speak(term);
  }

  formatCardType(type: CardType): string {
    return CARD_TYPE_LABEL[type];
  }

  onConfirm(): void {
    this.card = { ...this.editCard };

    this.isEdit.set(false);

    const data: DrawerCloseData<FlashCard> = { type: 'edit', closeData: this.card };

    this._drawerRef.close(data);
  }

  onCancel(): void {
    this.isEdit.set(false);
    this.editCard = { ...this.card };
  }

  formatColor(show: boolean): string {
    return show ? 'green' : 'red';
  }
}
