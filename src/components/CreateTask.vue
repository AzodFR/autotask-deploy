<template>
  <h1>Créer une nouvelle tâche</h1>
  <div v-if="done == ''">
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    :inline="true"
  >
    <el-form-item label="Groupe(s):">
      <el-cascader
        v-model="form.group"
        :options="this.$store.state.user.groups_id"
        clearable
        placeholder="Sélectionnez"
        @change="newGroup"
      />
    </el-form-item>
  </el-form>
  <el-form ref="form"  :model="form" label-width="120px" :rules="rules">
    <el-form-item label="Titre:" >
      <el-input v-model="form.title" prop="title"></el-input>
    </el-form-item>
    <el-form-item label="Description:">
      <el-input
        v-model="form.desc"
        :rows="2"
        type="textarea"
        placeholder="Écrivez une description courte si vous le souhaitez"
    /></el-form-item>
  </el-form>
  <el-form
    ref="form"
    label-width="120px"
    :model="form"
    :inline="true"
  >
    <el-form-item label="Commentaires:">
      <el-radio-group v-model="form.comments">
        <el-radio label="Oui"></el-radio>
        <el-radio label="Non"></el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <el-form ref="form" :model="form"  label-width="120px"  :inline="true" v-if="form.groupe != ''">
<h4>Position</h4>
<el-form-item><el-card v-for="task in tasks" :shadow="task.value == -1 ? 'always' : 'never'" :class="task.value == -1 ? 'card-custom-new' : 'card-custom'" >{{ task.value != -1 ? task.label : form.title != '' ? form.title : task.label }} <icon v-if="task.value == -1 && task.pos != 0" name="caret-up" class="arrow-up" @click="goUp(task.pos)"/> <icon v-if="task.value == -1 && task.pos != tasks.length - 1" @click="goDown(task.pos)" name="caret-down" class="arrow-down" /></el-card></el-form-item>
  </el-form>
   <el-form ref="form"  :model="form" label-width="120px"  :inline="true">
   <el-form-item>
        <el-button
          type="primary"
          :disabled="form.title=='' || form.group =='' || form.group == null"
          @click="onSubmit()"
          v-loading.fullscreen.lock="loading"
          :loading="loading"
          >Créer</el-button
        >
      </el-form-item>
    </el-form>
    </div>
    <div v-else>
    La tâche {{done}} à été créée avec succès !
 <br>
 <el-button type="primary" :disabled="form.title==''" @click="reset()">Créer une nouvelle tâche</el-button>
    </div>
</template>

<script>
export default {
  name: "CreateTask",
  inheritAttrs: false,
  data() {
    return {
      loading: false,
      done: '',
      form: {
        group: "",
        title: "",
        desc: "",
        comments: "Non",
        position: -1
        //sub: false,
        //parent: ""
      },
      rules: {
        title: [
          {
            required: true,
            message: "Titre obligatoire",
          },
        ],
      },
      tasks: []
    };
  },
  methods: {
    onSubmit: async function() {
      if (this.form.title == "" || this.form.group == "" || this.form.group == null)
        return ;
      this.loading = true;
      const self = this;
      const task = {
        title: this.form.title,
        description: this.form.desc,
        can_comment: this.form.comments == 'Non' ? false : true,
        groups: this.form.group[0],
        position: this.form.position
        //parent: this.form.sub == true ? this.form.parent[0] : ""
      }
      await this.$store.dispatch('createTask', task).then(x => {
        self.done = x.title;
        self.loading = false;
      })
    },
    reset: async function() {
      this.form = {
        group: "",
        title: "",
        desc: "",
        comments: "Non",
        position: -1
        //sub: false,
      }
      this.done = ''
      this.tasks = [];
    },
    newGroup: async function(a) {
      this.loading = true;
      const self = this;
      if (this.form.group == null) {
        this.reset();
        this.loading = false;
      }
      this.tasks = [];
      await this.$store.dispatch("retrieveAllTasksByGroup", this.form.group[0]).then(x => {
        for (let i = 0; i < x.length; i++) {
          self.tasks[i] = {value: x[i].id, label: x[i].title, pos: x[i].position}
        }
        self.tasks[x.length] = {value: -1, label: "Nouvelle tâche", pos: x.length};
        self.form.position = x.length
        self.loading = false;
      })
    },
    goUp: function(pos) {
      this.tasks[pos].pos -= 1;
      this.form.position = this.tasks[pos].pos;
      this.tasks[pos - 1].pos += 1;
      this.tasks = this.tasks.sort((a,b) => (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0))
    },
    goDown: function(pos) {
      this.tasks[pos].pos += 1;
      this.form.position = this.tasks[pos].pos;
      this.tasks[pos + 1].pos -= 1;
      this.tasks = this.tasks.sort((a,b) => (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0))
    },
  },
  async mounted() {
  },
};
</script>

<style>
.card-custom-new {
  margin-bottom: 20px;
background: #d7d7d7;
color: black;
}
</style>