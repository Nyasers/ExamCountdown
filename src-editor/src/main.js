import { createApp } from 'vue'
import App from './App.vue'
import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Popover,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  SelectOption,
  Slider,
  Switch,
  Textarea,
  TimePicker,
  Upload
} from 'ant-design-vue'

const app = createApp(App)
app.use(AutoComplete)
app.use(Button)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(DatePicker)
app.use(Form)
app.use(FormItem)
app.use(Input)
app.use(InputNumber)
app.use(Popover)
app.use(Radio)
app.use(RadioGroup)
app.use(RangePicker)
app.use(Rate)
app.use(Select)
app.use(SelectOption)
app.use(Slider)
app.use(Switch)
app.use(Textarea)
app.use(TimePicker)
app.use(Upload)

app.mount('#app')
