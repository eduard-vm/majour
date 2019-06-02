import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import StudetsLayout from '@/layouts/StudetsLayout';
import AddStudentForm from '@/views/Students/AddStudentForm';
import StudentsIndex from '@/views/Students/Index';
import Calendar from '@/views/Calendar/Index';

Vue.use(Router);

export default new Router({
  // mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  mode: 'history',
  // base: process.env.BASE_URL || '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
    },
    {
      path: '/students',
      // component: () => import('./layouts/StudetsLayout.vue'),
      component: StudetsLayout,
      children: [
        {
          path: 'add',
          name: 'AddNewStudent',
          component: AddStudentForm,
        },
        {
          path: '/',
          name: 'StudentsMain',
          // component: () => import('./views/Students/Index.vue'),
          component: StudentsIndex,
        },
      ],
    },
  ],
});
