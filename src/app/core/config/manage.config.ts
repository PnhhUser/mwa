export interface ManageCard {
  name: string;
  record: number;
  type: string;
}

export const MANAGE_TYPE = {
  account: 'tai-khoan',
  japanese: 'tieng-nhat',
} as const;

const MANAGE_CONFIG = [
  { name: 'Tài khoản', type: MANAGE_TYPE.account },
  { name: 'Tiếng Nhật', type: MANAGE_TYPE.japanese },
];

export const getManageLabel = (type: string | null): string => {
  return MANAGE_CONFIG.find((m) => m.type === type)?.name ?? '';
};

export const getManageMap = (counts: { [key: string]: number }): ManageCard[] => {
  return MANAGE_CONFIG.map((item) => ({
    ...item,
    record: counts[item.type] ?? 0,
  }));
};
