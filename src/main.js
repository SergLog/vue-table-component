import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import { store } from './store/index.js'

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')




