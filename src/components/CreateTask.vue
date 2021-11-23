import { encode } from '../utils/parser';
<template>
  <h1>Créer une nouvelle tâche</h1>
  <div v-if="done == ''">
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    :inline="true"
  >
    <el-form-item label="Poste(s):">
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
    <div>
    <el-radio v-model="precise" label="1" @click="choosePrecision(0)">Jours de la semaine + heure</el-radio>
    <el-radio v-model="precise" label="2" @click="choosePrecision(1)">Date précise</el-radio>
  </div>
  <div v-if="precise == '1'">
  <el-form
    ref="form"
    label-width="139px"
    :model="form"
    :inline="true">
    <el-form-item>
    <el-button :type="form.days[0] ? 'success' : 'info'" @click="upDays(0)">Lundi</el-button>
    </el-form-item>
    <el-form-item>
    <el-button :type="form.days[1] ? 'success' : 'info'" @click="upDays(1)">Mardi</el-button>
    </el-form-item>
    <el-form-item>
    <el-button :type="form.days[2] ? 'success' : 'info'" @click="upDays(2)">Mercredi</el-button>
    </el-form-item>
    <el-form-item>
    <el-button :type="form.days[3] ? 'success' : 'info'" @click="upDays(3)">Jeudi</el-button>
    </el-form-item>
    <el-form-item>
    <el-button :type="form.days[4] ? 'success' : 'info'" @click="upDays(4)">Vendredi</el-button>
    </el-form-item>
    <el-form-item>
    <el-button :type="form.days[5] ? 'success' : 'info'" @click="upDays(5)">Samedi</el-button>
    </el-form-item>
    <el-form-item>
    <el-button :type="form.days[6] ? 'success' : 'info'" @click="upDays(6)">Dimanche</el-button>
    </el-form-item>
    </el-form>
  <el-form
    ref="form"
    label-width="139px"
    :model="form"
    :inline="true">
    <el-form-item label="Heure de validation:">
        <el-time-picker
        @change="handleChangeTime"
        :disabled-hours="disabledTime"
      :disabled-minutes="disabledTime"
      format="HH:mm"
      v-model="validationHour"
      placeholder="Heure de validation"
    >
    </el-time-picker>
    </el-form-item>
    </el-form>
</div>
<div v-else>
 <el-form
    ref="form"
    label-width="200px"
    :model="form"
    :inline="true">
    <el-form-item label="Date et Heure de validation:">
        <el-date-picker
      type="datetime"
      :disabled-hours="disabledTime"
      :disabled-minutes="disabledTime"
      format="DD/MM/YYYY HH:mm"
      v-model="validationHour"
      placeholder="Heure de validation"
    >
    </el-date-picker>
    </el-form-item>
    </el-form>
</div>
<el-checkbox v-if="form.group != ''" v-model="form.isPrivate" label="Uniquement pour certaine(s) personne(s) ?"></el-checkbox>
<el-form v-if="form.isPrivate"
    ref="form"
    :model="form"
    label-width="120px"
    :inline="true"
  >
    <el-form-item label="Personne(s):">
      <el-cascader
        v-model="specials"
        :options="group_users"
        :props="props"
        clearable
        placeholder="Sélectionnez"
        @change="addSpecials"
      />
    </el-form-item>
  </el-form>
  <el-form ref="form" :model="form"  label-width="120px"  :inline="true" v-if="form.group != '' && precise == '1'">
<h4>Position</h4>
<el-tabs type="card" @tab-click="selectDays">
    <el-tab-pane label="Lundi">Lundi</el-tab-pane>
    <el-tab-pane label="Mardi">Mardi</el-tab-pane>
    <el-tab-pane label="Mercredi">Mercredi</el-tab-pane>
    <el-tab-pane label="Jeudi">Jeudi</el-tab-pane>
    <el-tab-pane label="Vendredi">Vendredi</el-tab-pane>
    <el-tab-pane label="Samedi">Samedi</el-tab-pane>
    <el-tab-pane label="Dimanche">Dimanche</el-tab-pane>
    <br>
    
<template v-if="tasks.length > 0">
<el-form-item>
  <el-card  v-for="task in tasks" :shadow="task.value == -1 ? 'always' : 'never'" :hidden="task.days[day] == 0" :class="task.value == -1 ? 'card-custom-new' : 'card-custom'" @click="log(task)"> <icon style="position:absolute; left: -100%" name="caret-right" v-if="task.value == -1" /> {{ task.value != -1 ? task.label : form.title != '' ? form.title : task.label }} <label style="position:absolute; right: -100%">{{ task.pos}}</label></el-card>
  </el-form-item>
  </template>

  </el-tabs></el-form>
   <el-form ref="form"  :model="form" label-width="120px"  :inline="true">
   <el-form-item>
        <el-button
          type="primary"
          :disabled="form.title=='' || form.group =='' || form.group == null || (form.isPrivate && specials.length == 0)"
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
const makeRange = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
function decode(crypted) {
  let result = [];
  let i = 0;
  const list = crypted.split(":");

  list.forEach(function(x) {
    result[i++] = parseInt(x);
  });

  return result;
}

