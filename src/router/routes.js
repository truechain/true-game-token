import Home from '@/pages/Home'
import Personal from '@/pages/Personal'
import Exchange from '@/pages/Exchange'
import Details from '@/pages/Details'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/personal',
    name: 'Personal',
    component: Personal
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: Exchange
  },
  {
    path: '/details',
    name: 'Details',
    component: Details
  }
]
