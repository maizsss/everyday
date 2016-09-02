import Vue from 'vue';
import Vuex from 'vuex';
/* commpents */
import index_page from "../components/index-page.vue";
import about_page from "../components/about-page.vue";
import schedule_edit_page from "../components/schedule-edit-page.vue";
import sign_page from "../components/sign-page.vue";

import bottom_toolbar from "../components/bottom-toolbar.vue";

import networkError from "../components/network_error_page.vue"; //404错误页面

Vue.use(Vuex);
Vue.config.debug = true;
// Vue.config.silent = true;

import store from '../store/index.js';
import '../api/filters.js'; //公共函数库

/*
    监听页面初始化事件
*/
$$(document).on('pageInit', function (e) {
    const page = e.detail.page;
    console.log(page.name);
   
    if (page.name === 'index-page') {
        // let indexPage = new Vue(index_page);
        // indexPage.$mount('#index-page');
        
    }

    if (page.name === 'about-page') {
        let aboutPage = new Vue(about_page);
        aboutPage.$mount('#about-page');
        
    }

    if (page.name === 'schedule-edit-page') {
        let scheduleEditPage = new Vue(schedule_edit_page);
        scheduleEditPage.$mount('#schedule-edit-page');
        
    }

    if (page.name === 'sign-page') {
        let signPage = new Vue(sign_page);
        signPage.$mount('#sign-page');
        
    }

     //错误页面
    if (page.name === 'network-error'){
        let networkError_vue = new Vue(networkError);
        networkError_vue.$mount('#network-error .page-content');
    }
})

/*
    监听页面过渡动作事件
*/
$$(document).on('pageBeforeAnimation', function (e) {
	const page = e.detail.page;

    
    if (page.name === 'index-page' || page.name === 'about-page') {
        myApp.showToolbar('.index-toolbar');
    } else {
        myApp.hideToolbar('.index-toolbar');
    }

})

/*
    内联加载
*/
// 空page包裹层
let cachedContain = (pageName) => {
    return '<div id='+ pageName +' class="page cached" data-page='+ pageName +'></div>';
};

$$('#index').append(cachedContain('index-page'));
$$('#index').append(cachedContain('about-page'));

let indexPage = new Vue(index_page);
indexPage.$mount('#index-page');

let aboutPage = new Vue(about_page);
aboutPage.$mount('#about-page');

mainView.router.load({
    pageName: 'index-page',
    animatePages: false,
    pushState: false
}); 

// 挂载底栏
let bottomToolbar = new Vue(bottom_toolbar);
bottomToolbar.$mount().$appendTo('.view-main');