function encode(tab) {
    let result = "";

    tab.forEach(function(x) {
        result += x + ":";
    });
    result = result.slice(0, -1)

    return result;
}

export default {
  name: "CreateTask",
  inheritAttrs: false,
  data() {
    return {
      precise: '1',
      props: { multiple: true },
      day: 0,
      validationHour: new Date(3000,0,0,0,0),
      loading: false,
      users:[],
      group_users: [],
      done: '',
      specials: [],
      form: {
        group: "",
        title: "",
        desc: "",
        comments: "Non",
        isPrivate: false,
        days: [1, 1, 1, 1, 1, 1, 1],
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
    handleChangeTime() {
      for (let i = 0; i < this.tasks.length; i++) { 
        if (this.tasks[i].value == -1) {
          this.tasks[i].pos = this.validationHour.toString().slice(16,21)
          this.tasks = this.tasks.sort((a,b) => (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0))
        }
}
    },
   selectDays(tab, event) {
      this.day = tab.index
    },
    choosePrecision(value) {
      if (value)
      this.validationHour = new Date(Date.now());
      else
      this.validationHour = new Date(3000,0,0,0,0);
    },
    upDays(index) {
      this.form.days[index] = this.form.days[index] == 1 ? 0 : 1;
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].value == -1) {
          this.tasks[i].days[index] = this.form.days[index];
        }
      }
      
    },
     disabledTime() {
      return makeRange(-1, -1)
    },
    onSubmit: async function() {
      if (this.form.title == "" || this.form.group == "" || this.form.group == null)
        return ;
      this.loading = true;
      const self = this;
      if (this.precise == '1') 
        this.validationHour = new Date(3000,0,0,this.validationHour.getHours(),this.validationHour.getMinutes());
      const task = {
        title: this.form.title,
        description: this.form.desc,
        can_comment: this.form.comments == 'Non' ? false : true,
        groups: this.form.group[0],
        confirmationHour: this.validationHour,
        isPrivate: this.form.isPrivate,
        days: encode(this.form.days),
      }

      await this.$store.dispatch('createTask', task).then(x => {
        if (self.form.isPrivate)
        {
          self.specials.forEach(function(y) {
            self.$store.dispatch('addSpecial', {
              task: x.id,
              user: y[0]
            })
          })
        }
        self.done = x.title;
        self.loading = false;
      })
    },
    reset: async function() {
      this.validationHour= new Date(3000,0,0,0,0)
      this.specials = [];
      this.form = {
        group: "",
        title: "",
        desc: "",
        comments: "Non",
        isPrivate: false,
        days: [1, 1, 1, 1, 1, 1, 1]
      }
      this.done = ''
      this.tasks = [];
    },
    newGroup: async function(a) {
      this.loading = true;
      const self = this;
      this.specials = [];
      if (this.form.group == null) {
        this.reset();
        this.loading = false;
      }
      let j = 0;
       for (let i = 0; i < this.users.length; i++)
            if (this.users[i].groups.find(x => x == this.form.group[0]))
            {
              this.group_users[j] = {}
                this.group_users[j].label = this.users[i].f_name + " " + this.users[i].l_name;
                this.group_users[j++].value = this.users[i].id
            }
      this.tasks = [];
      await this.$store.dispatch("retrieveAllTasksByGroup", this.form.group[0]).then(x => {
        
        for (let i = 0; i < x.length; i++) {
          console.log('accept ?: ', new Date(x[i].confirmationHour).getUTCDate())
          if (x[i].isPrivate || new Date(x[i].confirmationHour).getFullYear() != 2999)
            continue;
            console.log('received: ', x[i])
          self.tasks[self.tasks.length] = {value: x[i].id, label: x[i].title, pos: new Date(x[i].confirmationHour).toString().slice(16,21), days: x[i].days}
        }
        self.tasks[self.tasks.length] = {value: -1, label: "Nouvelle tâche", pos: new Date(3000,0,0,0,0).toString().slice(16,21), days: self.form.days};
        self.tasks = this.tasks.sort((a,b) => (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0))
        
        self.loading = false;
      })
    },

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
};
</script>

<style>
.card-custom-new {
  margin-bottom: 20px;
background: #d7d7d7;
color: black;
}
</style>