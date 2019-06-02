import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import Vue2TouchEvents from 'vue2-touch-events';
Vue.use(Vue2TouchEvents);
Vue.config.productionTip = false;
import { VueMaskDirective } from 'v-mask';
import Notifications from 'vue-notification';
Vue.use(Notifications);
Vue.directive('mask', VueMaskDirective);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
