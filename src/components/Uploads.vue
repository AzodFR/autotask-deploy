<template>
<h1>Choisissez un logo</h1>
  <el-upload
    class="avatar-uploader"
    ref="upload"
    :action="url"
    :show-file-list="false"
    :on-change="handleAvatarSuccess"
    :auto-upload="false"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <h1 v-else class="avatar-uploader-icon">+</h1>
  </el-upload>
   <h4>250x250</h4>
  <el-button :type="imageUrl ? 'success' : 'danger'" class="validate-button" @click="submitUpload" :disabled="imageUrl == ''" >Valider</el-button>
</template>

<script>
import { Plus } from "@element-plus/icons";
import { ElMessage } from "element-plus";
export default {
  components: {
    Plus,
  },
  data() {
    return {
      url: this.$store.state.instance.defaults.baseURL + "/users/test",
      imageUrl: "",
    };
  },
  methods: {
    submitUpload() {
      const img = this.imageUrl
      this.$refs.upload.submit();
      this.imageUrl = img
       ElMessage({ message: "Mis à jour avec succès.", type: "success" });
    },
    handleAvatarSuccess(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
  },
  mounted() {},
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  color: #8c939d;
  width: 250px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
}
.validate-button {
  margin-top: 50px;
  font-size: 1.5rem
}
.avatar {
  width: 250px;
  height: 250px;
  display: block;
}
</style>
