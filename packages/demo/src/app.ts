import { createApp } from 'vue';

import createDatetime from 'vue-datetime';

import DemoApp from './views/DemoApp.vue';

import './app.css';
// import '../../lib/dist/style.css';

const app = createApp(DemoApp);
app.use(createDatetime());

app.mount('#app');
