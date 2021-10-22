import Vue from 'vue'
import App from './App.vue'
import store from './store'
import buefy from 'buefy'
import 'buefy/dist/buefy.css'
import moment from 'moment'

Vue.config.productionTip = false
// Доступные опции buefy здесь:
// https://buefy.org/documentation/constructor-options
// Если встретится латиница в интерфейес, то стоит
// сначала попробовать добавить перевод здесь и, если не получается,
// то менять текст у отдельного экземпляра компонента
Vue.use(buefy, {
  defaultDialogCancelText: "Отмена",
  defaultDialogConfirmText: "Принять"
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')