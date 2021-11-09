<template>
  <img alt="Vue logo" :src="bdd + '/logo?rnd=' + cacheKey" class="logo-login" v-if="id == -1" >
  

  <Login v-if="id == -1" />
  <Navbar v-else-if="id > -1 && !first" />
  <Tasks v-if="page == 0 && id > -1" />
  <CreateTask v-else-if="page == 1 && id > -1" />
  <CreateUser v-else-if="page == 2 && id > -1" />
  <CreateGroup v-else-if="page == 3 && id > -1" />
  <UsersManager v-else-if="page == 4 && id > -1" />
  <GroupsManager v-else-if="page == 5 && id > -1" />
  <TasksManager v-else-if="page == 6 && id > -1" />
  <Settings v-else-if="page == 7 && id > -1" />
  <Uploads v-else-if="page == 8 && id > -1" />
  <el-dialog
    v-model="dialog"
    title="Url de la base de données"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
  <p style="color: red" v-if="err">Impossible de se connecter à la base de donnée...</p>
    <span>URL:</span><el-input v-model="newInstance"></el-input>
    <template #footer>
      <span>
        <el-button type="primary" @click="setURL()"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'
import Navbar from './components/Navbar.vue'
import CreateUser from './components/CreateUser.vue'
import CreateGroup from './components/CreateGroup.vue'
import CreateTask from './components/CreateTask'
import Tasks from './components/Tasks.vue';
import UsersManager from './components/UsersManager';
import GroupsManager from './components/GroupsManager';
import TasksManager from './components/TasksManager';
import Settings from './components/Settings';
import Uploads from './components/Uploads';
import { ElMessage } from 'element-plus';


export default {
  name: 'App',
  components: {
    Login,
    Navbar,
    CreateUser,
    CreateGroup,
    CreateTask,
    Tasks,
    UsersManager,
    GroupsManager,
    TasksManager,
    Settings,
    Uploads
  },
  computed: {
    id () {
      return this.$store.state.user.id
    },
    page () {
      return this.$store.state.page
    },
    first () {
      return this.$store.state.first
    },
    bdd () {
      return this.$store.state.instance.defaults.baseURL
    }
  },
  mounted() {
    console.log("%c You have nothing to do here close this", 'background:#fff; color:#ffff; font-size: 920px;')
    console.log("%c What are you doing step bro ?", 'background:#222; color:#bada55; font-size: 92px;')
    console.log("%c ⛔️ Get back to work ! ⛔️", 'background: #222; color:red; font-size: 48px;')
    if (this.$store.state.instance.defaults.baseURL == "")
    {
      this.$store.state.user.id = -2;
      this.dialog = true;
      if (localStorage.getItem("bdd_url"))
      {
        this.newInstance = localStorage.getItem("bdd_url");
        this.setURL();
      }
    }
  },
  data() {
    return {
      err: false,
      dialog: false,
      newInstance: "",
      logo: `${this.$store.state.instance.defaults.baseURL}/logo`,
      cacheKey: +new Date(),
    }
  },
  methods: {
    setURL: function() {
      this.$store.state.instance.baseURL = this.newInstance;
      const self = this;
      this.$store.dispatch("pingNew", this.newInstance).then((result) => {
        localStorage.setItem("bdd_url", this.newInstance);
        self.dialog = false;
        self.err = false;
        self.$store.state.user.id = -1;
      }).catch((err) => {
        self.err = true;
        ElMessage({ message: "Impossible de se connecter à cette base de donnée.", type: "error" });
      });
      
    }
  },
  created() {
  this.interval = setInterval(() => {
    this.cacheKey = +new Date();
  }, 5 * 1000);
},
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.bg-img{
  width: 50px;
height: 50px;
}

footer
{
  width: 20%;
  height: 5%;
  /* background: #8080801a;*/
  bottom: 0px;
  position: fixed;
  
  display: flex;
  flex-shrink: 0;
  
  align-items: center;
}

.footer-text {
  margin-left: 10px;
}

.logo-login {
  width: 250px;
  height: 250px;
}

</style>
