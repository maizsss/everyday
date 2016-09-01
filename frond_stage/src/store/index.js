import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import {InitState, Mutations} from './store'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        everyday_init: InitState,
    },
    actions,
    mutations: Mutations
})

