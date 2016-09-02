import {
    INIT_USER_INFO,
    UPDATE_SCHEDULE
} from './mutation-types'

//initial commission state
export const InitState = {
    //localStorage
    cache:{
        key:'everyday'
    },
    //接口
    request:{
        init: 'api/everyday/init', //params: account(用户帐号), date(日期，如：'2016-8-30')
        schedule: 'api/everyday/schedule', //params: account(用户帐号), type(edit/delete/add), id(日程的id), sketch(日程的简述), describe(日程的详情)
        sort: 'api/everyday/sort', //params: account(用户帐号), id(日程的id), type(1: 优先， 2：延后， 3：完成)
        user: 'api/everyday/user', //params: account(用户帐号), password(密码), type(login/logout/sign)
    },
    user: {
        user_nickname: '',
        account: 10000,
        is_login: 0
    },
    schedule: {
        list: [
            // {
            //     id: 20168301,
            //     sort_index: 2, //(0:已完成，非0:未完成)
            //     sketch: '事务一',
            //     describe: 'XXX需要完成'
            // },
            // {
            //     id: 201683012,
            //     sort_index: 1,
            //     sketch: '事务二',
            //     describe: 'XXXX需要完成'
            // },
            // {
            //     id: 201683013,
            //     sort_index: 0,
            //     sketch: '事务三',
            //     describe: 'XXXX需要完成'
            // },
        ],
        total: 0,
        date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-'  + new Date().getDate()
    }
   
}


//mutation
export const Mutations = {
    
    [INIT_USER_INFO] (state, data) {
        if (data.hasOwnProperty('user')){ 
            state.everyday_init.user.account = data.user.account
            state.everyday_init.user.user_nickname = data.user.user_nickname
            state.everyday_init.user.is_login = data.user.is_login
        }

    },

    [UPDATE_SCHEDULE] (state, data){
        if (data.hasOwnProperty('user')){
            state.everyday_init.user.account = data.user.account
            state.everyday_init.user.user_nickname = data.user.user_nickname
            state.everyday_init.user.is_login = data.user.is_login
        }
        if (data.hasOwnProperty('schedule')){
            state.everyday_init.schedule.list = data.schedule.list
            state.everyday_init.schedule.total = data.schedule.total
            state.everyday_init.schedule.date = data.schedule.date
        }
    }
}
