import Home from '@/pages/Home'
import Personal from '@/pages/Personal'
import Friends from '@/pages/Friends'
import Intro from '@/pages/Intro'
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
    path: '/friends',
    name: 'Friends',
    component: Friends
  },
  {
    path: '/intro',
    name: 'Intro',
    component: Intro
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
