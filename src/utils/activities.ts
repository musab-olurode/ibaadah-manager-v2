// Global Activities
import DailyActivitiesIconImg from '../assets/icons/daily-activities.png';
import WeeklyActivitiesIconImg from '../assets/icons/weekly-activities.png';
import MonthlyActivitiesIconImg from '../assets/icons/monthly-activities.png';

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
import ExcerciseIconImg from '../assets/icons/excercise.png';
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
import SelfEvaluationIconImg from '../assets/icons/self-evaluation.png';
import MondayIconImg from '../assets/icons/monday.png';
import ThursdayIconImg from '../assets/icons/thursday.png';
import ShoweringIconImg from '../assets/icons/showering.png';
import NailCuttingIconImg from '../assets/icons/nail-cutting.png';
import EarlyMosqueGoingIconImg from '../assets/icons/early-mosque-going.png';
import SuratulKhafIconImg from '../assets/icons/suratul-khaf.png';
import DuaBetweenAsrAndMaghribIconImg from '../assets/icons/dua-between-asr-and-maghrib.png';
import DonationIconImg from '../assets/icons/donation.png';
import FamilyDiscussionIconImg from '../assets/icons/family-discussion.png';
import ChartUpIconImg from '../assets/icons/chart-up.png';

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
import {
  Activity,
  ActivityStorage,
  GroupedActivityEvaluation,
} from '../types/global';
import {getActivities, setActivities} from './storage';
import {
  getDaysDifference,
  getEndOfLastWeek,
  getEndOfThisWeek,
  getStartOfLastWeek,
  getStartOfThisWeek,
} from './global';

