<script setup lang="ts">
import {computed, ref} from "vue";

interface Props {
  modelValue: boolean,
  size?: string,

  borderColor?: string,
  buttonColor?: string,
  activeColor?: string,
  inactiveColor?: string

  borderWidth?: string

  during?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: '16px',
  borderColor: '#555',
  buttonColor: '#999',
  activeColor: '#08f',
  inactiveColor: '#777',
  borderWidth: '2px',
  during: 0.2,
})

const emit = defineEmits(['update:modelValue']);
let modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
function clickEvent() {
  modelValue.value = !modelValue.value;
}
</script>

<template>
  <div
    class="switch"
    :style="{
      width: `calc(${props.size} * 2)`,
      height: props.size,
      backgroundColor: modelValue ? props.activeColor : props.inactiveColor,
      outline: `${props.borderColor} solid ${props.borderWidth}`,
      transition: `background-color linear ${props.during}s`
    }"
    @click="clickEvent()"
  >
    <div
      class="thumb"
      :style="{
        width: props.size ,
        height: props.size,
        backgroundColor: props.buttonColor,
        transform: `translateX(${modelValue ? '100%' : 0}`,
        outline: `${props.borderColor} solid ${props.borderWidth}`,
        transition: `transform linear ${props.during}s`
      }"
    ></div>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  border-radius: 999px;
  user-select: none;
  box-sizing: border-box;
  cursor: pointer;
  margin: 0 15px;
}

.thumb {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  border-radius: 50%;
}
</style>