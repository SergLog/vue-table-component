<template>
  <div id="app">
    <div class="content-wrapper">
      <the-table v-if="isLoaded"></the-table>
    </div>
    <div id="msg" class="message">
      <div class="messageText">Не удалось загрузить данные. Перезагрузить страницу?</div>
      <div class="btnsMsg">
        <b-button variant="outline-secondary" size="sm" @click="cancel">Cancel</b-button>
        <b-button variant="success" size="sm" @click="confirm">Confirm</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import TheTable from "./components/TheTable.vue";
import { getProducts } from "./request.js";

export default {
  name: "App",
  components: {
    TheTable
  },
  data() {
    return {
      isLoaded: false
    };
  },
  created() {
    getProducts()
      .then(response => {
        this.$store.commit("setItems", response);
        this.isLoaded = true;
      })
      .catch(error => {
        document.getElementById("msg").classList.toggle("show");
        throw error;
      });
  },
  methods: {
    cancel() {
      document.getElementById("msg").classList.remove("show");
    },
    confirm() {
      location.reload();
      document.getElementById("msg").classList.remove("show");
    }
  }
};
</script>

<style>
html {
   background-color: #f2f2f2;
}
#app {
  font-family: Source Sans Pro;

  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f2f2f2;
}

.content-wrapper {
  padding: 0px;
  padding-top: 32px;
  max-width: 1231px;
  margin: 0 auto;
  position: relative;
}

.message {
  display: none;
  position: absolute;
  top: 20%;
  left: 40%;
  width: 280px;
  height: 140px;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 16px;
}

.btnsMsg {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 25px;
}

.messageText {
  text-align: center;
}

.show {
  display: block;
}
</style>
