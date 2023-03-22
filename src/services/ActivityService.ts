import {Between, FindOptionsWhere, In} from 'typeorm';
import {AppDataSource} from '../database/config';
import {
  Activity as IActivity,
  ActivityType,
  EvaluationGroup,
  FilterType,
  GroupedActivityEvaluation,
  TotalEvaluationGroup,
  TotalGroupedActivityEvaluation,
} from '../types/global';
import {Activity} from '../database/entities/Activity';
import {ActivityCategory} from '../types/global';
import {ALL_ACTIVITIES_FORMATTED, SOLAH} from '../utils/activities';
import {
  getDaysDifference,
  getStartOfThisWeek,
  getEndOfThisWeek,
  getStartOfLastWeek,
  getEndOfLastWeek,
  getStartOfThisMonth,
  getEndOfThisMonth,
  getWeeksDifference,
  getMonthsDifference,
} from '../utils/global';

export class ActivityService {
  private static activityRepository = AppDataSource.getRepository(Activity);

  static async find(filter?: FindOptionsWhere<Activity>) {
    const activities = await this.activityRepository.find({where: filter});
    return activities;
  }

  static async create(activity: IActivity) {
    const newActivity = this.activityRepository.create(activity);
    return await this.activityRepository.save(newActivity);
  }

  static async createMany(activities: IActivity[]) {
    const newActivities = this.activityRepository.create(activities);
    return await this.activityRepository.save(newActivities);
  }

  static async handleSolahActivityUpdate(
    activity: Partial<Activity>,
    activityToUpdate: Activity,
  ) {
    const JAMAAH_TITLE = 'Jama’ah';
    const ALONE_TITLE = 'Alone';
    if (
      activityToUpdate.category === ActivityCategory.Solah &&
      (activityToUpdate.title === JAMAAH_TITLE ||
        activityToUpdate.title === ALONE_TITLE)
    ) {
      const counterPartTitle =
        activityToUpdate.title === JAMAAH_TITLE ? ALONE_TITLE : JAMAAH_TITLE;
      const startOfActivityToUpdateDate = new Date(
        activityToUpdate.createdAt.setHours(0, 0, 0, 0),
      );
      const endOfActivityToUpdateDate = new Date(
        activityToUpdate.createdAt.setHours(23, 59, 59, 999),
      );
      const counterPart = await this.activityRepository.findOneBy({
        title: counterPartTitle,
        category: ActivityCategory.Solah,
        group: activityToUpdate.group,
        createdAt: Between(
          startOfActivityToUpdateDate,
          endOfActivityToUpdateDate,
        ),
      });
      const counterPartData = SOLAH.find(
        solah => solah.group === activityToUpdate.group,
      )!.activities.find(act => act.title === counterPartTitle);
      if (activity.completed && counterPart) {
        await this.removeActivities([counterPart.id]);
      } else if (!activity.completed) {
        await this.create({
          icon: counterPartData!.icon,
          title: counterPartTitle,
          category: ActivityCategory.Solah,
          group: activityToUpdate.group,
          order: activityToUpdate.order,
          completed: false,
        });
      }
    }
  }

  static async update(id: string, activity: Partial<Activity>) {
    let activityToUpdate = await this.activityRepository.findOneBy({id});
    if (activityToUpdate) {
      await this.handleSolahActivityUpdate(activity, activityToUpdate);
      this.activityRepository.merge(activityToUpdate, activity);
      activityToUpdate = await this.activityRepository.save(activityToUpdate);
    }
    return activityToUpdate;
  }

  static async deleteAll() {
    await this.activityRepository.delete({});
  }

