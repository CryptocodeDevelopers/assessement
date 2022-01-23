import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router/router';

import * as config from "./config";
Vue.prototype.$cf = config;

Vue.config.productionTip = false;

router.beforeEach((to, path, next) => {
    const getTitle = to.meta.title;
    document.title = getTitle + ' | Assessment';
    next();
});

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')