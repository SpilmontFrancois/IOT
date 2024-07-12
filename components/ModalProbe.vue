<template>
  <div>
    <div
      class="fixed inset-0 bg-black opacity-50 z-10"
      @click="$emit('close')"
    />

    <div class="flex items-center justify-center">
      <div class="bg-white p-4 rounded-md z-20 w-1/2">
        <div class="flex justify-between w-full">
          <span class="text-lg font-semibold whitespace-nowrap">
            Graphique d'évolution de la température pour la sonde :
            {{ probeName }}
          </span>

          <div class="flex justify-end">
            <button @click="$emit('close')">
              <fa-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>

        <div>Chart à mettre ici</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    probeName: {
      type: String,
      required: true,
    },
  },
}
</script>
