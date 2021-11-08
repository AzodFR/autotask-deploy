<template>
<nav class="navbar navbar-light bg-light navbar-expand-lg fixed-top">
    <div class="container-md">
        <a href="#" class="navbar-brand"  @click="listTask()">({{user.login}}) | {{user.f_name}} {{user.l_name}}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarCollapse">
            <ul class="navbar-nav">
                <li class="navbar-item"><a href="#" class="nav-link" @click="listTask()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Liste des tâches</a></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[1]" @click="newTask()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Créer une tâche</a></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[1]" @click="taskManager()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Gérer les tâches</a></li>
                <li class="divider"></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[2]" @click="newGroup()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Créer un groupe</a></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[2]" @click="groupManager()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Gérer les groupes</a></li>
                <li class="divider"></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[3]" @click="newUser()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Créer un utilisateur</a></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[3]" @click="userManager()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Gérer les utilisateurs</a></li>
                <li class="divider"></li>
                <li class="navbar-item"><a href="#" class="nav-link" @click="settings()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Paramètres</a></li>
                <li class="navbar-item"><a href="#" class="nav-link" v-if="user.level[1] && user.level[2] && user.level[3]" @click="uploads()" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">Modifier le logo</a></li>
                <li class="navbar-item"><a href="#" class="nav-link" @click="logout()">Déconnexion</a></li>
            </ul>
        </div>
    </div>
</nav>
</template>
<script>
export default {
  name: "Home",
  methods: {
      logout: function() {
          this.$store.state.page = 0;
          this.$store.state.user = this.$store.state.logout;
          localStorage.removeItem("auto_task-login")
      },
      listTask: function() {
        this.$store.state.page = 0;
      },
      newTask: function() {
        this.$store.state.page = 1;
      },
      newUser: function() {
        this.$store.state.page = 2;
      },
      newGroup: function() {
        this.$store.state.page = 3;
      },
      userManager: function() {
        this.$store.state.page = 4;
      },
      groupManager: function() {
        this.$store.state.page = 5;
      },
      taskManager: function() {
        this.$store.state.page = 6;
      },
      settings: function() {
        this.$store.state.page = 7;
      },
            uploads: function() {
        this.$store.state.page = 8;
      }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
};
</script>

<style>
  body {
    padding-top: 4.5rem;
}
.divider {
    border: solid 1px #c5cad0;
    height: 1px;
    background-color: #c5cad0;
}

</style>
