<template>
  <div class="code-top">
    <el-popconfirm
      title="Êtes-vous sur de vouloir changer de base de donnée ?"
      confirm-button-text="Oui"
      cancel-button-text="Non"
      @confirm="changeBDD()"
    >
      <template #reference>
        <el-button
          icon="el-icon-office-building"
          type="danger"
          id="button-change"
          circle
        ></el-button>
      </template>
    </el-popconfirm>
  </div>
  <div class="login-input">
    <div class="number-in" v-if="text != ''">{{ text }}</div>
    <div class="error-login" v-if="error">Identifiant introuvable</div>
    <div id="number-input">
    <div class="line-code">
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('1')"
          >1</el-button
        >
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('2')"
          >2</el-button
        >
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('3')"
          >3</el-button
        >
        </div>
      <div class="code-break"></div>
      <div class="line-code">
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('4')"
          >4</el-button
        >
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('5')"
          >5</el-button
        >
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('6')"
          >6</el-button
        >
        </div>
      <div class="code-break"></div>
      <div class="line-code">
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('7')"
          >7</el-button
        >
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('8')"
          >8</el-button
        >
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('9')"
          >9</el-button
        >
        </div>
      <div class="code-break"></div>
      <div class="line-code">
        <el-button
          id="button-input"
          :disabled="loading || num.length == 0"
          type="danger"
          circle
          @click="deleteOne()"
          icon="el-icon-arrow-left"
        ></el-button>
        <el-button
          id="button-input"
          :disabled="loading"
          type="primary"
          circle
          @click="clickButton('0')"
          >0</el-button
        >
        <el-button
          id="button-input"
          type="success"
          :loading="loading"
          :disabled="num.length != 4"
          v-loading.fullscreen.lock="loading"
          circle
          icon="el-icon-check"
          @click="connect()"
        ></el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      text: "_ _ _ _",
      num: "",
      loading: false,
      error: false,
    };
  },
  methods: {
    changeBDD: function() {
      this.$store.dispatch("setNew", "");
      this.$store.state.user = this.$store.state.logout;
      this.$store.state.user.id = -2;
      this.$root.dialog = true;
      localStorage.removeItem("bdd_url");
    },
    clickButton: function(number) {
      if (this.num.length < 4) {
        this.num += number;
        this.text = this.text.replace("_", number);
      }
    },
    deleteOne: function() {
      this.num = this.num.slice(0, -1);
      let new_str = this.text.split("");
      new_str[this.num.length * 2] = "_";
      this.text = new_str.join("");
    },
    connect: async function() {
      this.loading = true;
      this.error = false;
      const self = this;
      await this.$store
        .dispatch("connect", this.num)
        .then(async function(response) {
          await self.$store.dispatch("retrieveAllGroups", 0);
          if (response.id != -1) {
            self.loading = false;
            localStorage.setItem("auto_task-login", response.login);
          } else localStorage.setItem("auto_task-login", null);

          self.error = true;
          self.loading = false;
        });
    },
  },
  async mounted() {
    if (localStorage.getItem("auto_task-login")) {
      this.num = localStorage.getItem("auto_task-login");
      this.connect();
    }
    const self = this;
    if (this.$store.state.instance.baseURL != "")
      await this.$store.dispatch("countUser", 0).then((x) => {
        if (x== 0) {
          self.$store.state.page = 2;
          self.$store.state.user.id = 0;
          self.$store.state.first = true;
        }
      });
  },
};
</script>

<style>
#number-input {
  display: flex;
  justify-content:center;
  flex-wrap: wrap;
  margin-top: 1%;
}

#button-input {
  height: 85px;
  width: 85px;
  font-size: 2rem;
}

#button-change {
  height: 50px;
  width: 50px;
  font-size: 1.2rem;
}

.code-top {
  position: absolute;
  top: 2%;
  right: 5%;
  cursor: pointer;
}

.code-break {
  width: 100%
}
.line-code {
  flex: 0 32%;
height: 100px;
}
.disabled-input {
  width: 50%;
  display: block;
  border: solid 1px rgb(185, 185, 185);
  background-color: rgb(216, 216, 216);
  padding-left: 50%;
  padding-top: 9.4%;
  left: 50%;
}

.number-in {
  text-align: center;
  font-size: 64px;
}

.el-input__inner {
  text-align: center;
}

.error-login {
  color: rgb(167, 4, 4);
}
.login-inout {
  margin: 10px;
}
</style>
