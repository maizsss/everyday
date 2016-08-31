import Vue from 'vue';

/*
    金额限制两位小数
        参数 ——
                value： 数字或内容是数字的字符串
            返回 ——
                带有2位小数位的数字

        使用方式 ——
            {{data | cash-fix2}}
*/
Vue.filter('cash-fix2', (value) => {
    if (value){
        return parseFloat(value).toFixed(2);
    } else {
        return value;
    }

});