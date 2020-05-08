import { addEventListener } from '@react-native-community/netinfo';
import PushNotification from 'react-native-push-notification';

const NET_NOTIFY_TIMEOUT = 60 * 60 * 1000;
const CELLULAR = 'cellular';

let lastNotifyTime;
let unsubscribe;
let isCellularConnection = false;

export default class NetInfoService {
  static start() {
    unsubscribe = addEventListener(state => {
      if (!isCellularConnection && this.checkCellularConnection(state)) {
        if (
          !lastNotifyTime ||
          new Date().getTime() - lastNotifyTime > NET_NOTIFY_TIMEOUT
        ) {
          this.notify();
        }
      }
      isCellularConnection = this.checkCellularConnection(state);
    });
  }

  static notify() {
    //Save the time of the last notification so as not to notify the user every time he turns on cellular
    lastNotifyTime = new Date().getTime();

    PushNotification.localNotification({
      title: 'Net',
      message: 'Net',
    });
  }

  static checkCellularConnection(data) {
    return data.type === CELLULAR;
  }

  static stop() {
    unsubscribe();
  }
}
