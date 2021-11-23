<template>
<h1 v-loading.fullscreen.lock="loading">Gestion des postes</h1>
  <hr />
  
  <el-cascader
    placeholder="Chercher un poste"
    :options="this.$store.state.groups"
    
    filterable
    :filter-method="filterGroup"
    v-model="selected"
    @change="changeGroup"
  />
        <el-popconfirm v-if="selected != -1"
    confirm-button-text="Oui"
    cancel-button-text="Non"
    icon="el-icon-info"
    icon-color="red"
    title="Êtes vous sûre de vouloir supprimer ce poste?"
    @confirm="deleteGroup()"
  >
    <template #reference>
  <icon  name="trash-alt" class="trash-top" />
    </template>
    </el-popconfirm>
  <div class="list-user">
  <el-descriptions v-if="group_users.length > 0" v-for="user in group_users"
    direction="vertical"
    :column="4"
    border
    class="list-user"
  >
    <el-descriptions-item label="Prénom" width="80px" min-width="80px" >{{user.f_name}}</el-descriptions-item>
    <el-descriptions-item label="Nom" width="80px" min-width="80px" >{{user.l_name}}</el-descriptions-item>
    <el-descriptions-item label="Identifiant" width="80px" min-width="80px" >{{user.login}}</el-descriptions-item>
    <el-descriptions-item label="Supprimer" width="80px" min-width="80px">
      <el-popconfirm
    confirm-button-text="Oui"
    cancel-button-text="Non"
    icon="el-icon-info"
    icon-color="red"
    title="Êtes vous sûre de vouloir retirer cette personne du poste?"
    @confirm="removeGroup(user.login)"
  >
    <template #reference>
     <icon name="trash-alt" class="trash" />
    </template>
  </el-popconfirm></el-descriptions-item>
  </el-descriptions>
  </div>
</template>

<script>

function decode(crypted) {
  let result = [];
  let i = 0;
  const list = crypted.split(":");

  list.forEach(function(x) {
    result[i++] = parseInt(x);
  });

  return result;
}

export default {
    name: 'GroupsManager',
    data() {
        return {
            selected: -1,
            users: [],
            group_users: [],
            loading: false
        }
    },
    methods: {
        filterGroup: function(node, keyword) {
         return RegExp('\\b'+ keyword.toLowerCase() +'\\b').test(node.data.label.toLowerCase())
      },
      changeGroup: function() {
          const self = this;
          this.group_users = []
          let j=0;
          for (let i = 0; i < this.users.length; i++)
            if (this.users[i].groups.find(x => x == this.selected))
                this.group_users[j++] = this.users[i]

      },
      removeGroup: async function (login) {
        const self = this;
        this.loading = true;
       await this.$store.dispatch('removeUserGroup', {login: login, group: this.selected[0]}).then(x => {
            for (let  i = 0; i < self.group_users.length; i++) {
              if (self.group_users[i].login == login)
              {
                 self.group_users.splice(i, 1);
                break;
              }
            }
            self.loading = false;
        })
      },
      deleteGroup: async function() {
        const self = this;
        this.loading = true;
        await this.$store.dispatch('deleteGroup', this.selected[0]).then(async x => {
          for (let  i = 0; i < self.group_users.length; i++) {
            await self.removeGroup(self.group_users[i].login)
          }
          await self.$store.dispatch("retrieveAllGroups", 0);
          self.group_users = []
          self.selected = -1;
          self.loading = false;
          self.$store.dispatch("refreshGroup", self.$store.state.user.login);
        })
      }
    },
    async mounted() {
        this.loading = true;
        const self = this;

        await this.$store.dispatch("getAllUser", 0).then(x => {
            self.users = x;
            for (let i = 0; i < x.length; i++)
                x[i].groups = decode(x[i].groups);
            self.loading = false;
        })
    },
}
</script>

<style>
.list-user {
    padding: 10px
}
.list-item {
    width: 250px;
}
.trash {
  color: red;
  width: 17px;
  height: 17px;
  cursor: pointer;
}
.trash-top {
  color: red;
  width: 17px;
  height: 17px;
  margin: 5px;
  cursor: pointer;
}
</style>