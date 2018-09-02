/* eslint-disable */
import AC from '@components/AsyncLoadComponent/AsyncLoadComponent.js'

const routes = [{
  name: '主页',
  icon: 'home',
  path: '/',
  component: AC(() => import('@views/Home/Home.js'))
}]

export default routes