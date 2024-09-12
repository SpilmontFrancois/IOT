<template>
  <div class="flex flex-col space-y-6">
    <div class="card">
      <span class="text-xl font-semibold">Liste des magasins</span>
    </div>

    <div class="flex space-x-6">
      <div class="card space-y-2 w-2/3">
        <span class="text-lg font-semibold">Filtres</span>

        <div class="flex items-center justify-evenly w-full">
          <div
            class="flex items-center space-x-2 cursor-pointer"
            :class="{ 'opacity-50': !filters.red }"
            @click="toggleFilter('red')"
          >
            <div
              class="flex items-center justify-center rounded-full h-8 w-8 font-semibold bg-red-200"
            >
              {{
                shops.reduce(
                  (acc, shop) =>
                    acc +
                    shop.fridges.filter((fridge) =>
                      fridge.probes.some(
                        (probe) =>
                          probe.temperatures[probe.temperatures.length - 1]
                            .value > 15
                      )
                    ).length,
                  0
                )
              }}
            </div>
            <span>Température > 15°C</span>
          </div>
          <div
            class="flex items-center space-x-2 cursor-pointer"
            :class="{ 'opacity-50': !filters.yellow }"
            @click="toggleFilter('yellow')"
          >
            <div
              class="flex items-center justify-center rounded-full h-8 w-8 font-semibold bg-yellow-200"
            >
              {{
                shops.reduce(
                  (acc, shop) =>
                    acc +
                    shop.fridges.filter(
                      (fridge) =>
                        fridge.probes.some(
                          (probe) =>
                            probe.temperatures[probe.temperatures.length - 1]
                              .value > 10 &&
                            probe.temperatures[probe.temperatures.length - 1]
                              .value <= 15
                        ) &&
                        !fridge.probes.some(
                          (probe) =>
                            probe.temperatures[probe.temperatures.length - 1]
                              .value > 15
                        )
                    ).length,
                  0
                )
              }}
            </div>
            <span>Température > 10°C et ≤ 15°C</span>
          </div>
          <div
            class="flex items-center space-x-2 cursor-pointer"
            :class="{ 'opacity-50': !filters.green }"
            @click="toggleFilter('green')"
          >
            <div
              class="flex items-center justify-center rounded-full h-8 w-8 font-semibold bg-green-200"
            >
              {{
                shops.reduce(
                  (acc, shop) =>
                    acc +
                    shop.fridges.filter((fridge) =>
                      fridge.probes.every(
                        (probe) =>
                          probe.temperatures[probe.temperatures.length - 1]
                            .value <= 10
                      )
                    ).length,
                  0
                )
              }}
            </div>
            <span>Température ≤ 10°C</span>
          </div>
        </div>
      </div>

      <div class="card space-y-2 w-1/3">
        <span class="text-lg font-semibold">Trier par</span>

        <div class="flex items-center space-x-4 w-full">
          <select
            v-model="sortKey"
            @change="applyFiltersAndSort"
            class="select"
          >
            <option value="name">Nom</option>
            <option value="fridges">Nombre de réfrigérateurs</option>
            <option value="temperature">Température moyenne</option>
          </select>

          <select
            v-model="sortOrder"
            @change="applyFiltersAndSort"
            class="select"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher un magasin"
        class="input"
        @input="applyFiltersAndSort"
      />
    </div>

    <div v-if="filteredShops.length" class="grid grid-cols-5 gap-4">
      <div v-for="shop in filteredShops" :key="shop.id" class="card">
        <span class="text-lg">
          {{ shop.name }} (T° moy. :
          {{ getAverageTemperature(shop).toFixed(1) }}°C)
        </span>

        <div class="grid grid-cols-2 gap-2 w-full">
          <div
            v-for="fridge in shop.fridges"
            :key="fridge.id"
            class="flex flex-col items-center justify-center rounded-md cursor-pointer py-1 px-2 h-fit transition-colors duration-300 ease-in-out"
            :class="{
              'bg-gray-200': fridge.showProbes,
              'bg-red-200':
                !fridge.showProbes &&
                fridge.probes.some(
                  (probe) =>
                    probe.temperatures[probe.temperatures.length - 1].value > 15
                ),
              'bg-yellow-200':
                !fridge.showProbes &&
                fridge.probes.some(
                  (probe) =>
                    probe.temperatures[probe.temperatures.length - 1].value >
                      10 &&
                    probe.temperatures[probe.temperatures.length - 1].value <=
                      15
                ) &&
                !fridge.probes.some(
                  (probe) =>
                    probe.temperatures[probe.temperatures.length - 1].value > 15
                ),
              'bg-green-200':
                !fridge.showProbes &&
                fridge.probes.every(
                  (probe) =>
                    probe.temperatures[probe.temperatures.length - 1].value <=
                    10
                ),
            }"
            @mouseover="fridge.showProbes = true"
            @mouseleave="fridge.showProbes = false"
            @click="showModal(fridge)"
          >
            <div class="flex items-center justify-between w-full">
              <div />
              <span>
                {{ fridge.name }}
              </span>
              <fa-icon
                :icon="['fas', 'chevron-down']"
                class="transition-transform duration-300"
                :class="{ 'transform rotate-180': fridge.showProbes }"
              />
            </div>

            <transition name="expand">
              <div
                v-show="fridge.showProbes"
                class="flex flex-col space-y-1 w-full overflow-hidden"
                style="transition: max-height 0.3s ease, opacity 0.3s ease"
                :style="{
                  maxHeight: fridge.showProbes ? '500px' : '0',
                  opacity: fridge.showProbes ? '1' : '0',
                }"
              >
                <div
                  v-for="probe in fridge.probes"
                  :key="probe.id"
                  class="rounded-md py-1 px-2 transition-colors"
                  :class="{
                    'bg-red-200':
                      probe.temperatures[probe.temperatures.length - 1].value >
                      15,
                    'bg-yellow-200':
                      probe.temperatures[probe.temperatures.length - 1].value >
                        10 &&
                      probe.temperatures[probe.temperatures.length - 1].value <=
                        15,
                    'bg-green-200':
                      probe.temperatures[probe.temperatures.length - 1].value <=
                      10,
                  }"
                >
                  <div class="flex items-center space-x-2">
                    <fa-icon :icon="['fas', 'thermometer-half']" />
                    <span>
                      {{ probe.name }} :
                      {{
                        probe.temperatures[probe.temperatures.length - 1].value
                      }}°C
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <span v-else class="font-semibold text-xl text-center">
      Aucun magasin ne correspond à vos critères de recherche
    </span>

    <ModalProbe
      v-if="showProbeChart"
      :fridge="selectedFridge"
      :series="
        selectedFridge.probes.map((probe) => ({
          name: probe.name,
          data: probe.temperatures.map((temperature) => temperature.value),
        }))
      "
      :options="chatOptions"
      @close="hideModal()"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"

