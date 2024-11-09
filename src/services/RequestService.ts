import {SolahApiData} from '../types/global';
import {getCoordinates} from '../utils/storage';

export class RequestService {
  static async getSolahTimings() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const coordinates = await getCoordinates();
    const URL = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&method=5`;

    try {
      const response = await fetch(URL);
      const data = await response.json();
      return data;
    } catch (err: any) {
      throw err;
    }
  }
}
