import { ElMessage } from 'element-plus';
<template>
  <h1>Créer un nouvel utilisateur</h1>
  <hr />
  <div v-if="login == ''">
    <el-form
      :inline="true"
      ref="form"
      :model="form"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item label="Prénom:" prop="f_name">
        <el-input v-model="form.f_name"></el-input>
      </el-form-item>
      <el-form-item label="Nom:" prop="l_name">
        <el-input v-model="form.l_name"></el-input>
      </el-form-item>
      <el-form-item label="Email:" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item v-if="!this.$store.state.first" label="Groupes:">
        <el-cascader
          v-model="group"
          :options="options_group"
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
      <h4>Un identifaint sera généré au moment de la création</h4>
      <h4>de l'utilisateur, fournissez lui afin qu'il</h4>
      <h4>puisse se connecter.</h4>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="form.f_name == '' || form.l_name == ''"
          @click="onSubmit()"
          v-loading.fullscreen.lock="loading"
          :loading="loading"
          >Créer</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div v-else>
    {{ form.f_name }} {{ form.l_name }} peut désormais se connecter avec
    l'identifiant: {{ login }}
    <br />
    <el-button
      type="primary"
      :disabled="form.f_name == '' || form.l_name == ''"
      @click="reset()"
      >Créer un nouvel utilisateur</el-button
    >
  </div>
</template>

<script>
export default {
  name: "CreateUser",
  data() {
    return {
      props: { multiple: true },
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
      options_group: this.$store.state.groups,
      loading: false,
      login: "",
      perm: [[0]],
      group: [],
      form: {
        f_name: "",
        l_name: "",
        email: "",
        group: [],
        perm: [0, 0, 0, 0],
      },
      rules: {
        f_name: [
          {
            required: true,
            message: "Prénom obligatoire",
          },
        ],
        l_name: [
          {
            required: true,
            message: "Nom obligatoire",
          },
        ],
        perm: [
          {
            required: true,
            message: "Permissions obligatoire",
          },
        ],
        email: [
          {
          type: 'email',
          message: 'Email invalide',
          trigger: ['blur', 'change'],
        },
        ]
      },
    };
  },
  methods: {
    onSubmit: async function() {
      this.loading = true;
      const self = this;

      for (let i = 0; i < this.perm.length; i++)
        this.form.perm[this.perm[i]] = 1;
      for (let i = 0; i < this.group.length; i++)
        this.form.group[i] = this.group[i];
      await this.$store
        .dispatch("createUser", this.form)
        .then(async function(response) {
          if (!self.$store.state.first)
          {
          self.login = response;
          self.loading = false;
          }
          else{
            self.loading = false;
            self.$store.state.first = false;
            await self.$store.dispatch("connect", response).then(x => {
              self.$store.state.page = 8;
            })
          }
        });
    },
    reset: async function() {
      this.form = {
        f_name: "",
        l_name: "",
        group: "",
        perm: [0, 0, 0, 0],
      };
      this.login = "";
      this.perm = [[0]];
      this.group = [];
    },
  },
  mounted() {
    if (this.$store.state.first)
    {
      this.perm = [[0], [1], [2], [3]]
      this.options = [
        {
          label: "Voir/Éffectuer les tâches",
          disabled: true,
          value: 0
        },
        {
          value: 1,
          disabled: true,
          label: "Créer/Gérer les tâches",
        },
        {
          value: 2,
          disabled: true,
          label: "Créer/Gérer les groupes",
        },
        {
          value: 3,
          disabled: true,
          label: "Créer/Gérer les utilisateurs",
        },
      ]
  
  }},
};
</script>

<style>
h4 {
  color: #808080c9;
  font-size: 12px;
}
.el-form {
  padding: 20px;
}
</style>
