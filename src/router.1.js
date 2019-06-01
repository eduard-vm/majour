import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import StudetsLayout from './layouts/StudetsLayout';
import StudetsIndex from './views/Students/Index';
import AddStudentForm from './views/Students/AddStudentForm';

Vue.use(Router);

export default new Router({
  mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
    {
      path: '/students',
      component: StudetsLayout,
      children: [
        {
          path: '',
          name: 'Students',
          component: StudetsIndex,
        },
        {
          path: 'add',
          name: 'AddNewStudent',
          component: AddStudentForm,
        },
      ],
    },
  ],
});