  static async createMissingActivitiesForToday(
    filter?: FindOptionsWhere<Activity>,
  ) {
    // Get daily activities for today
    const beginningOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

    const dailyActivitiesForToday = await this.activityRepository.find({
      where: {
        category: In([ActivityCategory.Daily, ActivityCategory.Solah]),
        createdAt: Between(beginningOfToday, endOfToday),
      },
    });
    if (dailyActivitiesForToday.length === 0) {
      const customDailyActivities = await this.activityRepository.find({
        where: {
          category: ActivityCategory.Daily,
          type: ActivityType.CUSTOM,
        },
        select: {
          id: false,
          createdAt: false,
          updatedAt: false,
        },
      });
      const dailyDefaultActivitiesToCreate = ALL_ACTIVITIES_FORMATTED.filter(
        activity =>
          activity.category === ActivityCategory.Daily ||
          activity.category === ActivityCategory.Solah,
      );
      dailyDefaultActivitiesToCreate.push(...customDailyActivities);
      const dailyActivitiesToCreateWithDate =
        dailyDefaultActivitiesToCreate.map(activity => ({
          ...activity,
          createdAt: new Date(),
        }));
      await this.createMany(dailyActivitiesToCreateWithDate);
    }

    // Get weekly activities for the week
    const beginningOfThisWeek = getStartOfThisWeek();
    const endOfThisWeek = getEndOfThisWeek();
    let weeklyActivitiesForThisWeek = await this.activityRepository.find({
      where: {
        category: ActivityCategory.Weekly,
        createdAt: Between(beginningOfThisWeek, endOfThisWeek),
      },
    });
    if (weeklyActivitiesForThisWeek.length === 0) {
      const customWeeklyActivities = await this.activityRepository.find({
        where: {
          category: ActivityCategory.Weekly,
          type: ActivityType.CUSTOM,
        },
        select: {
          id: false,
          createdAt: false,
          updatedAt: false,
        },
      });
      const weeklyDefaultActivitiesToCreate = ALL_ACTIVITIES_FORMATTED.filter(
        activity => activity.category === ActivityCategory.Weekly,
      );
      weeklyDefaultActivitiesToCreate.push(...customWeeklyActivities);
      const weeklyActivitiesToCreateWithDate =
        weeklyDefaultActivitiesToCreate.map(activity => ({
          ...activity,
          createdAt: new Date(),
        }));
      await this.createMany(weeklyActivitiesToCreateWithDate);
    }

    // Get monthly activities for the month
    const beginningOfThisMonth = getStartOfThisMonth();
    const endOfThisMonth = getEndOfThisMonth();
    let monthlyActivitiesForThisMonth = await this.activityRepository.find({
      where: {
        category: ActivityCategory.Monthly,
        createdAt: Between(beginningOfThisMonth, endOfThisMonth),
      },
    });
    if (monthlyActivitiesForThisMonth.length === 0) {
      const customMonthlyActivities = await this.activityRepository.find({
        where: {
          category: ActivityCategory.Monthly,
          type: ActivityType.CUSTOM,
        },
        select: {
          id: false,
          createdAt: false,
          updatedAt: false,
        },
      });
      const monthlyDefaultActivitiesToCreate = ALL_ACTIVITIES_FORMATTED.filter(
        activity => activity.category === ActivityCategory.Monthly,
      );
      monthlyDefaultActivitiesToCreate.push(...customMonthlyActivities);
      const monthlyActivitiesTroCreateWithDate =
        monthlyDefaultActivitiesToCreate.map(activity => ({
          ...activity,
          createdAt: new Date(),
        }));
      await this.createMany(monthlyActivitiesTroCreateWithDate);
    }

    const activitiesForTheDay = await this.activityRepository.find({
      where: {
        ...filter,
        createdAt: Between(beginningOfToday, endOfToday),
      },
    });

    return activitiesForTheDay;
  }

  static async getOrCreateForToday(filter?: FindOptionsWhere<Activity>) {
    const activitiesForTheDay = await this.createMissingActivitiesForToday(
      filter,
    );
    return activitiesForTheDay;
  }

  static async getOrCreateForThisWeek(filter?: FindOptionsWhere<Activity>) {
    await this.createMissingActivitiesForToday(filter);
    const beginningOfThisWeek = getStartOfThisWeek();
    const endOfThisWeek = getEndOfThisWeek();
    const activitiesForThisWeek = await this.activityRepository.find({
      where: {
        ...filter,
        createdAt: Between(beginningOfThisWeek, endOfThisWeek),
      },
    });
    return activitiesForThisWeek;
  }

  static async getOrCreateForThisMonth(filter?: FindOptionsWhere<Activity>) {
    await this.createMissingActivitiesForToday(filter);
    const beginningOfThisMonth = getStartOfThisMonth();
    const endOfThisMonth = getEndOfThisMonth();
    const activitiesForThisMonth = await this.activityRepository.find({
      where: {
        ...filter,
        createdAt: Between(beginningOfThisMonth, endOfThisMonth),
      },
    });
    return activitiesForThisMonth;
  }

