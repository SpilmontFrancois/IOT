<template>
  <div>
    <div
      class="fixed inset-0 bg-black opacity-50 z-10"
      @click="$emit('close')"
    />

    <div class="bg-white p-4 rounded-md z-20 w-1/2 center-component">
      <div class="flex justify-between w-full">
        <span class="text-lg font-semibold whitespace-nowrap">
          Graphique d'évolution de la température pour la machine :
          {{ machine.name }}
        </span>

        <div class="flex justify-end">
          <button @click="$emit('close')">
            <fa-icon :icon="['fas', 'times']" />
          </button>
        </div>
      </div>

      <ClientOnly v-if="series.length > 0">
        <apexchart
          height="400"
          width="100%"
          :options="options"
          :series="series"
        />
      </ClientOnly>
      <div v-else class="text-center">
        <span class="font-semibold">
          Aucune donnée disponible pour cette machine
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    machine: {
      type: Object,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
}
</script>
