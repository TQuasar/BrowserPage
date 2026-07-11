<script setup lang="ts">
import {ref, watch} from 'vue'

interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: string
  color?: string
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false,
  indeterminate: false,
  size: '16px',
  color: '#409eff',
  borderColor: '#c9c9c9'
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  change: [boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}

watch(
  () => props.indeterminate,
  (value) => {
    if (inputRef.value) {
      inputRef.value.indeterminate = value
    }
  },
  { immediate: true }
)
</script>

<template>
  <label class="checkbox-wrapper" :class="{ 'is-disabled': disabled }">
    <input
      ref="inputRef"
      type="checkbox"
      class="checkbox-input"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />
    <span class="checkbox-box" :style="{ width: size, height: size, borderColor: borderColor, backgroundColor: modelValue ? color : '#fff' }">
      <svg v-if="modelValue && !indeterminate" viewBox="0 0 24 24" class="checkbox-icon">
        <path d="M20 6L9 17l-5-5" fill="none" stroke="#fff" stroke-width="2" />
      </svg>
      <span v-if="indeterminate" class="checkbox-indeterminate"></span>
    </span>
    <span class="checkbox-label" v-if="label">{{ label }}</span>
  </label>
</template>

<style scoped>
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.checkbox-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-radius: 4px;
  transition: background-color 0.2s, border-color 0.2s;
  box-sizing: border-box;
}

.checkbox-icon {
  width: 12px;
  height: 12px;
}

.checkbox-indeterminate {
  width: 10px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
}

.checkbox-label {
  margin-left: 8px;
  color: #333;
  line-height: 1;
}
</style>
