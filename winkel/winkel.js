
Vue.createApp({
  data() {
    return {
      product: producten,
    }
  },
  computed: {
    lengte() {
      return producten.length
    }
  }
}).mount('#app')