export enum ActivityCategory {
  Solah = 'Solah',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export const SOLAH = [
  {
    icon: FajrIconImg,
    title: 'Fajr',
    content: [
      {icon: JamaahIconImg, activity: 'Jama’ah'},
      {icon: AloneIconImg, activity: 'Alone'},
      {icon: AdhkarAfterIconImg, activity: 'Adhkar After'},
      {icon: RawatibIconImg, activity: 'Rawatib'},
    ],
  },
  {
    icon: ZhurIconImg,
    title: 'Dhur',
    content: [
      {icon: JamaahIconImg, activity: 'Jama’ah'},
      {icon: AloneIconImg, activity: 'Alone'},
      {icon: AdhkarAfterIconImg, activity: 'Adhkar After'},
      {icon: RawatibIconImg, activity: 'Rawatib'},
    ],
  },
  {
    icon: AsrIconImg,
    title: 'Asr',
    content: [
      {icon: JamaahIconImg, activity: 'Jama’ah'},
      {icon: AloneIconImg, activity: 'Alone'},
      {icon: AdhkarAfterIconImg, activity: 'Adhkar After'},
      {icon: RawatibIconImg, activity: 'Rawatib'},
    ],
  },
  {
    icon: MaghribIconImg,
    title: 'Maghrib',
    content: [
      {icon: JamaahIconImg, activity: 'Jama’ah'},
      {icon: AloneIconImg, activity: 'Alone'},
      {icon: AdhkarAfterIconImg, activity: 'Adhkar After'},
      {icon: RawatibIconImg, activity: 'Rawatib'},
    ],
  },
  {
    icon: IshaiIconImg,
    title: "Isha'i",
    content: [
      {icon: JamaahIconImg, activity: 'Jama’ah'},
      {icon: AloneIconImg, activity: 'Alone'},
      {icon: AdhkarAfterIconImg, activity: 'Adhkar After'},
      {icon: RawatibIconImg, activity: 'Rawatib'},
    ],
  },
];

export const DAILY_ACTIVITIES = [
  {
    icon: NawafilIconImg,
    title: 'Nawafil',
    content: [
      {icon: TahajjudIconImg, activity: 'Tahajjud'},
      {icon: DhuaIconImg, activity: 'Dhua'},
      {icon: TaobahIconImg, activity: 'Taobah'},
      {icon: ShafiAndWitrIconImg, activity: 'Shafi & Witr'},
    ],
  },
  {
    icon: AdhkarIconImg,
    title: 'Adhkar',
    content: [
      {icon: MorningIconImg, activity: 'Morning'},
      {icon: EveningIconImg, activity: 'Evening'},
    ],
  },
  {
    icon: QuranIconImg,
    title: 'Qur’an',
    content: [
      {icon: TilawahIconImg, activity: 'Tilawah'},
      {icon: HifdhIconImg, activity: 'Hifdh'},
      {icon: MurajaahIconImg, activity: 'Muraja’ah'},
      {icon: TadaburIconImg, activity: 'Tadabur'},
    ],
  },
  {
    icon: HealthHabitsIconImg,
    title: 'Health Habits',
    content: [
      {icon: ExcerciseIconImg, activity: 'Daily Exercise'},
      {icon: BathIconImg, activity: 'Bath'},
      {icon: ToothBrushIconImg, activity: 'Tooth Brushing'},
      {icon: HealthyFoodIconImg, activity: 'Healthy Food'},
    ],
  },
  {
    icon: BooksIconImg,
    title: 'Book Reading',
    content: [
      {icon: IslamicBookIconImg, activity: 'Islamic Book'},
      {icon: SelfDevelopmentIconImg, activity: 'Self Development'},
    ],
  },
];

export const WEEKLY_ACTIVITIES = [
  {
    icon: FastingIconImg,
    title: 'Fasting',
    content: [
      {icon: MondayIconImg, activity: 'Monday'},
      {icon: ThursdayIconImg, activity: 'Thursday'},
    ],
  },
  {
    icon: FridaySunnahIconImg,
    title: 'Friday’s Sunnah',
    content: [
      {icon: ShoweringIconImg, activity: 'Showering'},
      {icon: NailCuttingIconImg, activity: 'Cutting of nails'},
      {icon: EarlyMosqueGoingIconImg, activity: 'Going to the Mosque early'},
      {icon: SuratulKhafIconImg, activity: 'Read suratul Al Khaf'},
      {
        icon: DuaBetweenAsrAndMaghribIconImg,
        activity: 'Dua between Asr & Maghrib',
      },
    ],
  },
  {
    icon: SadaqahIconImg,
    title: 'Sadaqah',
    content: [{icon: DonationIconImg, activity: 'Donate to the needy'}],
  },
  {
    icon: FamilySittingIconImg,
    title: 'Family Sitting',
    content: [
      {icon: FamilyDiscussionIconImg, activity: 'Discussion with Family'},
    ],
  },
  {
    icon: SelfEvaluationIconImg,
    title: 'Self Evaluation',
    content: [{icon: ChartUpIconImg, activity: 'Progress during the week'}],
  },
];

export const MONTHLY_ACTIVITIES = [
  {
    icon: FastingIconImg,
    title: 'Fasting',
    content: [
      {icon: ThirteenthIconImg, activity: '13th of the month'},
      {icon: FourteenthIconImg, activity: '14th of the month'},
      {icon: FifteenthIconImg, activity: '15th of the month'},
    ],
  },
  {
    icon: SavingMoneyIconImg,
    title: 'Saving Money',
    content: [
      {icon: CharityIconImg, activity: 'For charity'},
      {icon: WalletIconImg, activity: 'For oneself'},
    ],
  },
  {
    icon: ZiyaarahIconImg,
    title: 'Ziyaarah',
    content: [
      {icon: SoliheenIconImg, activity: 'Soliheen'},
      {icon: BrotherlyVisitIconImg, activity: 'Visit a Brother'},
      {icon: FamilySittingIconImg, activity: 'Visit a Family'},
      {icon: SickVisitationIconImg, activity: 'Visit the Sick'},
      {icon: CemetaryIconImg, activity: 'Visit the Cementry'},
    ],
  },
  {
    icon: SelfEvaluationIconImg,
    title: 'Self Evaluation',
    content: [
      {icon: DailyActivitiesIconImg, activity: 'Daily activities progress'},
      {icon: WeeklyActivitiesIconImg, activity: 'Weekly activities progress'},
      {icon: MonthlyActivitiesIconImg, activity: 'Monthly activities progress'},
    ],
  },
];

export const ALL_ACTIVITIES_FORMATTED: Activity[] = [
  ...SOLAH.map(solah => {
    return solah.content.map(content => ({
      ...content,
      title: solah.title,
      category: ActivityCategory.Solah,
      completed: false,
    }));
  }).flat(2),
  ...DAILY_ACTIVITIES.map(dailyActivities => {
    return dailyActivities.content.map(content => ({
      ...content,
      title: dailyActivities.title,
      category: ActivityCategory.Daily,
      completed: false,
    }));
  }).flat(2),
  ...WEEKLY_ACTIVITIES.map(weeklyActivities => {
    return weeklyActivities.content.map(content => ({
      ...content,
      title: weeklyActivities.title,
      category: ActivityCategory.Weekly,
      completed: false,
    }));
  }).flat(2),
  ...MONTHLY_ACTIVITIES.map(monthlyActivities => {
    return monthlyActivities.content.map(content => ({
      ...content,
      title: monthlyActivities.title,
      category: ActivityCategory.Monthly,
      completed: false,
    }));
  }).flat(2),
];

export const getActivitiesForCurrentDay =
  async (): Promise<ActivityStorage> => {
    const allActivities = await getActivities();

    let activitiesForTheDay = allActivities.find(
      activity =>
        new Date(activity.date).toLocaleDateString() ===
        new Date().toLocaleDateString(),
    );

    if (!activitiesForTheDay) {
      activitiesForTheDay = {
        data: ALL_ACTIVITIES_FORMATTED,
        date: new Date().toISOString(),
      };
      await setActivities([...allActivities, activitiesForTheDay]);
    }

    return activitiesForTheDay;
  };

export const updateActivitiesForCurrentDay = async (
  updatedActivities: Activity[],
  category: ActivityCategory,
) => {
  const allActivities = await getActivities();

  let activitiesForTheDay = await getActivitiesForCurrentDay();

  const activitiesForTheDayExcludingUpdated = activitiesForTheDay.data.filter(
    activity => activity.category !== category,
  );
  activitiesForTheDay.data = [
    ...activitiesForTheDayExcludingUpdated,
    ...updatedActivities,
  ];

  const allActivitiesExcludingCurrentDay = allActivities.filter(
    activity =>
      new Date(activity.date).toLocaleDateString() !==
      new Date().toLocaleDateString(),
  );
  await setActivities([
    ...allActivitiesExcludingCurrentDay,
    activitiesForTheDay,
  ]);
};

export const synchronizeActivities = async () => {
  let allActivities = await getActivities();

  const activitiesSortedByDate = allActivities.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const activitiesForLastRecordedDay = activitiesSortedByDate.pop();

  if (activitiesForLastRecordedDay) {
    let lastRecordDate = new Date(activitiesForLastRecordedDay.date);

    const daysSinceLastRecord = getDaysDifference(lastRecordDate, new Date());

    for (let i = 0; i < daysSinceLastRecord; i++) {
      lastRecordDate = new Date(activitiesForLastRecordedDay.date);
      const dateForDay = lastRecordDate.setDate(
        lastRecordDate.getDate() + (i + 1),
      );
      const activitiesForCurrentDay = {
        data: ALL_ACTIVITIES_FORMATTED,
        date: new Date(dateForDay).toISOString(),
      };
      await setActivities([...allActivities, activitiesForCurrentDay]);
      allActivities = await getActivities();
    }

    allActivities = await getActivities();
  }
};

export const getActivitiesForCurrentWeek = async (activityTitle?: string) => {
  const allActivities = await getActivities();

  let activitiesForCurrentWeek = allActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    const startOfTheWeek = getStartOfThisWeek();
    const endOfTheWeek = getEndOfThisWeek();
    return (
      activityDate.getTime() >= startOfTheWeek.getTime() &&
      activityDate.getTime() <= endOfTheWeek.getTime()
    );
  });

  if (activityTitle) {
    activitiesForCurrentWeek = activitiesForCurrentWeek.map(activity => {
      const data = activity.data.filter(
        act => act.title === activityTitle || act.category === activityTitle,
      );
      return {
        ...activity,
        data,
      };
    });
  }

  return activitiesForCurrentWeek;
};

