import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './language'

import './style.styl'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')
