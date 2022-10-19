import {GlossaryItem} from '../types/global';

export const GLOSSARY: GlossaryItem[] = [
  {word: 'Asr', definition: 'Asr definition'},
  {word: 'Adhkar', definition: 'Adhkar definition'},
  {word: 'Dhur', definition: 'Dhur definition'},
  {
    word: 'Dhua',
    definition:
      'The Duha prayer is the voluntary Islamic prayer between the obligatory Islamic prayers of Fajr and Dhuhr. The time for the prayer begins when the sun has risen to the height of a spear, which is fifteen or twenty minutes after sunrise, until just before the sun passes its zenith.',
  },
  {word: 'Fajr', definition: 'Fajr definition'},
  {word: 'Hifdh', definition: 'Hifdh definition'},
  {word: 'Isha’i', definition: 'Isha’i definition'},
  {word: 'Solah', definition: 'Solah definition'},
  {word: 'Maghrib', definition: 'Maghrib definition'},
  {word: 'Muraja’ah', definition: 'Muraja’ah definition'},
  {word: 'Nawafil', definition: 'Nawafil definition'},
  {word: 'Qur’an', definition: 'Qur’an definition'},
  {word: 'Sunnah', definition: 'Sunnah definition'},
  {word: 'Sadaqah', definition: 'Sadaqah definition'},
  {word: 'Soliheen', definition: 'Soliheen definition'},
  {word: 'Tefsir', definition: 'Tefsir definition'},
  {word: 'Tadabur', definition: 'Tadabur definition'},
  {word: 'Tillawah', definition: 'Tillawah definition'},
  {word: 'Tahajjud', definition: 'Tahajjud definition'},
  {word: 'Taobah', definition: 'Taobah definition'},
  {word: 'Ziyaarah', definition: 'Ziyaarah definition'},
  {word: 'Ishai', definition: 'Ishai Prayer'},
  {word: 'Maghrib', definition: 'Maghrib Prayer'},
];

export const ORDERED_GLOSSARY = GLOSSARY.sort((a, b) =>
  a.word.localeCompare(b.word),
);
