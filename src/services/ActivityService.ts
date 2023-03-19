import {Between, FindOptionsWhere} from 'typeorm';
import {AppDataSource} from '../database/config';
import {
  Activity as IActivity,
  EvaluationGroup,
  FilterType,
  GroupedActivityEvaluation,
  TotalEvaluationGroup,
  TotalGroupedActivityEvaluation,
} from '../types/global';
import {Activity} from '../database/entities/Activity';
import {ALL_ACTIVITIES_FORMATTED} from '../utils/activities';
import {
  getDaysDifference,
  getStartOfThisWeek,
  getEndOfThisWeek,
  getStartOfLastWeek,
  getEndOfLastWeek,
} from '../utils/global';

export class ActivityService {
  private static activityRepository = AppDataSource.getRepository(Activity);

  static async find(filter?: FindOptionsWhere<Activity>) {
    const activities = await this.activityRepository.find({where: filter});
    return activities;
  }

  static async create(activity: Omit<IActivity, 'icon'>) {
    const newActivity = this.activityRepository.create(activity);
    return await this.activityRepository.save(newActivity);
  }

  static async createMany(activities: Omit<IActivity, 'icon'>[]) {
    const newActivities = this.activityRepository.create(activities);
    return await this.activityRepository.save(newActivities);
  }

  static async update(id: string, activity: Partial<Activity>) {
    let activityToUpdate = await this.activityRepository.findOneBy({id});
    if (activityToUpdate) {
      this.activityRepository.merge(activityToUpdate, activity);
      activityToUpdate = await this.activityRepository.save(activityToUpdate);
    }
    return activityToUpdate;
  }

  static async deleteAll() {
    await this.activityRepository.delete({});
  }

  static async getOrCreateForToday(filter?: FindOptionsWhere<Activity>) {
    const beginningOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

    let activities = await this.activityRepository.find({
      where: {
        ...filter,
        createdAt: Between(beginningOfToday, endOfToday),
      },
    });

    if (activities.length === 0) {
      const activitiesToCreate = ALL_ACTIVITIES_FORMATTED.map(activity => ({
        ...activity,
        createdAt: new Date(),
      }));
      await this.createMany(activitiesToCreate);

      activities = await this.activityRepository.find({
        where: {
          createdAt: Between(beginningOfToday, endOfToday),
        },
      });
    }

    return activities;
  }

  static async groupDailyEvaluation(
    activityGroupOrCategory?: string,
    customDate?: Date,
  ) {
    const date = customDate ? customDate : new Date();

    const activityInGroups: EvaluationGroup[] = await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.title', 'title')
      .addSelect('activity.group', 'group')
      .addSelect('activity.category', 'category')
      .addSelect('activity.completed', 'completed')
      .where('DATE(activity.createdAt) = :date', {
        date: date.toISOString().slice(0, 10),
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
        .where('DATE(activity.createdAt) = :date', {
          date: date.toISOString().slice(0, 10),
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
    customStartDate?: Date,
    customEndDate?: Date,
  ) {
    let startDate: Date, endDate: Date;
    const TOTAL_ACTIVITY_COUNT = filter === FilterType.MONTHLY ? 30 : 7;

    if (customStartDate) {
      startDate = new Date(customStartDate.setHours(0, 0, 0, 0));
      if (customEndDate) {
        endDate = new Date(customEndDate.setHours(23, 59, 59, 999));
      } else {
        endDate = new Date(new Date().setHours(23, 59, 59, 999));
      }
    } else {
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
          startDate = new Date(new Date().setHours(0, 0, 0, 0));
          endDate = new Date(new Date().setHours(23, 59, 59, 999));
          break;
      }
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
        .groupBy('activity.title')
        .orderBy('activity.order', 'ASC')
        .getRawMany();

    let activityGroups: TotalGroupedActivityEvaluation[] =
      await this.activityRepository
        .createQueryBuilder('activity')
        .select('activity.group', 'group')
        .where('activity.createdAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .andWhere('activity.group = :activityGroup', {
          activityGroup,
        })
        .groupBy('activity.group')
        .orderBy('activity.order', 'ASC')
        .getRawMany();

    let totalCompleted = 0,
      totalCountForAllGroups = 0;

    activityGroups = activityGroups.map(groupedEvaluation => {
      let activitiesInGroup = activityInGroups.filter(
        activity =>
          activity.group === groupedEvaluation.group ||
          activity.category === groupedEvaluation.group,
      );

      activitiesInGroup = activitiesInGroup.map(activity => {
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
    const mostRecentActivity = await this.activityRepository
      .createQueryBuilder('activity')
      .select('MAX(activity.createdAt)', 'createdAt')
      .getRawOne();

    if (mostRecentActivity) {
      const missingActivities = [];

      let lastRecordDate = new Date(mostRecentActivity.createdAt);

      const daysSinceLastRecord = getDaysDifference(lastRecordDate, new Date());

      for (let i = 0; i < daysSinceLastRecord; i++) {
        lastRecordDate = new Date(mostRecentActivity.createdAt);
        const dateForDay = lastRecordDate.setDate(
          lastRecordDate.getDate() + (i + 1),
        );
        const missingActivitiesForDay = ALL_ACTIVITIES_FORMATTED.map(
          activity => ({
            ...activity,
            createdAt: new Date(dateForDay).toISOString(),
          }),
        );
        missingActivities.push(...missingActivitiesForDay);
      }

      await this.createMany(missingActivities);
    }
    await this.getOrCreateForToday();
  }

  static async test() {}

  static async getFirstDay() {
    const firstDay = await this.activityRepository
      .createQueryBuilder('activity')
      .select('MIN(activity.createdAt)', 'createdAt')
      .getRawOne();

    return firstDay.createdAt;
  }
}
