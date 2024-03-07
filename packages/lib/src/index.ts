import { App } from 'vue';

import Datetime from './DateTime.vue';
import DatetimePopup from './DatetimePopup.vue';

export default function createDatetime() {
  const install = (app: App) => {
    app.component('DateTime', Datetime);
    app.component('DateTimePopup', DatetimePopup);
  };

  return { install };
}
const version = '__VERSION__';
createDatetime.version = version;

// Export all views too
export {
  Datetime,
  DatetimePopup,
  version,
};
