<template>
  <div
    class="center-component"
    :class="customClass"
    :style="'z-index:' + zIndex"
  >
    <div class="bg-white rounded-lg">
      <div class="relative cursor-pointer" @click="close">
        <fa-icon
          class="absolute top-0 right-0 fa-lg m-5"
          :icon="['fas', 'xmark']"
        />
      </div>
      <div class="py-5 px-10">
        <slot name="header">
          <p class="font-semibold text-xl text-center mb-2">
            {{ title }}
          </p>
        </slot>
        <div>
          <slot name="body"></slot>
        </div>
        <slot :slot-scope="close" name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalComponent',
  props: {
    title: {
      type: String,
      default: '',
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  data() {
    return {
      activeBgDiv: undefined,
      zIndex: 30,
    }
  },
  mounted() {
    if (document.body.firstChild.style) this.zIndex++

    const show = document.createElement('div')
    show.style.position = 'fixed'
    show.style.top = '0'
    show.style.left = '0'
    show.style.width = '100%'
    show.style.height = '100%'
    show.style.background = '#000'
    show.style.opacity = '0.3'
    show.style.zIndex = this.zIndex

    document.body.insertBefore(show, document.body.firstChild)

    show.addEventListener('click', this.close)

    this.activeBgDiv = show
  },
  methods: {
    close() {
      this.activeBgDiv?.remove()
      this.activeBgDiv = undefined
      this.$emit('close')
    },
  },
}
</script>