const config = useRuntimeConfig()

// Reactive state
const shops = ref([])
const filteredShops = ref([])
const filters = ref({
  red: true,
  yellow: true,
  green: true,
})
const search = ref("")
const sortKey = ref("name")
const sortOrder = ref("asc")
const showProbeChart = ref(false)
const selectedFridge = ref(null)

// Fetch the shops data
const fetchShops = async () => {
  const data = await $fetch(
    `${config.public.API_URL}/machine/machines-by-passerelle-id/1`,
    {
      headers: {
        Authorization: `Bearer ${config.public.API_TOKEN}`,
      },
    }
  ).then((res) => res.json())
  console.log(data)

  // for (let i = 0; i < 10; i++) {
  //   let shop = {
  //     id: i,
  //     name: `Magasin ${i}`,
  //     fridges: [],
  //   }

  //   for (let j = 0; j < 5; j++) {
  //     shop.fridges.push({
  //       id: `${i}-${j}`,
  //       name: `Frigo ${j}`,
  //       probes: [],
  //       showProbes: false,
  //     })

  //     for (let k = 0; k < 2; k++) {
  //       shop.fridges[j].probes.push({
  //         id: `${i}-${j}-${k}`,
  //         name: `Sonde ${k}`,
  //         temperatures: Array.from({ length: 20 }, () => ({
  //           date: new Date(
  //             new Date().setHours(
  //               new Date().getHours() - Math.floor(Math.random() * 24)
  //             )
  //           ).toISOString(),
  //           value: Math.floor(Math.random() * 20),
  //         })),
  //       })
  //     }
  //   }

  //   shop.fridges.forEach((fridge) => {
  //     fridge.probes.forEach((probe) => {
  //       probe.temperatures.sort((a, b) => new Date(a.date) - new Date(b.date))
  //     })
  //   })

  //   shops.value.push(shop)
  // }

  filteredShops.value = shops.value
}

