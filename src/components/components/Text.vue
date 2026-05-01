<script setup lang="ts">
interface Props {
  text: string,
  color?: string,
  size?: string,
  // 字体属性
  fontWeight?: string | number,
  fontStyle?: 'normal' | 'italic' | 'oblique',
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline',
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize',
  letterSpacing?: string,
  lineHeight?: string,
  // 对齐方式
  textAlign?: 'left' | 'center' | 'right' | 'justify',
  // 文本溢出
  textOverflow?: 'clip' | 'ellipsis' | 'string',
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line',
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto',
  // 交互
  cursor?: 'pointer' | 'default' | 'text' | 'not-allowed',
  userSelect?: 'none' | 'text' | 'all' | 'contain',
  // 背景与装饰
  backgroundColor?: string,
  // 间距
  padding?: string,
  margin?: string,
  // 边框
  border?: string,
  borderRadius?: string,
  // 效果
  opacity?: string | number,
  transition?: string,
  // 其他
  tag?: 'span' | 'p' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  title?: string,
  // 事件
  clickable?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'span',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textTransform: 'none',
  textAlign: 'left',
  textOverflow: 'clip',
  whiteSpace: 'normal',
  overflow: 'visible',
  cursor: 'default',
  userSelect: 'text',
  opacity: 1,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="props.tag"
    v-text="text"
    :title="props.title"
    :style="{
      color: props.color,
      fontSize: props.size,
      fontWeight: props.fontWeight,
      fontStyle: props.fontStyle,
      textDecoration: props.textDecoration,
      textTransform: props.textTransform,
      letterSpacing: props.letterSpacing,
      lineHeight: props.lineHeight,
      textAlign: props.textAlign,
      textOverflow: props.textOverflow,
      whiteSpace: props.whiteSpace,
      overflow: props.overflow,
      cursor: props.clickable ? 'pointer' : props.cursor,
      userSelect: props.userSelect,
      backgroundColor: props.backgroundColor,
      padding: props.padding,
      margin: props.margin,
      border: props.border,
      borderRadius: props.borderRadius,
      opacity: props.opacity,
      transition: props.transition,
    }"
    @click="handleClick"
  />
</template>

<style scoped>
</style>