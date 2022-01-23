import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Home = () =>
    import ( /* webpackChunkName: "WebHome" */ '../components/Home');

const router = new VueRouter({
    routes: [{
        path: '/',
        component: Home,
        meta: {
            title: "Home"
        }
    }, ],
    mode: 'history'
});

export default router;