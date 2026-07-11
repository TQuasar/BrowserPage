<script setup lang="ts">
import {computed, ref} from 'vue'

type OptionValue = string | number | boolean
interface Option {
  label: string
  value: OptionValue
  disabled?: boolean
}

interface Props {
  modelValue: OptionValue | null
  options: Option[]
  placeholder?: string
  disabled?: boolean
  width?: string
  maxHeight?: string
  borderColor?: string
  activeColor?: string
  hoverColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: <Option[]>[],
  placeholder: '请选择',
  disabled: false,
  width: '180px',
  maxHeight: '240px',
  borderColor: '#d9d9d9',
  activeColor: '#409eff',
  hoverColor: '#f5f7ff'
})

const emit = defineEmits<{
  'update:modelValue': [OptionValue | null]
  change: [OptionValue | null]
}>()

const open = ref(false)

const selectedOption = computed(() => {
  return props.options.find(item => item.value === props.modelValue) ?? null
})

const toggleOpen = () => {
  if (props.disabled) return
  open.value = !open.value
}

const selectOption = (option: Option) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  open.value = false
}

const closeDropdown = () => {
  open.value = false
}
</script>

<template>
  <div class="dropdown" :class="{ 'is-disabled': disabled }" :style="{ width: width }">
    <div class="dropdown-select" @click="toggleOpen" @blur="closeDropdown" tabindex="0">
      <span class="dropdown-label">{{ selectedOption ? selectedOption.label : placeholder }}</span>
      <span class="dropdown-arrow">▾</span>
    </div>
    <div
      v-if="open"
      class="dropdown-menu"
      :style="{ maxHeight: maxHeight, borderColor: borderColor, '--active-color': activeColor, '--hover-color': hoverColor }"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        :class="{ 'is-active': option.value === modelValue, 'is-disabled': option.disabled }"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
      <div v-if="options.length === 0" class="dropdown-empty">暂无选项</div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  font-size: 14px;
  user-select: none;
}

.dropdown.is-disabled .dropdown-select {
  cursor: not-allowed;
  opacity: 0.6;
}

.dropdown-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
}

.dropdown-label {
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-arrow {
  margin-left: 8px;
  color: #8c8c8c;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 20;
  margin-top: 6px;
  background: #fff;
  border: 1px solid;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  overflow: auto;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--hover-color, #f5f7ff);
}

.dropdown-item.is-active {
  color: #fff;
  background: var(--active-color, #409eff);
}

.dropdown-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.dropdown-empty {
  padding: 10px 12px;
  color: #999;
}
</style>
