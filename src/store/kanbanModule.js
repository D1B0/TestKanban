import axios from "axios";

export default {
    state: {
        allBoard: {
            "ON HOLD": [],
            "IN PROGRESS": [],
            "NEED REVIEW": [],
            "APPROVED": []
        },
    },
    mutations: {

        setBoardData(state, payload) {
            state.allBoard = {...state.allBoard, payload}
        },
        setDeleteCard(state, payload) {
            state.allBoard[payload.lane].splice(state.allBoard[payload.lane].findIndex(card => card.id === payload.id), 1)
        },
        setData(state, payload) {
            payload.forEach(el => {
                state.allBoard[Object.keys(state.allBoard)[el.row]].push(el)
            })


        },
        setRefreshData(state,payload){
            state.allBoard={...payload}
}
    },
    getters: {
        GET_BOARD(state) {
            return state.allBoard
        },
        GET_BOARD_LENGTH: state => lane => {
            state.allBoard[lane].length
        }

    },
    actions: {

        login({commit, dispatch}, data) {
            return new Promise((resolve, reject) => {

                if (localStorage.getItem('token') !== null) {
                    axios({
                        url: 'https://trello.backend.tests.nekidaem.ru/api/v1/users/refresh_token/',
                        data: {
                            token: localStorage.getItem('token')
                        }, method: 'POST'

                    }).then(
                        resp => {
                            const token = resp.data.token
                            localStorage.setItem('token', token)

                        }
                    ).then(dispatch('fetchData'))
                } else {
                    axios({
                        url: 'https://trello.backend.tests.nekidaem.ru/api/v1/users/login/', data: {
                            username: data.username,
                            password: data.password
                        }, method: 'POST'
                    })
                        .then(resp => {
                            const token = resp.data.token
                            localStorage.setItem('token', token)

                            axios.defaults.headers.common['Authorization'] = token
                            resolve(resp)
                        }).then(dispatch('fetchData'))
                        .catch(err => {
                            commit('auth_error')
                            localStorage.removeItem('token')
                            reject(err)
                        })
                }
            })
        },
        async fetchData({commit}) {
            await axios.get('https://trello.backend.tests.nekidaem.ru/api/v1/cards/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
                .then(response => {

                    commit('setData', response.data)
                })
        },
        async sendDataToServer(context, payload) {
            await axios.patch('https://trello.backend.tests.nekidaem.ru/api/v1/cards/' + payload.id + '/', {
                row: payload.row,
                seq_num: payload.seq_num,
                text: payload.text
            }, {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            }).then(response => response).catch(error => {
                console.log(error)
            })
        },
        async sendNewTaskToServer({commit,dispatch}, payload) {
            await axios.post("https://trello.backend.tests.nekidaem.ru/api/v1/cards/", {
                row: payload.row,
                seq_num: payload.seq_num,
                text: payload.text
            }, {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            }).then(response => {
                let newData = {
                    "ON HOLD": [],
                    "IN PROGRESS": [],
                    "NEED REVIEW": [],
                    "APPROVED": []
                }
                commit('setRefreshData', newData)
                dispatch('fetchData')
                console.log(response)
            }).catch(error => {
                console.log(error)
                dispatch('login')
            })
        }

    },


}