import {DataSource} from 'typeorm';
import {SqliteConnectionOptions} from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import Config from 'react-native-config';
import {Activity} from './entities/Activity';

export const AppDataSource = new DataSource({
  type: Config.TYPEORM_CONNECTION as string as SqliteConnectionOptions['type'],
  synchronize: Config.TYPEORM_SYNCHRONIZE as unknown as boolean,
  database: 'default',
  entities: [Activity],
});

export const connectDB = async () => {
  await AppDataSource.initialize()
    .then(async () => {
      console.log('Database connected');
      // show all tables in the database
      AppDataSource.query(
        'SELECT name FROM sqlite_master WHERE type="table"',
      ).then((tables: any) => {
        console.log('Tables in the database: ', tables);
      });
    })
    .catch(error => {
      console.log('Database connection failed', error);
    });
};
