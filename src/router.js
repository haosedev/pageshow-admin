import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/index'
// import List from '@/components/list'

Vue.use(Router)
export default new Router({
  routes: [{
  //   component: List,
  //   path: '/'
  // }, {
    component: Main,
    path: '/'
  }]
})