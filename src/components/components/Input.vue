<script setup lang="ts">
interface Props {
  modelValue: string | number,
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url',
  placeholder?: string,
  disabled?: boolean,
  readonly?: boolean,
  maxlength?: number,
  minlength?: number,
  spellcheck?: boolean,
  // 样式
  width?: string,
  height?: string,
  fontSize?: string,
  borderRadius?: string,
  // 颜色
  borderColor?: string,
  focusBorderColor?: string,
  backgroundColor?: string,
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  spellcheck: false,
  width: '90%',
  height: '24px',
  fontSize: '14px',
  borderRadius: '6px',
  borderColor: 'rgb(85 141 88)',
  focusBorderColor: '#b6d5b8',
  backgroundColor: 'rgb(223 234 223)',
  textColor: '#454545',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('change', value)
}
</script>

<template>
  <input
    class="input"
    :class="{ 'is-disabled': disabled, 'is-readonly': readonly }"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :spellcheck="spellcheck"
    :disabled="disabled"
    :readonly="readonly"
    :maxlength="maxlength"
    :minlength="minlength"
    :style="{
      width: props.width,
      height: props.height,
      fontSize: props.fontSize,
      borderRadius: props.borderRadius,
      borderColor: props.borderColor,
      backgroundColor: props.backgroundColor,
      color: props.textColor,
    }"
    @input="handleInput"
    @change="handleChange"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<style scoped>
.input {
  padding: 0 12px;
  border: 1px solid;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  margin: 0 15px;
}

.input:focus {
  border-color: v-bind(focusBorderColor);
  box-shadow: 0 0 0 2px rgb(83 255 64 / 0.2);
}

.input.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #f5f7fa;
}

.input.is-readonly {
  cursor: default;
}
</style>