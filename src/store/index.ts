import { AxiosResponse } from "axios";
import Vuex from "vuex";
const axios = require("axios");

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
  console.log(tab);
  let result = "";
  tab.forEach(function(x) {
    result += x + ":";
  });
  result = result.slice(0, -1);
  return result;
}

const instance = axios.create({
  // baseURL: "http://192.168.96.194:3000/",
  baseURL: "",
});
export default new Vuex.Store({
  state: {
    instance: instance,
    first: false,
    user: {
      id: -2,
      login: "",
      f_name: "",
      l_name: "",
      groups: [],
      groups_id: [],
      special: [],
      email: "",
      notifications: [],
      level: [],
    },
    logout: {
      id: -1,
      login: "",
      f_name: "",
      l_name: "",
      groups: [],
      groups_id: [],
      special: [],
      email: "",
      notifications: [],
      level: [],
    },
    page: 0,
    groups: [],
    tasks: [],
    g_tasks: []
  },
  mutations: {
    logUser: function(state, user) {
      state.user = user;
    },
    getGroups: function(state, groups) {
      state.groups = groups;
    },
    setGroups_id: function(state, groups) {
      state.user.groups_id = groups;
    },
    getTasks: function(state, tasks) {
      state.tasks = tasks;
    },
    getGTasks: function(state, tasks) {
      for (let i = 0; i < tasks.length; i++) {
        tasks[i].days = decode(tasks[i].days);
      }
      state.g_tasks = tasks;
    },
  },
  actions: {
    decodeStore: ({commit, state}, str) => { return decode(str)},
    setNew: ({commit, state}, url) => {
      state.instance = axios.create({
        baseURL: url,
      });
    },
    pingNew: ({commit, state}, url) => {
      return new Promise(async (resolve, reject) => {
        state.instance = axios.create({
          baseURL: url,
        });
        state.instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
        state.instance.get(`/users/all`).then((result) => {   
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
      })
    },
    connect: ({ commit, state }, id) => {
      
      return new Promise(async (resolve, reject) => {
        state.instance.post(`/users/connect/${id}`).then(async function(user) {
          if (user.data == "") resolve({ id: -1 });
          else {
            user.data.level = decode(user.data.level);
            user.data.groups_id = []
            if (user.data.groups != "")
                await state.instance.get(`/groups/list/${user.data.groups}`).then(function(list) {
                  for(let i = 0; i < list.data.length; i++)
                  {
                      user.data.groups_id[i] = {
                          value: list.data[i].id,
                          label: list.data[i].name,
                          tasks: list.data[i].tasks
                      }
                  }
                })
            user.data.special = decode(user.data.special);
            user.data.groups = decode(user.data.groups);
            user.data.notifications = decode(user.data.notifications);
            commit("logUser", user.data);
            resolve(user.data);
          }
        });
      });
    },
    refreshGroup: ({commit, state}, login) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/users/user/${login}`).then(async (user) => {
          await state.instance.get(`/groups/list/${user.data.groups}`).then(function(list) {
            user.data.groups_id = []
            for(let i = 0; i < list.data.length; i++)
            {
                user.data.groups_id[i] = {
                    value: list.data[i].id,
                    label: list.data[i].name,
                    tasks: list.data[i].tasks
                }
            }
            commit("setGroups_id", user.data.groups_id);
          })
          resolve(user.data)
        })
      })
    },
    createUser: ({ commit,state }, user) => {
      return new Promise((resolve, reject) => {
        state.instance
          .post(`/users/create`, {
            f_name: user.f_name,
            l_name: user.l_name,
            email: user.email,
            login: 0,
            level: encode(user.perm),
            groups: encode(user.group),
          })
          .then(function(user) {
            resolve(user.data.login);
          });
      });
    },
    updateUser: ({commit, state}, newUser) => {
      const self = this;
      return new Promise((resolve, reject) => {
        let user = {...newUser}
        if (typeof(user.level) != "string")
          user.level = encode(user.level)
        if (typeof(user.groups) != "string")
          user.groups = encode(user.groups)
        if (typeof(user.notifications) != "string")
          user.notifications = encode(user.notifications)
        state.instance.post(`/users/update`, user).then(x => 
          resolve(x.data))
      })
    },
    setNewSpecial: ({commit, state}, special) => {
      const tab = encode([...special.tab])
      if (!isNaN(special.tab[0]))
      return new Promise((resolve, reject) => {
        state.instance.post(`/users/set/special/${special.id}/${tab}`).then(x => {
          resolve(x.data);
        });
      });
      else
      return new Promise((resolve, reject) => {
        state.instance.post(`/users/set/special/${special.id}`).then(x => {
          console.log(x.data)
          resolve(x.data);
        });
      });
    },
    removeUserGroup: ({commit, state}, list) => {
      return new Promise ((resolve, reject) => {
        state.instance.post(`/users/fire/${list.login}/${list.group}`).then(x => resolve(x.data))
      })
    },
    deleteUser: ({commit, state}, id) => {
      return new Promise((resolve, reject) => {
        state.instance.delete(`/users/${id}`).then(x => resolve(x.data))
      })
    },
    getAllUser: ({commit, state}, nothing) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/users/all`).then(x => {
          for (let i = 0; i < x.data.length; i++) {
            x.data[i].special = decode(x.data[i].special);
          }
          console.log(x.data)
          resolve(x.data)
        })
      })
    },
    countUser: ({commit, state}, nothing) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/users/count`).then(x => {
          resolve(x.data)
        })
      })
    },
    addSpecial: ({commit, state}, list) => {
      return new Promise((resolve, reject) => {
        state.instance.post(`/users/special/${list.user}/${list.task}`).then(x => resolve(x.data))
      })
    },
    getUser: ({commit, state}, login) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/users/user/${login}`).then(x => {
          resolve(x.data)
        })
      })
    },
    createGroup: ({ commit,state }, group) => {
      return new Promise((resolve, reject) => {
        state.instance
          .post(`/groups/create`, {
            name: group.group_name,
          })
          .then(function(groups) {
            resolve(groups.data.name);
          });
      });
    },
    deleteGroup: ({commit, state}, group) => {
      return new Promise ((resolve, reject) => {
        state.instance.delete(`/groups/${group}`).then(x => resolve(x.data))
      })
    },
    retrieveAllGroups: ({ commit,state }, nothing) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/groups/all`).then(function(groups) {
          let options_group = [];
          for (let i = 0; i < groups.data.length; i++) {
            options_group[i] = {
              value: groups.data[i].id,
              label: groups.data[i].name,
            };
          }
          options_group = options_group.sort((a,b) => (a.value> b.value) ? 1 : ((b.value> a.value) ? -1 : 0))
          commit("getGroups", options_group);
          resolve(groups.data);
        });
      });  
    },
    retrieveAllTasks: ({commit, state}, nothing) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/tasks/all`).then(function(tasks) {
          commit("getTasks", tasks.data);
          resolve(tasks.data);
        })
      })
    },
    retrieveAllTasksByGroup: ({commit, state}, id) => {
      return new Promise((resolve, reject) => {
        state.instance.get(`/tasks/group/${id}`).then(function(tasks) {
          commit("getGTasks", tasks.data);
          resolve(state.g_tasks);
        })
      })
    },
    createTask: ({commit, state}, task) => {
      return new Promise((resolve, reject) => {
         state.instance
          .post(`/tasks/add`, task).then( function(res) {
             state.instance.post(`/groups/add_task/${task.groups}/${res.data.id}`).then(function(x) {
              resolve(res.data);
            })
          })
      })
    },
    updateTask: ({commit, state}, task) => {
      task.days = encode(task.days)
      return new Promise((resolve, reject) => {
        state.instance.post(`/tasks/update`, task).then(function(res) {
          resolve(res);
        })
      })
    },
    updateTaskDone: ({commit, state}, task) => {
      task.days = encode(task.days)
      return new Promise((resolve, reject) => {
        state.instance.post(`/tasks/update/done`, task).then(function(res) {
          resolve(res);
        })
      })
    },
    deleteTask: ({commit, state}, id) => {
      return new Promise((resolve, reject) => {
        state.instance.delete(`/tasks/${id}`).then(x => resolve(x.data))
      })
    },
  },
});
