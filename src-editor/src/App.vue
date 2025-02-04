<template>
  <pre hidden>{{ formData }}</pre>
  <vue-form v-model="formData" :schema="schema"></vue-form>
</template>

<script>
import schema from "./schema.json";
import { get_config, set_config } from './store.js';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { JsonSchemaFormAntdV4 as VueForm } from "@lljj/vue3-form-ant";

const formData = await get_config();
const editorWindow = getCurrentWindow();

export default {
  name: 'Config Editor',
  components: { VueForm },
  data() { return { formData, schema } },
  mounted() {
    this.$nextTick(() => {
      const cancel_button = document.querySelector("#app > form > div.formFooter_item > div > div > div > div > div > button.ant-btn.ant-btn-default");
      const submit_button = document.querySelector("#app > form > div.formFooter_item > div > div > div > div > div > button.ant-btn.ant-btn-primary");

      cancel_button.onclick = () => editorWindow.close();
      submit_button.onclick = () => set_config(this.formData).then(() => alert("已保存"));
    });
  },
};
</script>