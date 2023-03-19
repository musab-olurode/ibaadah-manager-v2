import {
  differenceInCalendarDays,
  endOfWeek,
  startOfWeek,
  subWeeks,
} from 'date-fns';

export const capitalizeFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();

export const getDaysDifference = (startDate: Date, endDate: Date) => {
  const daysDifference = differenceInCalendarDays(endDate, startDate);
  return daysDifference;
};

export const getStartOfThisWeek = () => {
  const startOfThisWeek = startOfWeek(new Date());
  return startOfThisWeek;
};

export const getStartOfLastWeek = () => {
  const startOfLastWeek = startOfWeek(subWeeks(new Date(), 1));
  return startOfLastWeek;
};

export const getEndOfThisWeek = () => {
  const endOfThisWeek = endOfWeek(new Date());
  return endOfThisWeek;
};

export const getEndOfLastWeek = () => {
  const endOfLastWeek = endOfWeek(subWeeks(new Date(), 1));
  return endOfLastWeek;
};
