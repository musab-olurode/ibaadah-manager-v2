// Solah
import FajrIconImg from '../assets/icons/fajr.png';
import ZhurIconImg from '../assets/icons/dhur.png';
import AsrIconImg from '../assets/icons/asr.png';
import MaghribIconImg from '../assets/icons/maghrib.png';
import IshaiIconImg from '../assets/icons/ishai.png';
import JamaahIconImg from '../assets/icons/jamaah.png';
import AloneIconImg from '../assets/icons/alone.png';
import AdhkarAfterIconImg from '../assets/icons/adhkar-after.png';
import RawatibIconImg from '../assets/icons/rawatib.png';

// Daily Activities Icons
import NawafilIconImg from '../assets/icons/nawafil.png';
import TahajjudIconImg from '../assets/icons/tahajjud.png';
import DhuaIconImg from '../assets/icons/dhua.png';
import TaobahIconImg from '../assets/icons/taobah.png';
import ShafiAndWitrIconImg from '../assets/icons/shafi-and-witr.png';
import AdhkarIconImg from '../assets/icons/adhkar.png';
import MorningIconImg from '../assets/icons/morning.png';
import EveningIconImg from '../assets/icons/evening.png';
import QuranIconImg from '../assets/icons/quran.png';
import TilawahIconImg from '../assets/icons/tilawah.png';
import HifdhIconImg from '../assets/icons/hifdh.png';
import MurajaahIconImg from '../assets/icons/murajaah.png';
import TadaburIconImg from '../assets/icons/tadabur.png';
import HealthHabitsIconImg from '../assets/icons/health-habits.png';
import ExerciseIconImg from '../assets/icons/exercise.png';
import BathIconImg from '../assets/icons/bath.png';
import ToothBrushIconImg from '../assets/icons/tooth-brush.png';
import HealthyFoodIconImg from '../assets/icons/food.png';
import BooksIconImg from '../assets/icons/books.png';
import IslamicBookIconImg from '../assets/icons/islamic-book.png';
import SelfDevelopmentIconImg from '../assets/icons/open-book.png';

// Weekly Activities
import FastingIconImg from '../assets/icons/fasting.png';
import FridaySunnahIconImg from '../assets/icons/friday-sunnah.png';
import SadaqahIconImg from '../assets/icons/sadaqah.png';
import FamilySittingIconImg from '../assets/icons/family-sitting.png';
import MondayIconImg from '../assets/icons/monday.png';
import ThursdayIconImg from '../assets/icons/thursday.png';
import ShoweringIconImg from '../assets/icons/showering.png';
import NailCuttingIconImg from '../assets/icons/nail-cutting.png';
import EarlyMosqueGoingIconImg from '../assets/icons/early-mosque-going.png';
import SuratulKhafIconImg from '../assets/icons/suratul-khaf.png';
import DuaBetweenAsrAndMaghribIconImg from '../assets/icons/dua-between-asr-and-maghrib.png';
import DonationIconImg from '../assets/icons/donation.png';
import FamilyDiscussionIconImg from '../assets/icons/family-discussion.png';

// Monthly Activities
import ThirteenthIconImg from '../assets/icons/13th.png';
import FourteenthIconImg from '../assets/icons/14th.png';
import FifteenthIconImg from '../assets/icons/15th.png';
import SavingMoneyIconImg from '../assets/icons/saving-money.png';
import CharityIconImg from '../assets/icons/charity.png';
import WalletIconImg from '../assets/icons/wallet.png';
import ZiyaarahIconImg from '../assets/icons/ziyaarah.png';
import SoliheenIconImg from '../assets/icons/soliheen.png';
import BrotherlyVisitIconImg from '../assets/icons/brotherly-visit.png';
import SickVisitationIconImg from '../assets/icons/sick-visitation.png';
import CemetaryIconImg from '../assets/icons/cemetary-visit.png';
import {Activity, RawActivity} from '../types/global';

