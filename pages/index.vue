<template>
  <div class="flex flex-col space-y-6">
    <div class="card">
      <span class="text-xl font-semibold">Liste des magasins</span>
    </div>

    <div class="grid grid-cols-6 gap-4">
      <div v-for="shop in shops" :key="shop.id" class="card">
        <span class="text-lg">{{ shop.name }}</span>

        <div class="grid grid-cols-3 gap-1 w-full">
          <div
            v-for="probe in shop.probes"
            :key="probe.id"
            class="flex flex-col items-center justify-center rounded-md"
            :class="{
              'bg-red-200': probe.temperature > 15,
              'bg-yellow-200':
                probe.temperature > 10 && probe.temperature <= 15,
              'bg-green-200': probe.temperature <= 10,
            }"
          >
            <span>
              {{ probe.name }}
            </span>

            <span>{{ probe.temperature }}°C</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shops: [],
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
  },
}
</script>
