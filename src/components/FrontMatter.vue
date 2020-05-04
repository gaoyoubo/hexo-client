<template>
  <el-dialog title="Front-matter" :visible.sync="visible">
    <el-form>
      <el-form-item label="title">
        <el-input v-model="title"></el-input>
      </el-form-item>
      <el-form-item label="value">
        <el-input
          autocomplete="off"
          type="textarea"
          :rows="3"
          v-model="value"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">Cancel</el-button>
      <el-button type="primary" @click="ok">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "FrontMatter",
  props: {},
  data() {
    return {
      visible: false,
      // inputTitle: this.title,
      // inputValue: this.value
      title: "",
      value: ""
    };
  },
  methods: {
    ok() {
      let me = this;
      this.$emit("ok", {
        title: me.title,
        value: me.value
      });
      this.visible = false;
    },
    open(title, value) {
      this.visible = true;

      this.title = title || "";
      this.value = value || "";
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style scoped></style>
