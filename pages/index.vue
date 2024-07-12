<template>
  <div class="flex flex-col space-y-6">
    <div class="card">
      <span class="text-xl font-semibold">Liste des magasins</span>
    </div>

    <div class="grid grid-cols-6 gap-4">
      <div v-for="shop in shops" :key="shop.id" class="card">
        <span class="text-lg">{{ shop.name }}</span>

        <div class="grid grid-cols-3 gap-2 w-full">
          <div
            v-for="probe in shop.probes"
            :key="probe.id"
            class="flex flex-col items-center justify-center rounded-md cursor-pointer"
            :class="{
              'bg-red-200': probe.temperature > 15,
              'bg-yellow-200':
                probe.temperature > 10 && probe.temperature <= 15,
              'bg-green-200': probe.temperature <= 10,
            }"
            @click="showModal(probe)"
          >
            <div class="flex items-center space-x-2">
              <fa-icon :icon="['fas', 'thermometer-half']" />
              <span>
                {{ probe.name }}
              </span>
            </div>

            <span>{{ probe.temperature }}°C</span>
          </div>
        </div>
      </div>
    </div>

    <ModalProbe
      v-if="showProbeChart"
      :probe-name="selectedProbe.name"
      @close="hideModal()"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      shops: [],
      showProbeChart: false,
      selectedProbe: null,
    }
  },
  mounted() {
    this.fetchShops()
  },
  methods: {
    fetchShops() {
      for (let i = 0; i < 10; i++) {
        let shop = {
          id: i,
          name: `Shop ${i}`,
          probes: [],
        }

        for (let j = 0; j < 4; j++) {
          shop.probes.push({
            id: `${i}-${j}`,
            name: `Probe ${j}`,
            temperature: Math.floor(Math.random() * 21),
          })
        }

        this.shops.push(shop)
      }
    },
    showModal(probe) {
      this.selectedProbe = probe
      this.showProbeChart = true
    },
    hideModal() {
      this.selectedProbe = null
      this.showProbeChart = false
    },
  },
}
</script>
