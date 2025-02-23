<template>
  <vue-form v-model="formData" :schema="schema" :formProps="formProps" :formFooter="formFooter"
    @validation-failed="handlerValidationFailed" @submit="handlerSubmit" @cancel="handlerCancel"></vue-form>
</template>

<script>
import { JsonSchemaFormAntdV4 } from "@lljj/vue3-form-ant"
import { invoke } from "@tauri-apps/api/core"
import { getCurrentWindow } from '@tauri-apps/api/window'
import schema from "./schema.json"
import { get_config, set_config } from './store.js'

const editorWindow = getCurrentWindow()
const applyConfig = invoke.bind(undefined, 'cross_webview_message', { target: 'main', message: 'applyConfig' })

const formData = await get_config()
const formProps = { layoutColumn: 3 }
const formFooter = { cancelBtn: "关闭" }

export default {
  name: 'Config Editor',
  components: { VueForm: JsonSchemaFormAntdV4 },
  methods: {
    handlerValidationFailed(e) {
      e.forEach(e => this.$message.warning(`${schema.properties[e.name[0]].title} ${e.errors[0]}`))
    },
    handlerSubmit() {
      set_config(this.formData)
        .then(applyConfig)
        .then(this.$message.success.bind(this, "保存成功", 3))
    },
    handlerCancel() {
      editorWindow.close()
    },
  },
  data() {
    return { formData, schema, formProps, formFooter }
  },
}
</script>