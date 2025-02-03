<template>
  <vue-form value="formData" :schema="schema">
  </vue-form>
</template>

<script>
import schema from "./schema.json";
import { JsonSchemaFormAntdV4 as VueForm } from "@lljj/vue3-form-ant";

export default {
  name: 'Config Editor',
  components: {
    VueForm
  },
  data() {
    return {
      formData: {},
      schema
    };
  }
};
</script>