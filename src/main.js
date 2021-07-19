import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from './store'
import axios from 'axios'
import './styles'

Vue.prototype.axios = axios

Vue.config.productionTip = false
Vue.use(Vuex)
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')