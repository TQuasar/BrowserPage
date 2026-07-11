<script setup lang="ts">
import {ref} from 'vue'

interface Props {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  position: 'top',
  delay: 150,
  width: '200px'
})

const visible = ref(false)
let timer: number | null = null

const show = () => {
  if (timer) {
    window.clearTimeout(timer)
  }
  timer = window.setTimeout(() => {
    visible.value = true
  }, props.delay)
}

const hide = () => {
  if (timer) {
    window.clearTimeout(timer)
    timer = null
  }
  visible.value = false
}
</script>

<template>
  <div class="tooltip-wrapper" @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide">
    <slot />
    <div
      v-if="visible"
      class="tooltip-box"
      :class="`tooltip-${position}`"
      :style="{ width }"
    >
      {{ content }}
    </div>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-box {
  position: absolute;
  z-index: 50;
  padding: 10px 12px;
  border-radius: 6px;
  background-color: rgba(60, 60, 60, 0.94);
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  white-space: normal;
  word-break: break-word;
}

.tooltip-top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}
</style>
