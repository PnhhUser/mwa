export interface DrawerCloseData<T> {
  type: 'edit' | 'remove';
  closeData: T;
}
