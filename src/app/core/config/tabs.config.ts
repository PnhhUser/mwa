import { Type } from '@angular/core';
import { AccountOverviewComponent } from '../../components/account-overview/account-overview.component';
import { ProductOverviewComponent } from '../../components/jpn-overview/jpn-overview.component';
import { MANAGE_TYPE } from './manage.config';
import { AccountsComponent } from '../../components/accounts/accounts.component';
import { FlashCardComponent } from '../../components/flash-card/flash-card.component';

export interface TabConfig {
  label: string;
  slug: string; // thêm slug cho mỗi tab
  component: Type<any> | null;
}

export const TABS_MAP: Record<string, TabConfig[]> = {
  [MANAGE_TYPE.account]: [
    { label: 'Tổng quan', slug: 'tong-quan', component: AccountOverviewComponent },
    { label: 'Tài khoản', slug: 'tai-khoan', component: AccountsComponent },
  ],
  [MANAGE_TYPE.japanese]: [
    { label: 'Tổng quan', slug: 'tong-quan', component: ProductOverviewComponent },
    { label: 'Thẻ ghi nhớ', slug: 'the-ghi-nho', component: FlashCardComponent },
  ],
};
