export enum FilterType {
  TODAY = 'TODAY',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  MONTHLY = 'MONTHLY',
}

export enum SubFilterType {
  INDIVIDUAL = 'INDIVIDUAL',
  TOTAL = 'TOTAL',
}

export interface GlossaryItem {
  word: string;
  definition: string;
}
