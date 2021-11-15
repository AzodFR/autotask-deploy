<template>
  <h1>Liste des tâches</h1>
  <h2 v-if="this.$store.state.user.groups_id.length == 0">
    Aucun groupe disponible
  </h2>
  <div v-else v-loading.fullscreen.lock="loading">
    <el-form :inline="true" ref="group" label-width="120px">
      <el-form-item label="Groupe(s):">
        <el-cascader
          v-model="group"
          :options="this.$store.state.user.groups_id"
          @change="newGroup"
          placeholder="Sélectionnez"
        />
      </el-form-item>
    </el-form>
    <k-progress :percent="done * 100 / tasks.length" :color-flow="true" />
    <div v-if="tasks.length > 0" style="height: 300px">
      <el-breadcrumb style="margin-left: 2%" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="task in tasks"
          ><label :class="task.class" @click="changeTask(task.pos)">{{
            task.title
          }}</label></el-breadcrumb-item
        >
      </el-breadcrumb>
      <hr />
      <div v-if="active >= tasks.length">
        <h1>Plus aucune tâche pour aujourd'hui....</h1>
      </div>
      <div v-else>
        <h2>{{ tasks[active].title }}</h2>
        <label v-if="tasks[active].done">Éffectué par {{done_by}}</label>
        <label v-else class="desc">{{tasks[active].description}}</label>
        <el-form
          v-if="tasks[active].done == false"
          label-width="120px"
          class="task"
        >
          <el-form-item v-if="tasks[active].can_comment" label="Commentaire:">
            <el-input
              v-model="comment"
              :rows="2"
              type="textarea"
              placeholder="Écrivez un commentaire"
          /></el-form-item>
        </el-form>
        <el-form label-width="120px" class="task" :inline="true">
          <el-form-item>
            <el-button
              v-if="tasks[active].done == false"
              type="primary"
              @click="onSubmit()"
              >Valider</el-button
            >
            <el-button v-else type="danger" @click="cancelTask()"
              >Annuler</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tasks",
  data() {
    return {
      group: "-1",
      comment: "",
      tasks: [],
      originals: [],
      loading: false,
      active: 0,
      done: 0,
      done_by: ""
    };
  },
  methods: {
    newGroup: async function(a) {
      this.loading = true;
      const self = this;
      this.tasks = [];
      this.done = 0;
      await this.$store
        .dispatch("retrieveAllTasksByGroup", this.group[0])
        .then(async (x) => {
          let first = false;
          for (let i = 0; i < x.length; i++) {
            self.tasks[i] = x[i];
            self.originals[i] = x[i];
            self.tasks[i].pos = i;
            if (x[i].done) self.tasks[i].class = "done-task";
            else if (!first) {
              self.tasks[i].class = "active-task";
              self.done++;
              self.active = i;
              first = true;
            } else self.tasks[i].class = "inactive-task";
          }
          if (self.tasks.length > 0 && self.tasks[self.active].done)
          await self.$store.dispatch("getUser", self.tasks[self.active].done_by).then(x => {
          self.done_by = x.f_name + " " + x.l_name;
        })
          self.loading = false;
        });
    },
    onSubmit: async function() {
      this.tasks[this.active].class = "done-task";
      this.tasks[this.active].done = true;
      this.done++;
      this.originals[this.active].done = true;
      this.originals[this.active].done_by = this.$store.state.user.login;
      this.originals[this.active].comments = this.comment;
      this.$store.dispatch("updateTaskDone", this.originals[this.active]);
      this.comment = "";
      this.active++;
      while (this.active < this.tasks.length && this.tasks[this.active].done) this.active++;
      if (this.active < this.tasks.length)
        this.tasks[this.active].class = "active-task";
    },
    cancelTask: async function() {
       this.tasks[this.active].class = "active-task";
      this.tasks[this.active].done = false;
      this.done--;
      this.originals[this.active].done = false;
      this.originals[this.active].done_by = "";
      this.originals[this.active].comments = "";
      await this.$store.dispatch("updateTask", this.originals[this.active]);
    },
    changeTask: function(pos) {
      if (
        this.active < this.tasks.length &&
        this.tasks[this.active].class == "active-task"
      )
        this.tasks[this.active].class = "inactive-task";
      else if (
        this.active < this.tasks.length &&
        this.tasks[this.active].class == "active-done-task"
      )
        this.tasks[this.active].class = "done-task";
      this.active = pos;
      if (this.tasks[this.active].class == "inactive-task")
        this.tasks[this.active].class = "active-task";
      else if (this.tasks[this.active].class == "done-task")
        this.tasks[this.active].class = "active-done-task";
        const self = this;
        if (this.tasks[this.active].done)
        this.$store.dispatch("getUser", this.tasks[this.active].done_by).then(x => {
          self.done_by = x.f_name + " " + x.l_name;
        })
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style>
.done-task {
  color: #3dbb22;
  font-weight: bold;
  cursor: pointer;
  margin-top: 25px;
}
.active-done-task {
  color: #228248;
  font-weight: bold;
  cursor: pointer;
  margin-top: 25px;
}
.active-task {
  color: #5a99ea;
  font-weight: bold;
  cursor: pointer;
  margin-top: 25px;
}

.inactive-task {
  color: grey;
  cursor: pointer;
  margin-top: 25px;
}
.desc {
  font-style: oblique;
}
</style>
