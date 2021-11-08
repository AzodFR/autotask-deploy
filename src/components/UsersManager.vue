<template v-loading.fullscreen.lock="loading">
  <h1>Gestion des utilisateurs</h1>
  <hr />
  <el-cascader v-if="users.length > 0"
    placeholder="Chercher un utilisateur"
    :options="users"
    
    filterable
    :filter-method="filterUser"
    v-model="selected"
    @change="changeUser"
  />
  <div v-if="users.length > 0 && selected != -1" class="user-info">
  <h2>Identifiant: {{users[selected].data.login}}</h2>
  <h3 v-if="updated" style="color: green;">Mis à jour avec succès</h3>
  <el-form
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="Prénom:">
        <el-input v-model="users[selected].data.f_name"></el-input>
      </el-form-item>
      </el-form>
        <el-form
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="Nom:">
        <el-input v-model="users[selected].data.l_name"></el-input>
      </el-form-item>
      </el-form>
              <el-form
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="Email:">
        <el-input  v-model="users[selected].data.email"></el-input>
      </el-form-item>
      </el-form>
        <el-form
      :inline="true"
      label-width="120px"
    >
        <el-form-item label="Groupe(s):">
      <el-cascader
          v-model="group"
          :options="groups_list"
          :props="props"
          clearable
          placeholder="Multi choix"
        />
    </el-form-item>
    <el-form-item label="Permissions:">
        <el-cascader
          v-model="perm"
          :options="options"
          :props="props"
          placeholder="Multi choix"
        />
      </el-form-item>
            </el-form>
        <el-form
      label-width="120px"
      :inline="true"
    >
     <el-form-item v-if="this.users[this.selected].data.login != this.$store.state.user.login">
    <el-popconfirm
    confirm-button-text="Oui"
    cancel-button-text="Non"
    icon="el-icon-info"
    icon-color="red"
    title="Voulez vous vraiment supprimer cet utilisateur?"
    @confirm="deleteUser"
  >
    <template #reference>
      <el-button type="danger">Supprimer l'utilisateur</el-button>
    </template>
  </el-popconfirm>
   </el-form-item>
    <el-form-item>
        <el-button
          type="primary"
          :disabled="users[selected].data.f_name == '' || users[selected].data.l_name == ''"
          @click="onSubmit()"
          v-loading.fullscreen.lock="loading"
          :loading="loading"
          >Mettre à jour</el-button
        >
      </el-form-item>
  </el-form>
  </div>
</template>

<script>
export default {
  name: "UserManager",
  data() {
    return {
      users: [],
      group: [],
      props: { multiple: true },
      groups_list: this.$store.state.groups,
      perm: [[0]],
       options: [
        {
          label: "Voir/Éffectuer les tâches",
          disabled: true,
          value: 0
        },
        {
          value: 1,
          label: "Créer/Gérer les tâches",
        },
        {
          value: 2,
          label: "Créer/Gérer les groupes",
        },
        {
          value: 3,
          label: "Créer/Gérer les utilisateurs",
        },
      ],
      loading: false,
      updated: false,
      selected: -1
    };
  },
  methods: {
      filterUser: function(node, keyword) {
         return RegExp('\\b'+ keyword.toLowerCase() +'\\b').test(node.data.label.toLowerCase())
      },
      deleteUser: async function() {
        this.loading = true;
        const self = this;
        await this.$store.dispatch("deleteUser", this.users[this.selected].data.id).then(async function(x){
          self.selected = -1
          await self.$store.dispatch("getAllUser", 0).then((x) => {
            self.users = []
      for (let i = 0; i < x.length; i++) {
        self.users[i] = {
          value: i,
          label: x[i].f_name + " " + x[i].l_name,
          data: x[i],
        };
      }
      self.loading = false;
    });
        })
      },
      changeUser: function() {
          this.group = []
          this.perm = [[0]]
          this.updated = false;
          const perm = this.users[this.selected].data.level.split(':')
          for (let i = 0; i < 4; i++)
          {
            if (perm[i] == 1)
              this.perm[i] = [i];
          }
          if (this.users[this.selected].data.groups == "")
            return;
           const goups = this.users[this.selected].data.groups.split(':')
          for (let i = 0; i < goups.length; i++)
          {
              this.group[i] = this.groups_list[parseInt(goups[i])  - 1].value
          }
          
      },
      onSubmit: async function() {
        const self = this;
        this.loading = true;
        let perm = [0, 0, 0, 0]
        for (let i = 0; i < this.perm.length; i++)
          perm[this.perm[i]] = 1;

        this.users[this.selected].data.level = perm;
        this.users[this.selected].data.groups = this.group;
        await this.$store.dispatch("updateUser", this.users[this.selected].data).then(async (x) => {
          if (x.id == self.$store.state.user.id)
          {
            await self.$store.dispatch("refreshGroup", x.login);
            self.$store.state.user.email = x.email;
          }
          self.updated = true;
          self.loading = false;
        })
      }
  },
  async mounted() {
    const self = this;
    this.loading = true;
    await this.$store.dispatch("getAllUser", 0).then((x) => {
      
      for (let i = 0; i < x.length; i++) {
        self.users[i] = {
          value: i,
          label: x[i].f_name + " " + x[i].l_name,
          data: x[i],
        };
      }
      self.groups_list = self.groups_list.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
      self.loading = false;
    });
  },
};
</script>

<style scoped>
.user-info {
 padding: 10%   
}

>>>.el-input__inner {
box-sizing: content-box;
}

</style>