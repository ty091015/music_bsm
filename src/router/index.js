import {createRouter, createWebHashHistory} from 'vue-router'
import Layout from "../views/Layout";
import Login from "../views/login/Login";
import User from '../views/component/user/User';
import Singer from "../views/component/singer/Singer";
import Song from "../views/component/song/Song";

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/user',
        name: 'User',
        component: User
      },
      {
        path: '/singer',
        name: 'Singer',
        component: Singer
      },
      {
        path: '/song',
        name: 'Song',
        component: Song
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
