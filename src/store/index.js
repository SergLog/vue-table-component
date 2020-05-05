import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({

  state: {
    items: []
  },
  mutations: {
    setItems(state, payload) {
      state.items = payload;
    },
    deleteItem(state, id) {
      const index = state.items.findIndex(n => n.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    }
  }
})