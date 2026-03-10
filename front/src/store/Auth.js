import {defineStore} from "pinia"
import {ref} from "vue"

export const useAuthStore = defineStore("auth", ()=>{
     let token = ref("")
     let usuario = ref(null)
     let rol = ref("")
     let sessionStart = ref(null)
     let unreadCount = ref(0)


     return{
          token,
          usuario,
          rol,
          sessionStart,
          unreadCount
     }

},

{
     persist:true
})