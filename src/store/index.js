import Vue from 'vue'
import Vuex from 'vuex'
import kanbanModule from './kanbanModule'



Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        kanbanModule
    }
})