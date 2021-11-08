<template>
  <el-form
    :inline="true"
    ref="form"
    :model="form"
    label-width="120px"
    :rules="rules"
  >
    <el-form-item label="Prénom:" prop="f_name">
      <el-input
        v-model="f_name"
        :disabled="this.$store.state.user.level[3] == 0"
      ></el-input>
    </el-form-item>
    <el-form-item label="Nom:" prop="l_name">
      <el-input
        v-model="l_name"
        :disabled="this.$store.state.user.level[3] == 0"
      ></el-input>
    </el-form-item>
    <el-form-item label="Email:" prop="email">
      <el-input v-model="email"></el-input>
    </el-form-item>
    <el-form-item
      label="Notifications"
      v-if="
        this.$store.state.user.level[3] ||
          this.$store.state.user.level[2] ||
          this.$store.state.user.level[1]
      "
    >
      <el-checkbox-group v-model="notifications">
        <el-checkbox
          label="Chaque tâche"
          name="type"
          v-if="this.$store.state.user.level[1]"
        ></el-checkbox>
        <el-checkbox
          label="Résumé journalier groupe"
          name="type"
          v-if="this.$store.state.user.level[2]"
        ></el-checkbox>
        <el-checkbox
          label="Résumé journalier global"
          name="type"
          v-if="this.$store.state.user.level[3]"
        ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
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
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  name: "Settings",
  data() {
    return {
      l_name: this.$store.state.user.l_name,
      f_name: this.$store.state.user.f_name,
      email: this.$store.state.user.email,
      loading: false,
      notifications: [],
      ref: {
        "Chaque tâche": 0,
        "Résumé journalier groupe": 1,
        "Résumé journalier global": 2,
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
        email: [
          {
            type: "email",
            message: "Email invalide",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    onSubmit: async function() {
      this.$store.state.user.email = this.email;
      if (this.$store.state.user.level[3]) {
        this.$store.state.user.f_name = this.f_name;
        this.$store.state.user.l_name = this.l_name;
      }
      this.loading = true;
      const notif = [0, 0, 0];
      for (let i = 0; i < this.notifications.length; i++)
        notif[this.ref[this.notifications[i]]] = 1;
      this.$store.state.user.notifications = notif;
      const self = this;
      await this.$store
        .dispatch("updateUser", this.$store.state.user)
        .then((x) => {
          self.loading = false;
          ElMessage({ message: "Mis à jour avec succès.", type: "success" });
        });
    },
  },
  mounted() {
    this.loading = true;
    if (this.$store.state.user.notifications[0])
      this.notifications.push("Chaque tâche");
    if (this.$store.state.user.notifications[1])
      this.notifications.push("Résumé journalier groupe");
    if (this.$store.state.user.notifications[1])
      this.notifications.push("Résumé journalier global");

    this.loading = false;
  },
};
</script>