export enum ActivityCategory {
  Solah = 'Solah',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export const SOLAH: RawActivity[] = [
  {
    icon: FajrIconImg,
    group: 'Fajr',
    activities: [
      {icon: JamaahIconImg, order: 1, title: 'Jama’ah'},
      {icon: AloneIconImg, order: 2, title: 'Alone'},
      {icon: AdhkarAfterIconImg, order: 3, title: 'Adhkar After'},
      {icon: RawatibIconImg, order: 4, title: 'Rawatib'},
    ],
  },
  {
    icon: ZhurIconImg,
    group: 'Dhur',
    activities: [
      {icon: JamaahIconImg, order: 5, title: 'Jama’ah'},
      {icon: AloneIconImg, order: 6, title: 'Alone'},
      {icon: AdhkarAfterIconImg, order: 7, title: 'Adhkar After'},
      {icon: RawatibIconImg, order: 8, title: 'Rawatib'},
    ],
  },
  {
    icon: AsrIconImg,
    group: 'Asr',
    activities: [
      {icon: JamaahIconImg, order: 9, title: 'Jama’ah'},
      {icon: AloneIconImg, order: 10, title: 'Alone'},
      {icon: AdhkarAfterIconImg, order: 11, title: 'Adhkar After'},
      {icon: RawatibIconImg, order: 12, title: 'Rawatib'},
    ],
  },
  {
    icon: MaghribIconImg,
    group: 'Maghrib',
    activities: [
      {icon: JamaahIconImg, order: 13, title: 'Jama’ah'},
      {icon: AloneIconImg, order: 14, title: 'Alone'},
      {icon: AdhkarAfterIconImg, order: 15, title: 'Adhkar After'},
      {icon: RawatibIconImg, order: 16, title: 'Rawatib'},
    ],
  },
  {
    icon: IshaiIconImg,
    group: "Isha'i",
    activities: [
      {icon: JamaahIconImg, order: 17, title: 'Jama’ah'},
      {icon: AloneIconImg, order: 18, title: 'Alone'},
      {icon: AdhkarAfterIconImg, order: 19, title: 'Adhkar After'},
      {icon: RawatibIconImg, order: 20, title: 'Rawatib'},
    ],
  },
];

export const DAILY_ACTIVITIES: RawActivity[] = [
  {
    icon: NawafilIconImg,
    group: 'Nawafil',
    activities: [
      {icon: TahajjudIconImg, order: 21, title: 'Tahajjud'},
      {icon: DhuaIconImg, order: 22, title: 'Dhua'},
      {icon: TaobahIconImg, order: 23, title: 'Taobah'},
      {icon: ShafiAndWitrIconImg, order: 24, title: 'Shafi & Witr'},
    ],
  },
  {
    icon: AdhkarIconImg,
    group: 'Adhkar',
    activities: [
      {icon: MorningIconImg, order: 25, title: 'Morning'},
      {icon: EveningIconImg, order: 26, title: 'Evening'},
    ],
  },
  {
    icon: QuranIconImg,
    group: 'Qur’an',
    activities: [
      {icon: TilawahIconImg, order: 27, title: 'Tilawah'},
      {icon: HifdhIconImg, order: 28, title: 'Hifdh'},
      {icon: MurajaahIconImg, order: 29, title: 'Muraja’ah'},
      {icon: TadaburIconImg, order: 30, title: 'Tadabur'},
    ],
  },
  {
    icon: HealthHabitsIconImg,
    group: 'Health Habits',
    activities: [
      {icon: ExerciseIconImg, order: 31, title: 'Daily Exercise'},
      {icon: BathIconImg, order: 32, title: 'Bath'},
      {icon: ToothBrushIconImg, order: 33, title: 'Tooth Brushing'},
      {icon: HealthyFoodIconImg, order: 34, title: 'Healthy Food'},
    ],
  },
  {
    icon: BooksIconImg,
    group: 'Book Reading',
    activities: [
      {icon: IslamicBookIconImg, order: 35, title: 'Islamic Books'},
      {icon: SelfDevelopmentIconImg, order: 36, title: 'Self Development'},
    ],
  },
];

export const WEEKLY_ACTIVITIES: RawActivity[] = [
  {
    icon: FastingIconImg,
    group: 'Fasting',
    activities: [
      {icon: MondayIconImg, order: 37, title: 'Monday'},
      {icon: ThursdayIconImg, order: 38, title: 'Thursday'},
    ],
  },
  {
    icon: FridaySunnahIconImg,
    group: 'Friday’s Sunnah',
    activities: [
      {icon: ShoweringIconImg, order: 39, title: 'Showering'},
      {icon: NailCuttingIconImg, order: 40, title: 'Cutting of nails'},
      {
        icon: EarlyMosqueGoingIconImg,
        order: 41,
        title: 'Going to the Mosque early',
      },
      {icon: SuratulKhafIconImg, order: 42, title: 'Read suratul Al Khaf'},
      {
        icon: DuaBetweenAsrAndMaghribIconImg,
        order: 43,
        title: 'Dua between Asr & Maghrib',
      },
    ],
  },
  {
    icon: SadaqahIconImg,
    group: 'Sadaqah',
    activities: [
      {icon: DonationIconImg, order: 44, title: 'Donate to the needy'},
    ],
  },
  {
    icon: FamilySittingIconImg,
    group: 'Family Sitting',
    activities: [
      {
        icon: FamilyDiscussionIconImg,
        order: 45,
        title: 'Discussion with Family',
      },
    ],
  },
];

export const MONTHLY_ACTIVITIES: RawActivity[] = [
  {
    icon: FastingIconImg,
    group: 'Fasting',
    activities: [
      {icon: ThirteenthIconImg, order: 46, title: '13th of the month'},
      {icon: FourteenthIconImg, order: 47, title: '14th of the month'},
      {icon: FifteenthIconImg, order: 48, title: '15th of the month'},
    ],
  },
  {
    icon: SavingMoneyIconImg,
    group: 'Saving Money',
    activities: [
      {icon: CharityIconImg, order: 49, title: 'For charity'},
      {icon: WalletIconImg, order: 50, title: 'For yourself'},
    ],
  },
  {
    icon: ZiyaarahIconImg,
    group: 'Ziyaarah',
    activities: [
      {icon: SoliheenIconImg, order: 51, title: 'Soliheen'},
      {icon: BrotherlyVisitIconImg, order: 52, title: 'Visit a Brother'},
      {icon: FamilySittingIconImg, order: 53, title: 'Visit Family'},
      {icon: SickVisitationIconImg, order: 54, title: 'Visit the Sick'},
      {icon: CemetaryIconImg, order: 55, title: 'Visit the Cemetary'},
    ],
  },
];

export const ALL_ACTIVITIES_FORMATTED: Activity[] = [
  ...SOLAH.map(solah => {
    return solah.activities.map(activity => ({
      ...activity,
      group: solah.group,
      category: ActivityCategory.Solah,
      completed: false,
    }));
  }).flat(2),
  ...DAILY_ACTIVITIES.map(dailyActivities => {
    return dailyActivities.activities.map(activity => ({
      ...activity,
      group: dailyActivities.group,
      category: ActivityCategory.Daily,
      completed: false,
    }));
  }).flat(2),
  ...WEEKLY_ACTIVITIES.map(weeklyActivities => {
    return weeklyActivities.activities.map(activity => ({
      ...activity,
      group: weeklyActivities.group,
      category: ActivityCategory.Weekly,
      completed: false,
    }));
  }).flat(2),
  ...MONTHLY_ACTIVITIES.map(monthlyActivities => {
    return monthlyActivities.activities.map(activity => ({
      ...activity,
      group: monthlyActivities.group,
      category: ActivityCategory.Monthly,
      completed: false,
    }));
  }).flat(2),
];
