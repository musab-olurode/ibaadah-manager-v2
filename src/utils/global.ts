import moment from 'moment';

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

export const capitalizeFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();

export const getDaysDifference = (startDate: Date, endDate: Date) => {
  const startDateMomentInstance = moment(startDate);
  const endDateMomentInstance = moment(endDate);
  const daysDifference = endDateMomentInstance.diff(
    startDateMomentInstance,
    'days',
  );
  return daysDifference;
};

export const getStartOfThisWeek = () => {
  const startOfThisWeek = moment().startOf('isoWeek');
  return startOfThisWeek.toDate();
};

export const getStartOfLastWeek = () => {
  const startOfLastWeek = moment().subtract(1, 'week').startOf('isoWeek');
  return startOfLastWeek.toDate();
};

export const getEndOfThisWeek = () => {
  const endOfThisWeek = moment().endOf('isoWeek');
  return endOfThisWeek.toDate();
};

export const getEndOfLastWeek = () => {
  const endOfLastWeek = moment().subtract(1, 'week').endOf('isoWeek');
  return endOfLastWeek.toDate();
};