  static async groupDailyEvaluation(
    activityGroupOrCategory?: string,
    customDate?: Date,
  ) {
    const date = customDate ? customDate : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const activityInGroups: EvaluationGroup[] = await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.title', 'title')
      .addSelect('activity.group', 'group')
      .addSelect('activity.category', 'category')
      .addSelect('activity.completed', 'completed')
      .where('activity.createdAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .andWhere(
        activityGroupOrCategory
          ? '(activity.group = :activityGroupOrCategory OR activity.category = :activityGroupOrCategory)'
          : '1=1',
        {
          activityGroupOrCategory,
        },
      )
      .orderBy('activity.order', 'ASC')
      .getRawMany();

    let activityGroups: GroupedActivityEvaluation[] =
      await this.activityRepository
        .createQueryBuilder('activity')
        .select('activity.title', 'title')
        .addSelect('activity.group', 'group')
        .addSelect(
          'SUM(CASE WHEN activity.completed = true THEN 1 ELSE 0 END)',
          'completedCount',
        )
        .addSelect('COUNT(title)', 'totalCount')
        .addSelect(
          'ROUND(SUM(CASE WHEN activity.completed = true THEN 1 ELSE 0 END) / COUNT(title), 2)',
          'progress',
        )
        .where('activity.createdAt BETWEEN :startOfDay AND :endOfDay', {
          startOfDay,
          endOfDay,
        })
        .andWhere(
          activityGroupOrCategory
            ? '(activity.group = :activityGroupOrCategory OR activity.category = :activityGroupOrCategory)'
            : '1=1',
          {
            activityGroupOrCategory,
          },
        )
        .groupBy('activity.group')
        .orderBy('activity.order', 'ASC')
        .getRawMany();

    activityGroups = activityGroups.map(groupedEvaluation => {
      const activitiesInGroup = activityInGroups.filter(
        activity =>
          activity.group === groupedEvaluation.group ||
          activity.category === groupedEvaluation.group,
      );

      return {
        ...groupedEvaluation,
        progress:
          groupedEvaluation.completedCount / groupedEvaluation.totalCount,
        activities: activitiesInGroup,
      };
    });

    return activityGroups;
  }

  static async groupPeriodicEvaluation(
    filter: Exclude<FilterType, FilterType.TODAY>,
    activityGroup?: string,
    activityCategory?: ActivityCategory,
  ) {
    let startDate: Date, endDate: Date;
    switch (filter) {
      case FilterType.THIS_WEEK:
        startDate = getStartOfThisWeek();
        endDate = getEndOfThisWeek();
        break;
      case FilterType.LAST_WEEK:
        startDate = getStartOfLastWeek();
        endDate = getEndOfLastWeek();
        break;
      default:
        startDate = getStartOfThisMonth();
        endDate = getEndOfThisMonth();
        break;
    }

    const activityInGroups: TotalEvaluationGroup[] =
      await this.activityRepository
        .createQueryBuilder('activity')
        .select('activity.title', 'title')
        .addSelect('activity.group', 'group')
        .addSelect('activity.category', 'category')
        .addSelect(
          'SUM(CASE WHEN activity.completed = true THEN 1 ELSE 0 END)',
          'completedCount',
        )
        .where('activity.createdAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .andWhere(activityGroup ? 'activity.group = :activityGroup' : '1=1', {
          activityGroup,
        })
        .andWhere(
          activityCategory ? 'activity.category = :activityCategory' : '1=1',
          {
            activityCategory,
          },
        )
        .groupBy('activity.title')
        .orderBy('activity.order', 'ASC')
        .getRawMany();

