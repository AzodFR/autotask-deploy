<template>
  <h1>Liste des tâches</h1>
  <h2 v-if="this.$store.state.user.groups_id.length == 0">
    Aucun poste disponible
  </h2>
  <div v-else v-loading.fullscreen.lock="loading">
    <el-form :inline="true" ref="group" label-width="120px">
      <el-form-item label="Poste(s):">
        <el-cascader
          v-model="group"
          :options="this.$store.state.user.groups_id"
          @change="newGroup"
          placeholder="Sélectionnez"
        />
      </el-form-item>
    </el-form>

    <div v-if="tasks.length > 0" style="height: 300px">
      <el-progress
        :percentage="Math.round((done * 100) / tasks.length)"
        :text-inside="true"
        :status="(done * 100) / tasks.length == 100 ? 'success' : ''"
        stroke-width="20"
      ></el-progress>
      <el-breadcrumb
        style="margin-left: 2%"
        separator-class="el-icon-arrow-right"
      >
        <el-breadcrumb-item v-for="task in tasks"
          ><label :class="task.class" @click="changeTask(task.click)"
            >{{ task.title }} ({{ task.pos }})</label
          ></el-breadcrumb-item
        >
      </el-breadcrumb>
      <hr />
      <div v-if="active >= tasks.length">
        <h1>Plus aucune tâche pour aujourd'hui....</h1>
      </div>
      <div v-else>
        <h2>{{ tasks[active].title }} ({{ tasks[active].pos }})</h2>
        <label v-if="tasks[active].done">Éffectué par {{ done_by }}</label>
        <label v-else class="desc">{{ tasks[active].description }}</label>
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
import ProgressBar from 'vue-simple-progress'
export default {
  name: "Tasks",
  components: {
    ProgressBar
  },
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
      let day = new Date(Date.now()).getDay() - 1;
      if (day == -1) day = 6;
      this.done = 0;
      const date = new Date(Date.now());
      await this.$store
        .dispatch("retrieveAllTasksByGroup", this.group[0])
        .then(async (x) => {
          let first = false;
          for (let i = 0; i < x.length; i++) {
            if (!x[i].days[day] || (x[i].isPrivate && !self.$store.state.user.special.includes(x[i].id)))
              continue;
              const task = new Date(x[i].confirmationHour)
            if (task.getFullYear() != 2999 && (task.getDay() != date.getDay() || task.getMonth() != date.getMonth() || task.getFullYear() != date.getFullYear())) continue;
            self.tasks[self.tasks.length] = x[i];
            self.originals[self.tasks.length-1] = x[i];
            self.tasks[self.tasks.length-1].pos =  new Date(x[i].confirmationHour).toString().slice(16,21);
            self.tasks[self.tasks.length-1].click = self.tasks.length-1;
            if (x[i].done) {
              self.tasks[self.tasks.length-1].class = "done-task";
              self.done++;
            }
            else if (!first) {
              self.tasks[self.tasks.length-1].class = self.tasks[self.tasks.length-1].isPrivate ? "active-private-task" : "active-task";
              self.active = self.tasks.length-1;
              first = true;
            } else self.tasks[self.tasks.length-1].class = self.tasks[self.tasks.length-1].isPrivate ? "inactive-private-task" : "inactive-task";
          }
          if (self.tasks.length > 0 && self.tasks[self.active].done)
          await self.$store.dispatch("getUser", self.tasks[self.active].done_by).then(x => {
          self.done_by = x.f_name + " " + x.l_name;
        })
          self.loading = false;
          self.tasks = this.tasks.sort((a,b) => (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0))
          for (let b = self.tasks.length - 1; b >= 0; b--) {
            self.tasks[b].click = b;
          }
        });
    },
    onSubmit: async function() {
      this.tasks[this.active].class = "done-task";
      this.tasks[this.active].done = true;
      this.done++;
      let pos = -1;
      for (let i = 0; i < this.originals.length; i++) {
        if (this.tasks[this.active].id == this.originals[i].id) {
          pos = i;
          break;
        }
      }
      this.originals[pos].done = true;
      this.originals[pos].done_by = this.$store.state.user.login;
      this.originals[pos].comments = this.comment;
      this.$store.dispatch("updateTaskDone", this.originals[pos]);
      this.comment = "";
      this.active++;
      while (this.active < this.tasks.length && this.tasks[this.active].done) this.active++;
      if (this.active < this.tasks.length)
        this.tasks[this.active].class = this.tasks[this.active].isPrivate ? "active-private-task" : "active-task";
    },
    cancelTask: async function() {
       this.tasks[this.active].class = this.tasks[this.active].isPrivate ? "active-private-task" : "active-task";
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
        (this.tasks[this.active].class == "active-private-task" || this.tasks[this.active].class == "active-task")
      )
        this.tasks[this.active].class = this.tasks[this.active].isPrivate ? "inactive-private-task" : "inactive-task";
      else if (
        this.active < this.tasks.length &&
        this.tasks[this.active].class == "active-done-task"
      )
        this.tasks[this.active].class = "done-task";
      this.active = pos;
      if (this.tasks[this.active].class == "inactive-task" || this.tasks[this.active].class == "inactive-private-task")
        this.tasks[this.active].class = this.tasks[this.active].isPrivate ? "active-private-task" : "active-task";
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

.active-private-task {
    color: #e35b18;
    font-weight: bold;
    cursor: pointer;
    margin-top: 25px;
}

.inactive-private-task {
    color: grey;
    cursor: pointer;
    font-weight: bold;
    margin-top: 25px;
}
.desc {
  font-style: oblique;
}

.el-progress-bar__innerText {
  display: inline-block;
  vertical-align: middle;
  color: #fff;
  font-size: 12px;
  margin: 0 5px;
  right: 50%;
  position: absolute;
  top: 25%;
}
</style>
