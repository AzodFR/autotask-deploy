<template>
<h1>Créer un nouveau groupe</h1>
<hr>
<div v-if="created ==''">
<el-form :inline="true" ref="form" :model="form" label-width="120px">
  <el-form-item label="Nom du groupe:" prop="group_name">
      <el-input v-model="form.group_name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :disabled="form.group_name==''" @click="onSubmit()" v-loading.fullscreen.lock="loading" :loading="loading">Créer</el-button>
    </el-form-item>
 </el-form>
 </div>
 <div v-else>
  Le groupe {{created}} à été créée avec succès !
 <br>
 <el-button type="primary" :disabled="form.group_name==''" @click="reset()">Créer un nouveau groupe</el-button>
 </div>
</template>

<script>
export default {
  name: "CreateGroup",
  data() {
    return {
      form: {
        group_name: ''
      },
      created: '',
      loading: false
    }
  },
  methods: {
    onSubmit: async function() {
       this.loading = true;
      const self = this;
      await this.$store.dispatch("createGroup", this.form).then(function(response) {
        self.$store.dispatch("retrieveAllGroups",0);
        self.created = response;
        self.loading = false;
      })
    },
    reset: async function() {
      this.form = {
        name: '',
      }
      this.created = ''
    }
  }
}
</script>