    let activityGroups: TotalGroupedActivityEvaluation[] =
      await this.activityRepository
        .createQueryBuilder('activity')
        .select('activity.group', 'group')
        .addSelect('activity.category', 'category')
        .where('activity.createdAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .andWhere(activityGroup ? 'activity.group = :activityGroup' : '1=1', {
          activityGroup,
        })
        .andWhere(
          activityCategory ? 'activity.category = :activityCategory' : '1=1',
          {
            activityCategory,
          },
        )
        .groupBy('activity.group')
        .orderBy('activity.order', 'ASC')
        .getRawMany();

    let totalCompleted = 0,
      totalCountForAllGroups = 0;

    const dailyCategories = [ActivityCategory.Daily, ActivityCategory.Solah];

    activityGroups = activityGroups.map(groupedEvaluation => {
      let activitiesInGroup = activityInGroups.filter(
        activity =>
          activity.group === groupedEvaluation.group ||
          activity.category === groupedEvaluation.group,
      );

      activitiesInGroup = activitiesInGroup.map(activity => {
        let TOTAL_ACTIVITY_COUNT = 30;

        if (filter === FilterType.MONTHLY) {
          if (dailyCategories.includes(activity.category)) {
            TOTAL_ACTIVITY_COUNT = 30;
          } else if (activity.category === ActivityCategory.Weekly) {
            TOTAL_ACTIVITY_COUNT = 4;
          } else {
            TOTAL_ACTIVITY_COUNT = 1;
          }
        } else {
          if (dailyCategories.includes(activity.category)) {
            TOTAL_ACTIVITY_COUNT = 7;
          } else if (activity.category === ActivityCategory.Weekly) {
            TOTAL_ACTIVITY_COUNT = 1;
          } else {
            TOTAL_ACTIVITY_COUNT = 1;
          }
        }

        totalCompleted += activity.completedCount;
        totalCountForAllGroups += TOTAL_ACTIVITY_COUNT;
        return {
          ...activity,
          totalCount: TOTAL_ACTIVITY_COUNT,
        };
      });

      return {
        ...groupedEvaluation,
        activities: activitiesInGroup,
      };
    });

    const totalProgress = totalCompleted / totalCountForAllGroups;

    activityGroups = activityGroups.map(group => ({
      ...group,
      progress: parseFloat(totalProgress.toFixed(4)),
    }));

    return activityGroups;
  }

  static async synchronizeActivities() {
    let allMissingActivities: IActivity[] = [];

    const mostRecentDailyActivity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.category = :category', {
        category: ActivityCategory.Daily,
      })
      .orWhere('activity.category = :category', {
        category: ActivityCategory.Solah,
      })
      .select('MAX(activity.createdAt)', 'createdAt')
      .getRawOne();
    const missingDailyActivities = [];
    if (mostRecentDailyActivity && mostRecentDailyActivity.createdAt !== null) {
      const customDailyActivities = await this.activityRepository.find({
        where: {
          category: ActivityCategory.Daily,
          type: ActivityType.CUSTOM,
        },
        select: {
          id: false,
          createdAt: false,
          updatedAt: false,
        },
      });
      let lastDailyActivityRecordDate = new Date(
        mostRecentDailyActivity.createdAt,
      );
      const daysSinceLastRecord = getDaysDifference(
        lastDailyActivityRecordDate,
        new Date(),
      );
      for (let i = 0; i < daysSinceLastRecord; i++) {
        lastDailyActivityRecordDate = new Date(
          mostRecentDailyActivity.createdAt,
        );
        const dateForDay = lastDailyActivityRecordDate.setDate(
          lastDailyActivityRecordDate.getDate() + (i + 1),
        );
        const defaultMissingActivitiesForDay = ALL_ACTIVITIES_FORMATTED.filter(
          activity =>
            activity.category === ActivityCategory.Daily ||
            activity.category === ActivityCategory.Solah,
        );
        defaultMissingActivitiesForDay.push(...customDailyActivities);
        const missingActivitiesForDayWithDate =
          defaultMissingActivitiesForDay.map(activity => ({
            ...activity,
            createdAt: new Date(dateForDay),
          }));
        missingDailyActivities.push(...missingActivitiesForDayWithDate);
      }
    }

    const mostRecentWeeklyActivity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.category = :category', {
        category: ActivityCategory.Weekly,
      })
      .select('MAX(activity.createdAt)', 'createdAt')
      .getRawOne();
    const missingWeeklyActivities = [];
    if (
      mostRecentWeeklyActivity &&
      mostRecentWeeklyActivity.createdAt !== null
    ) {
      const customWeeklyActivities = await this.activityRepository.find({
        where: {
          category: ActivityCategory.Weekly,
          type: ActivityType.CUSTOM,
        },
        select: {
          id: false,
          createdAt: false,
          updatedAt: false,
        },
      });
      let lastWeeklyActivityRecordDate = new Date(
        mostRecentWeeklyActivity.createdAt,
      );
      const weeksSinceLastRecord = getWeeksDifference(
        lastWeeklyActivityRecordDate,
        new Date(),
      );
      for (let i = 0; i < weeksSinceLastRecord; i++) {
        lastWeeklyActivityRecordDate = new Date(
          mostRecentWeeklyActivity.createdAt,
        );
        const dateForWeek = lastWeeklyActivityRecordDate.setDate(
          lastWeeklyActivityRecordDate.getDate() + (i + 1) * 7,
        );
        const defaultMissingActivitiesForWeek = ALL_ACTIVITIES_FORMATTED.filter(
          activity => activity.category === ActivityCategory.Weekly,
        );
        defaultMissingActivitiesForWeek.push(...customWeeklyActivities);
        const missingActivitiesForWeekWithDate =
          defaultMissingActivitiesForWeek.map(activity => ({
            ...activity,
            createdAt: new Date(dateForWeek),
          }));
        missingWeeklyActivities.push(...missingActivitiesForWeekWithDate);
      }
    }

    const mostRecentMonthlyActivity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.category = :category', {
        category: ActivityCategory.Monthly,
      })
      .select('MAX(activity.createdAt)', 'createdAt')
      .getRawOne();
    const missingMonthlyActivities = [];
    if (
      mostRecentMonthlyActivity &&
      mostRecentMonthlyActivity.createdAt !== null
    ) {
      const customMonthlyActivities = await this.activityRepository.find({
        where: {
          category: ActivityCategory.Monthly,
          type: ActivityType.CUSTOM,
        },
        select: {
          id: false,
          createdAt: false,
          updatedAt: false,
        },
      });
      let lastMonthlyActivityRecordDate = new Date(
        mostRecentMonthlyActivity.createdAt,
      );
      const monthsSinceLastRecord = getMonthsDifference(
        lastMonthlyActivityRecordDate,
        new Date(),
      );
      for (let i = 0; i < monthsSinceLastRecord; i++) {
        lastMonthlyActivityRecordDate = new Date(
          mostRecentMonthlyActivity.createdAt,
        );
        const dateForMonth = lastMonthlyActivityRecordDate.setMonth(
          lastMonthlyActivityRecordDate.getMonth() + (i + 1),
        );
        const defaultMissingActivitiesForMonth =
          ALL_ACTIVITIES_FORMATTED.filter(
            activity => activity.category === ActivityCategory.Monthly,
          );
        defaultMissingActivitiesForMonth.push(...customMonthlyActivities);
        const missingActivitiesForMonthWithDate =
          defaultMissingActivitiesForMonth.map(activity => ({
            ...activity,
            createdAt: new Date(dateForMonth),
          }));
        missingMonthlyActivities.push(...missingActivitiesForMonthWithDate);
      }
    }

    allMissingActivities = [
      ...missingDailyActivities,
      ...missingWeeklyActivities,
      ...missingMonthlyActivities,
    ];
    await this.createMany(allMissingActivities);
    await this.getOrCreateForToday();
  }

  static async test() {
    let customDailyActivities = [
      {
        createdAt: '2023-03-21T12:42:45.844Z',
        updatedAt: '2023-03-21T12:42:45.000Z',
        icon: 13,
        order: 1,
        group: 'Fajr',
        category: ActivityCategory.Solah,
        title: 'Jama’ah',
        completed: true,
      },
      {
        createdAt: '2023-03-21T12:42:45.844Z',
        updatedAt: '2023-03-21T12:42:45.000Z',
        icon: 14,
        order: 2,
        group: 'Fajr',
        category: ActivityCategory.Solah,
        title: 'Alone',
        completed: false,
      },
    ];
    await this.createMany(customDailyActivities);
  }

  static async getFirstRecordedDay() {
    const firstDay = await this.activityRepository
      .createQueryBuilder('activity')
      .select('MIN(activity.createdAt)', 'createdAt')
      .getRawOne();

    return firstDay.createdAt;
  }

  static async getLowestActivityOrder() {
    const lowestOrder = await this.activityRepository
      .createQueryBuilder('activity')
      .select('MAX(activity.order)', 'order')
      .getRawOne();

    return lowestOrder.order as number;
  }

  static async getCustomActivityCount(category?: ActivityCategory) {
    const customActivityCount = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.type = :type', {
        type: ActivityType.CUSTOM,
      })
      .andWhere(category ? 'activity.category = :category' : '1=1', {
        category,
      })
      .getCount();

    return customActivityCount;
  }

  static async removeActivities(ids: string[]) {
    await this.activityRepository.delete(ids);
  }
}
