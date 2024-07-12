<template>
  <div class="grid grid-cols-6 gap-4">
    <div v-for="i in 10" :key="i" class="card">
      <span class="text-lg">Nom magasin</span>
      <span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut omnis
        exercitationem nemo? Exercitationem, magni perferendis ut, amet rerum
        natus ex enim eveniet id magnam atque tenetur repudiandae tempore?
        Consequuntur, a?
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
