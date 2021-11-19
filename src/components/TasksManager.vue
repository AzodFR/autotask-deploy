<template>
  <h1 v-loading.fullscreen.lock="loading">Gérer les tâches</h1>
  <hr />
  <el-cascader
    placeholder="Chercher un groupe"
    :options="this.$store.state.groups"
    filterable
    :filter-method="filterGroup"
    v-model="selected"
    @change="changeGroup"
  />
  <div v-if="tasks.length > 0">
    <el-form label-width="120px" :inline="true">
      <el-form-item>
        <el-card v-for="task in tasks" class="card-custom">
          <el-collapse>
            <el-collapse-item :title="task.title" name="1">
              <div>
              Status: <label v-if="task.done" style="font-weight:bold; color: green;">Éffectuée</label> <label v-else style="font-weight:bold; color: red;">Ineffectuée</label>
              </div>
              <div v-if="task.done">
              Par: {{ done_by[task.done_by]}}
              </div>
              <div v-if="task.done && task.can_comment">
              Commentaire:  <label style='font-style: italic;'>{{task.comments != '' ? task.comments :"Aucun"}}</label>
              </div>
              <el-popconfirm
            confirm-button-text="Oui"
            cancel-button-text="Non"
            icon="el-icon-info"
            icon-color="red"
            title="Êtes vous sûre de vouloir retirer cette tâche?"
            @confirm="removeTask(task.position)"
          >
            <template #reference>
              <icon name="trash-alt" class="trash-2" />
            </template>
          </el-popconfirm>
              </el-collapse-item></el-collapse
          >
          <icon
            v-if="task.position != tasks.length - 1"
            @click="goDown(task.position)"
            name="caret-down"
            class="arrow-down"
          /><icon
            v-if="task.position != 0"
            name="caret-up"
            class="arrow-up"
            @click="goUp(task.position)"
          />
        </el-card>
      </el-form-item>
    </el-form>
    <el-form label-width="120px" :inline="true">
      <el-form-item>
        <el-button
          type="primary"
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
import { ElMessage } from "element-plus";

export default {
  name: "TasksManager",
  data() {
    return {
      tasks: [],
      template: [],
      selected: -1,
      loading: false,
      done_by: {}
    };
  },
  mounted() {
  },
  methods: {
    filterGroup: function(node, keyword) {
      return RegExp("\\b" + keyword.toLowerCase() + "\\b").test(
        node.data.label.toLowerCase()
      );
    },
    changeGroup: async function() {
      const self = this;
      this.tasks = [];
      await this.$store
        .dispatch(
          "retrieveAllTasksByGroup",
          this.$store.state.groups[this.selected - 1].value
        )
        .then(async (x) => {
          self.template = x;
          self.tasks = x;
          for (let i = 0 ; i < x.length; i++) {
            if (x[i].done)
            await this.$store.dispatch("getUser", x[i].done_by).then(y => {
              self.done_by[x[i].done_by] = y.f_name + " " + y.l_name;
        })
          }
          self.loading = false;
        });
    },
    onSubmit: async function() {
      this.loading = true;
      for (let i = 0; i < this.tasks.length; i++)
        await this.$store.dispatch("updateTask", this.tasks[i]);
      this.loading = false;
      ElMessage({ message: "Mis à jour avec succès.", type: "success" });
    },
    goUp: function(pos) {
      this.tasks[pos].position -= 1;
      this.tasks[pos - 1].position += 1;
      this.tasks = this.tasks.sort((a, b) =>
        a.position > b.position ? 1 : b.position > a.position ? -1 : 0
      );
    },
    goDown: function(pos) {
      this.tasks[pos].position += 1;
      this.tasks[pos + 1].position -= 1;
      this.tasks = this.tasks.sort((a, b) =>
        a.position > b.position ? 1 : b.position > a.position ? -1 : 0
      );
    },
    removeTask: async function(position) {
      this.loading = true;
      for (let i = position + 1; i < this.tasks.length; i++)
        this.tasks[i].position -= 1;
      await this.$store.dispatch("deleteTask", this.tasks[position].id);
      this.tasks.splice(position, 1);

      for (let i = 0; i < this.tasks.length; i++)
        await this.$store.dispatch("updateTask", this.tasks[i]);
      this.loading = false;
      ElMessage({ message: "Supprimer avec succès.", type: "success" });
    },
  },
};
</script>
<style>
.card-custom {
  margin-bottom: 20px;
}
.card-custom-new {
  margin-bottom: 20px;
  background: #d7d7d7;
  color: black;
}
.arrow-up {
  position: absolute;
  left: 130%;
  cursor: pointer;
  margin-top: -25%;
}
.arrow-down {
  position: absolute;
  right: 130%;
  cursor: pointer;
  margin-top: -25%;
}
.trash-2 {
  color: red;
  width: 17px;
  height: 17px;
  cursor: pointer;
}
</style>
