<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default',
  size?: 'large' | 'medium' | 'small' | "smaller",
  disabled?: boolean,
  plain?: boolean,
  round?: boolean,
  circle?: boolean,
  // 样式
  width?: string,
  height?: string,
  fontSize?: string,
  padding?: string,
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  plain: false,
  round: false,
  circle: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const sizeMap = {
  large: { height: '40px', fontSize: '16px', padding: '0 20px' },
  medium: { height: '32px', fontSize: '14px', padding: '0 16px' },
  small: { height: '24px', fontSize: '12px', padding: '0 12px' },
  smaller: { height: '16px', fontSize: '10px', padding: '0 10px' }
}

const colorMap = {
  primary: { bg: '#409eff', plainBg: '#ecf5ff', plainColor: '#409eff' },
  success: { bg: '#67c23a', plainBg: '#f0f9eb', plainColor: '#67c23a' },
  warning: { bg: '#e6a23c', plainBg: '#fdf6ec', plainColor: '#e6a23c' },
  danger: { bg: '#f56c6c', plainBg: '#fef0f0', plainColor: '#f56c6c' },
  info: { bg: '#909399', plainBg: '#f4f4f5', plainColor: '#909399' },
  default: { bg: '#ffffff', plainBg: '#ffffff', plainColor: '#606266' },
}
</script>

<template>
  <button
    class="btn"
    :class="[
      `btn-${type}`,
      `btn-${size}`,
      {
        'is-disabled': disabled,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
      }
    ]"
    :disabled="disabled"
    :style="{
      width: props.circle ? (props.height ?? sizeMap[size!].height) : props.width,
      height: props.height ?? sizeMap[size!].height,
      fontSize: sizeMap[size!].fontSize,
      padding: props.padding ?? sizeMap[size!].padding,
      backgroundColor: plain ? colorMap[type!].plainBg : colorMap[type!].bg,
      borderColor: colorMap[type!].bg,
      color: plain ? colorMap[type!].plainColor : (type === 'default' ? '#606266' : '#ffffff'),
    }"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-sizing: border-box;
}

.btn:hover:not(.is-disabled) {
  opacity: 0.8;
}

.btn.is-round {
  border-radius: 999px;
}

.btn.is-circle {
  border-radius: 50%;
  padding: 0;
  width: v-bind('sizeMap[size].height');
}

.btn.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>