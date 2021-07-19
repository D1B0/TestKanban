import axios from "axios";

axios.defaults.baseUrl= 'https://trello.backend.tests.nekidaem.ru/api/v1/cards/'
axios.defaults.headers.common['Authorization']=`JWT ${localStorage.getItem('token')}`