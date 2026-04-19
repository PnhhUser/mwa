import dayjs from 'dayjs';

const getTime = (date = new Date()) => {
  return dayjs(date).format('HH:mm:ss');
};

const getDate = (date = new Date()) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const getFullDateTime = (date = new Date()) => {
  return dayjs(date).format('HH:mm:ss DD/MM/YYYY');
};

const DateHelper = {
  getTime,
  getDate,
  getFullDateTime,
};

export default DateHelper;
