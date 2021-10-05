import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import 'dayjs/locale/ja.js';

export class DayjsWrapper {
  #dayjs;

  constructor(...args) {
    // Day.jsの設定諸々
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.tz.setDefault('Asia/Tokyo');
    dayjs.locale('ja');

    if (args.length === 0) {
      this.#dayjs = dayjs.tz();
    } else {
      this.#dayjs = dayjs(...args).tz();
    }
  }

  getCurrentDate(fmt) {
    return this.#dayjs.format(fmt);
  }

  checkCurrentDay(...args) {
    const day = this.#dayjs.day();

    for (const i of args) {
      if (i === day) {
        return true;
      }
    }

    return false;
  }
}
