import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  // iconfont: 'md',
  theme: {
    primary: "#3B125F",
    secondary: "#8B5FBF",
    accent: "#BF653F",
    error: "#722530",
    warning: "#A37513",
    info: "#396893",
    success: "#4caf50"
  }
})
