import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Loading from 'vue-loading-overlay'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-loading-overlay/dist/vue-loading.css'

import App from './App.vue'
import router from './router'

import categories from '@/data/categories.js'
import items from '@/data/items.js'
import materials from '@/data/materials.js'

var _ = require('lodash')

const low = require('lowdb')
const LocalStorage = require('lowdb/adapters/LocalStorage')
const adapter = new LocalStorage('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ categories: [], items: [], materials: [] })
.write()

db.set('categories', categories).set('items', items).set('materials', materials)
.write()

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(Loading)

Vue.prototype.$_ = _
Vue.prototype.$db = db

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
