import {defineStore} from 'pinia'

export const useGame = defineStore('game',{
    state : () =>({
        nombre: '',
        preguntaActual: 0,
        dinero: 0,
        preguntas: []
    }),
})