// Apply filters and sort
const applyFiltersAndSort = () => {
  filteredShops.value = shops.value
    .map((shop) => {
      const filteredFridges = shop.fridges
        .map((fridge) => {
          const filteredProbes = fridge.probes.filter((probe) => {
            let lastTemperature =
              probe.temperatures[probe.temperatures.length - 1].value

            return (
              (filters.value.red && lastTemperature > 15) ||
              (filters.value.yellow &&
                lastTemperature > 10 &&
                lastTemperature <= 15) ||
              (filters.value.green && lastTemperature <= 10)
            )
          })

          return {
            ...fridge,
            probes: filteredProbes,
          }
        })
        .filter((fridge) => fridge.probes.length > 0)

      return {
        ...shop,
        fridges: filteredFridges,
      }
    })
    .filter((shop) => shop.fridges.length > 0)

  filteredShops.value = filteredShops.value.filter((shop) =>
    shop.name.toLowerCase().includes(search.value.toLowerCase())
  )

  sortShops()
}

// Sort shops
const sortShops = () => {
  const key = sortKey.value
  const order = sortOrder.value
  // filter depending on order
  if (order === "asc") {
    filteredShops.value.sort((a, b) => {
      if (key === "name") return a.name.localeCompare(b.name)
      else if (key === "fridges") return a.fridges.length - b.fridges.length
      else if (key === "temperature") {
        const avgTempA = getAverageTemperature(a)
        const avgTempB = getAverageTemperature(b)
        return avgTempA - avgTempB
      }
    })
  } else {
    filteredShops.value.sort((a, b) => {
      if (key === "name") return b.name.localeCompare(a.name)
      else if (key === "fridges") return b.fridges.length - a.fridges.length
      else if (key === "temperature") {
        const avgTempA = getAverageTemperature(a)
        const avgTempB = getAverageTemperature(b)
        return avgTempB - avgTempA
      }
    })
  }
}

// Calculate average temperature
const getAverageTemperature = (shop) => {
  let totalTemp = 0
  let count = 0

  shop.fridges.forEach((fridge) => {
    fridge.probes.forEach((probe) => {
      totalTemp += probe.temperatures[probe.temperatures.length - 1].value
      count++
    })
  })

  return totalTemp / count
}

// Modal visibility
const showModal = (probe) => {
  selectedFridge.value = probe
  showProbeChart.value = true
}

const hideModal = () => {
  selectedFridge.value = null
  showProbeChart.value = false
}

// Chart options computed property
const chatOptions = computed(() => ({
  chart: {
    type: "line",
  },
  xaxis: {
    categories: selectedFridge.value?.probes[0].temperatures.map(
      (temperature) => temperature.date
    ),
  },
  annotations: {
    yaxis: [
      {
        y: 0,
        y2: 10,
        borderColor: "#000",
        fillColor: "#bbf7d0",
        opacity: 0.4,
      },
      {
        y: 10,
        y2: 15,
        borderColor: "#000",
        fillColor: "#fef08a",
        opacity: 0.4,
      },
      {
        y: 15,
        y2: 20,
        borderColor: "#000",
        fillColor: "#fecaca",
        opacity: 0.4,
      },
    ],
  },
}))

// Watchers
watch([search, sortKey, sortOrder], () => {
  applyFiltersAndSort()
})

// Toggle filter
const toggleFilter = (color) => {
  filters.value[color] = !filters.value[color]
  applyFiltersAndSort()
}

// Fetch shops on mount
onMounted(() => {
  fetchShops()
})
</script>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter,
.expand-leave-to

/* .expand-leave-active in <2.1.8 */ {
  opacity: 0;
  max-height: 0;
}
</style>
