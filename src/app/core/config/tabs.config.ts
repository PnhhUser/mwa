import { Type } from '@angular/core';
import { AccountOverviewComponent } from '../../components/account-overview/account-overview.component';
import { ProductOverviewComponent } from '../../components/jpn-overview/jpn-overview.component';
import { MANAGE_TYPE } from './manage.config';
import { AccountsComponent } from '../../components/accounts/accounts.component';
import { FlashCardComponent } from '../../components/flash-card/flash-card.component';

export interface TabConfig {
  label: string;
  component: Type<any> | null;
}

export const TABS_MAP: Record<string, TabConfig[]> = {
  [MANAGE_TYPE.account]: [
    { label: 'Tổng quan', component: AccountOverviewComponent },
    { label: 'Tài khoản', component: AccountsComponent },
  ],
  [MANAGE_TYPE.japanese]: [
    { label: 'Tổng quan', component: ProductOverviewComponent },
    { label: 'Thẻ ghi nhớ', component: FlashCardComponent },
  ],
};
