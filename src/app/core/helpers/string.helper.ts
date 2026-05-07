const replaceSpace = (str: string): string => {
  return str.replaceAll(' ', '-');
};

const formatSlugToText = (str: string): string => {
  if (!str) return '';

  return str.replace(/-/g, ' ');
};

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const short = (str: string): string => {
  if (!str) return '';
  return str.slice(0, 7) + '...';
};

const StringHelper = {
  replaceSpace,
  formatSlugToText,
  capitalizeFirstLetter,
  short,
};

export default StringHelper;
