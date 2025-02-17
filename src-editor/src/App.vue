<template>
  <vue-form v-model="formData" :schema="schema" :formProps="formProps" :formFooter="formFooter"
    @validation-failed="handlerValidationFailed" @submit="handlerSubmit" @cancel="handlerCancel"></vue-form>
</template>

<script>
import { JsonSchemaFormAntdV4 as VueForm } from "@lljj/vue3-form-ant";
import { getCurrentWindow } from '@tauri-apps/api/window';
import schema from "./schema.json";
import { get_config, set_config } from './store.js';

const formData = await get_config();
const editorWindow = getCurrentWindow();

export default {
  name: 'Config Editor',
  components: { VueForm },
  methods: {
    handlerValidationFailed(e) {
      e.forEach(e => this.$message.warning(`${schema.properties[e.name[0]].title} ${e.errors[0]}`))
    },
    handlerSubmit() {
      set_config(this.formData).then(this.$message.success.bind(this, "保存成功"))
    },
    handlerCancel() {
      editorWindow.close()
    },
  },
  data() {
    return { formData, schema, formProps: { layoutColumn: 3 }, formFooter: { cancelBtn: "关闭" } }
  },
  mounted() {
    globalThis.msg = this.$message;
  },
};
</script>