import { ManageCard } from '../../model/manage-card.model';

const account: string = 'tai-khoan';
const japanese: string = 'tieng-nhat';

export const MANAGE_MAP: ManageCard[] = [
  {
    record: 0,
    name: 'Tài khoản',
    type: account,
  },
  {
    record: 0,
    name: 'Tiếng nhật',
    type: japanese,
  },
];

export const MANAGE_TYPE = {
  account,
  japanese,
};
