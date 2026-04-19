const set = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const get = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const remove = (key: string): void => {
  localStorage.removeItem(key);
};

export const LocalHelper = {
  set,
  get,
  remove,
};
