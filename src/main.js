import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
// import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false;

// api
import {get, post } from './api';
Vue.prototype.$GET = get;
Vue.prototype.$POST = post;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");