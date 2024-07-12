<template>
  <div class="flex flex-col space-y-6">
    <div class="card">
      <span class="text-xl font-semibold">Liste des magasins</span>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div v-for="shop in shops" :key="shop.id" class="card">
        <span class="text-lg">{{ shop.name }}</span>

        <div class="grid grid-cols-2 gap-2 w-full">
          <div
            v-for="fridge in shop.fridges"
            :key="fridge.id"
            class="flex flex-col items-center justify-center rounded-md cursor-pointer py-1 px-2 h-fit"
            :class="{
              'bg-red-200': fridge.probes.some(
                (probe) => probe.temperature > 15
              ),
              'bg-yellow-200': fridge.probes.some(
                (probe) => probe.temperature > 10 && probe.temperature <= 15
              ),
              'bg-green-200': fridge.probes.every(
                (probe) => probe.temperature <= 10
              ),
              'bg-gray-200': fridge.showProbes,
            }"
            @mouseover="fridge.showProbes = true"
            @mouseleave="fridge.showProbes = false"
            @click="showModal(fridge)"
          >
            <span>
              {{ fridge.name }}
            </span>

            <div v-if="fridge.showProbes" class="flex flex-col space-y-1">
              <div
                v-for="probe in fridge.probes"
                :key="probe.id"
                class="rounded-md py-1 px-2"
                :class="{
                  'bg-red-200': probe.temperature > 15,
                  'bg-yellow-200':
                    probe.temperature > 10 && probe.temperature <= 15,
                  'bg-green-200': probe.temperature <= 10,
                }"
              >
                <div class="flex items-center space-x-2">
                  <fa-icon :icon="['fas', 'thermometer-half']" />
                  <span>{{ probe.name }} : {{ probe.temperature }}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalProbe
      v-if="showProbeChart"
      :probe="selectedProbe"
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
          name: `Magasin ${i}`,
          fridges: [],
        }

        for (let j = 0; j < 5; j++) {
          shop.fridges.push({
            id: `${i}-${j}`,
            name: `Frigo ${j}`,
            probes: [],
            showProbes: false,
          })

          for (let k = 0; k < 2; k++) {
            shop.fridges[j].probes.push({
              id: `${i}-${j}-${k}`,
              name: `Sonde ${k}`,
              temperature: Math.floor(Math.random() * 21),
            })
          }
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