export const getActivitiesForLastWeek = async (activityTitle?: string) => {
  const allActivities = await getActivities();

  let activitiesForLastWeek = allActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    const startOfLastWeek = getStartOfLastWeek();
    const endOfLastWeek = getEndOfLastWeek();
    return (
      activityDate.getTime() <= startOfLastWeek.getTime() &&
      activityDate.getTime() >= endOfLastWeek.getTime()
    );
  });

  if (activityTitle) {
    activitiesForLastWeek = activitiesForLastWeek.map(activity => {
      const data = activity.data.filter(
        act => act.title === activityTitle || act.category === activityTitle,
      );
      return {
        ...activity,
        data,
      };
    });
  }

  return activitiesForLastWeek;
};

export const groupActivities = (activities: Activity[]) => {
  const groupedActivities = activities.reduce((acc, activity) => {
    const {title} = activity;
    const activityIndex = acc.findIndex(act => act.title === title);
    if (activityIndex === -1) {
      acc.push({
        title,
        completedCount: 0,
        progress: 0,
        content: [activity],
      });
    } else {
      acc[activityIndex].content.push(activity);
    }
    return acc;
  }, [] as GroupedActivityEvaluation[]);
  groupedActivities.forEach(activity => {
    const completedActions = activity.content.filter(
      action => action.completed,
    ).length;
    activity.completedCount = completedActions;
    activity.progress = completedActions / activity.content.length;
  });
  return groupedActivities;
};
