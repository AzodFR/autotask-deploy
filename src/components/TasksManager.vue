<template>
  <h1 v-loading.fullscreen.lock="loading">Gérer les tâches</h1>
  <hr />
  <el-cascader
    placeholder="Chercher un poste"
    :options="this.$store.state.groups"
    filterable
    :filter-method="filterGroup"
    v-model="selected"
    @change="changeGroup"
  />
  <div v-if="tasks.length > 0">
    <el-form label-width="120px" :inline="true">
    <el-tabs type="card" @tab-click="selectDays">
    <el-tab-pane label="Lundi">Lundi</el-tab-pane>
    <el-tab-pane label="Mardi">Mardi</el-tab-pane>
    <el-tab-pane label="Mercredi">Mercredi</el-tab-pane>
    <el-tab-pane label="Jeudi">Jeudi</el-tab-pane>
    <el-tab-pane label="Vendredi">Vendredi</el-tab-pane>
    <el-tab-pane label="Samedi">Samedi</el-tab-pane>
    <el-tab-pane label="Dimanche">Dimanche</el-tab-pane>
    <el-tab-pane label="Toutes">Toutes les tâches</el-tab-pane>
    <el-tab-pane label="Privées">Tâches privées</el-tab-pane>
    <el-tab-pane label="Dates précises">Dates précises</el-tab-pane>
    <br>
      <el-form-item >
      <div v-for="task in tasks">
        <el-card  class="card-custom" v-if="(day == 8 && task.isPrivate) || (day == 9 && task.isPrecise) || day == 7 || (task.days[day] && !task.isPrecise && !task.isPrivate)">
          <el-collapse>
            <el-collapse-item :title="task.isPrivate ? task.title + ' 🔒': task.isPrecise ? task.title + ' 📆' : task.title" name="1">
            <div>
              Titre: <el-input v-model="task.title" minlength="1" show-word-limit placeholder="Pas de titre"></el-input>
            </div>
            <div>
              Description: <el-input v-model="task.description" :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Pas de description"></el-input>
            </div>
              <div style="margin-top: 5%" v-if="!task.isPrecise">
              <el-button size="medium" id="day-but" circle :type="task.days[0] ? 'success' : 'info'" @click="upDays(0, task)">L</el-button>
              <el-button size="medium" id="day-but" circle :type="task.days[1] ? 'success' : 'info'" @click="upDays(1, task)">M</el-button>
              <el-button size="medium" id="day-but" circle :type="task.days[2] ? 'success' : 'info'" @click="upDays(2, task)">M</el-button>
              <el-button size="medium" id="day-but" circle :type="task.days[3] ? 'success' : 'info'" @click="upDays(3, task)">J</el-button>
              <el-button size="medium" id="day-but" circle :type="task.days[4] ? 'success' : 'info'" @click="upDays(4, task)">V</el-button>
              <el-button size="medium" id="day-but" circle :type="task.days[5] ? 'success' : 'info'" @click="upDays(5, task)">S</el-button>
              <el-button size="medium" id="day-but" circle :type="task.days[6] ? 'success' : 'info'" @click="upDays(6, task)">D</el-button>
              </div>
              <div>
              <hr></div>
              <div v-if="task.isPrivate">
              <el-cascader
    placeholder="Utilisateur"
    :options="users"
    filterable
    :filter-method="filterGroup"
    v-model="task.private"
    @change="editPrivate(task)"
    :props=" { multiple: true }"
  />
              <hr>
              </div>
              <el-popconfirm
            confirm-button-text="Oui"
            cancel-button-text="Non"
            icon="el-icon-info"
            icon-color="red"
            title="Êtes vous sûre de vouloir retirer cette tâche?"
            @confirm="removeTask(task)"
          >
            <template #reference>
              <icon name="trash-alt" class="trash-2" />
            </template>
          </el-popconfirm>
          
              </el-collapse-item></el-collapse
          >
          <el-time-picker v-if="!task.isPrecise"
      :disabled-hours="disabledTime"
      :disabled-minutes="disabledTime"
      format="HH:mm"
      style="margin-top: 5%"
      v-model="task.confirmationHour"
      placeholder="Heure de validation"
    >
    </el-time-picker>
    <el-date-picker v-else
      type="datetime"
      :disabled-hours="disabledTime"
      :disabled-minutes="disabledTime"
      format="DD/MM/YYYY HH:mm"
      v-model="task.confirmationHour"
      placeholder="Date de validation"
    >
    </el-date-picker>
        </el-card>
        </div>
      </el-form-item>
      </el-tabs>
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
const makeRange = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
export default {
  name: "TasksManager",
  data() {
    return {
      tasks: [],
      users: [],
      selected: -1,
      loading: false,
      done_by: {},
      day: 0,
      actual: new Date(Date.now()).getDay(),
    };
  },
  mounted() {
  },
  methods: {
    editPrivate(task) {
      for (let i = 0; i < this.users.length; i++) {
        for (let j = 0; j< task.private.length; j++) {
          if (task.private[j].includes(this.users[i].value) && !this.users[i].special.includes(task.id)) {
            this.users[i].special.push(task.id)
          }
          else if (!task.private[j].includes(this.users[i].value) && this.users[i].special.includes(task.id)) {
            this.users[i].special.splice(this.users[i].special.indexOf(task.id), 1)
          }
        }
      }
    },
    findIt(id) {
      return this.tasks.find(task => task.id == id).done_by
    },
    getWhoMakeIt(id) {
      let list = [];
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].special.includes(id)) {
          list.push([this.users[i].value]);
        }
      }
      return list;
    },
    selectDays(tab, event) {
      this.day = tab.index
    },
    filterGroup: function(node, keyword) {
      return RegExp("\\b" + keyword.toLowerCase() + "\\b").test(
        node.data.label.toLowerCase()
      );
    },
    upDays(index, task) {
      task.days[index] = task.days[index] == 1 ? 0 : 1;
    },
    changeGroup: async function() {
      const self = this;
      this.tasks = [];
      await this.$store.dispatch("getAllUser",0).then(function(data) {
        self.users = data.map(x => {
          return {
            label: x.f_name + ' ' +x.l_name,
            value: x.id,
            special: x.special,
          };
        });
      });
      await this.$store
        .dispatch(
          "retrieveAllTasksByGroup",
          this.$store.state.groups[this.selected - 1].value
        )
        .then(async (x) => {
          x = x.sort((a,b) => (a.confirmationHour > b.confirmationHour) ? 1 : ((b.confirmationHour > a.confirmationHour) ? -1 : 0))

          self.tasks = x.map(y => {
            y.isPrecise = new Date(y.confirmationHour).getFullYear() != 2999;
            if (!y.isPrivate)
              return y;
            y.private = self.getWhoMakeIt(y.id)
            return y;
          });
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
      for (let i = 0; i < this.users.length; i++)
        await this.$store.dispatch("setNewSpecial", {id: this.users[i].value, tab: this.users[i].special});
      await this.$store.dispatch("connect", this.$store.state.user.login);
      this.loading = false;
      ElMessage({ message: "Mis à jour avec succès.", type: "success" });
    },
    removeTask: async function(task) {
      this.loading = true;
      await this.$store.dispatch("deleteTask", task.id);
      for (let i = 0; i < this.tasks.length; i++)
        if (this.tasks[i].id == task.id) {
          this.tasks.splice(i, 1);
          break;
        }
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
#day-but {
    width: 45px;
    height: 45px;
}
</style>
