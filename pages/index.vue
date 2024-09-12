<template>
  <div class="flex flex-col space-y-6">
    <div class="card">
      <div class="flex justify-between w-full">
        <div class="w-1/3" />

        <div class="w-1/3 flex items-center justify-center">
          <span class="text-xl font-semibold">Liste des magasins</span>
        </div>

        <div class="w-1/3 flex justify-end">
          <button class="btn-primary space-x-2" @click="showAddShop = true">
            <fa-icon :icon="['fas', 'plus']" />
            <span>Ajouter un magasin</span>
          </button>
        </div>
      </div>
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
                    shop.passerelles.reduce(
                      (acc, gateway) =>
                        acc +
                        gateway.machines.filter((fridge) =>
                          fridge.sondes.some(
                            (probe) =>
                              probe.mesures[probe.mesures.length - 1]
                                ?.temperature > 15
                          )
                        ).length,
                      0
                    ),
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
                    shop.passerelles.reduce(
                      (acc, gateway) =>
                        acc +
                        gateway.machines.filter(
                          (fridge) =>
                            fridge.sondes.some(
                              (probe) =>
                                probe.mesures[probe.mesures.length - 1]
                                  ?.temperature > 10 &&
                                probe.mesures[probe.mesures.length - 1]
                                  ?.temperature <= 15
                            ) &&
                            !fridge.sondes.some(
                              (probe) =>
                                probe.mesures[probe.mesures.length - 1]
                                  ?.temperature > 15
                            )
                        ).length,
                      0
                    ),
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
                    shop.passerelles.reduce(
                      (acc, gateway) =>
                        acc +
                        gateway.machines.filter((fridge) =>
                          fridge.sondes.every(
                            (probe) =>
                              probe.mesures[probe.mesures.length - 1]
                                ?.temperature <= 10
                          )
                        ).length,
                      0
                    ),
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
            <option value="machines">Nombre de réfrigérateurs</option>
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

    <div v-if="filteredShops.length > 0" class="grid grid-cols-4 gap-4">
      <div v-for="shop in filteredShops" :key="shop.id" class="card">
        <div class="flex items-center justify-between w-full">
          <span class="text-lg">
            {{ shop.name }} (T° moy. :
            {{ getAverageTemperature(shop).toFixed(1) }}°C)
          </span>

          <button class="btn-primary" @click="showModalMachine(shop)">
            <fa-icon :icon="['fas', 'plus']" />
          </button>
        </div>

        <div
          v-for="passerelle in shop.passerelles"
          :key="passerelle.id"
          class="border rounded p-1 w-full"
        >
          <span> Passerelle : {{ passerelle.name }} </span>

          <div class="grid grid-cols-2 gap-2 w-full">
            <div
              v-for="fridge in passerelle.machines"
              :key="fridge.id"
              class="flex flex-col items-center justify-center rounded-md cursor-pointer py-1 px-2 h-fit transition-colors duration-300 ease-in-out"
              :class="{
                'bg-gray-200': fridge.showProbes,
                'bg-red-200':
                  !fridge.showProbes &&
                  fridge.sondes.some(
                    (probe) =>
                      probe.mesures[probe.mesures.length - 1]?.temperature > 15
                  ),
                'bg-yellow-200':
                  !fridge.showProbes &&
                  fridge.sondes.some(
                    (probe) =>
                      probe.mesures[probe.mesures.length - 1]?.temperature >
                        10 &&
                      probe.mesures[probe.mesures.length - 1]?.temperature <= 15
                  ) &&
                  !fridge.sondes.some(
                    (probe) =>
                      probe.mesures[probe.mesures.length - 1]?.temperature > 15
                  ),
                'bg-green-200':
                  !fridge.showProbes &&
                  fridge.sondes.every(
                    (probe) =>
                      probe.mesures[probe.mesures.length - 1]?.temperature <= 10
                  ),
              }"
              @mouseover="fridge.showProbes = true"
              @mouseleave="fridge.showProbes = false"
              @click="showModal(fridge)"
            >
              <button class="btn-primary" @click.stop="showModalProbe(fridge)">
                <fa-icon :icon="['fas', 'plus']" />
              </button>

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
                    v-for="probe in fridge.sondes"
                    :key="probe.id"
                    class="rounded-md py-1 px-2 transition-colors"
                    :class="{
                      'bg-red-200':
                        probe.mesures[probe.mesures.length - 1]?.temperature >
                        15,
                      'bg-yellow-200':
                        probe.mesures[probe.mesures.length - 1]?.temperature >
                          10 &&
                        probe.mesures[probe.mesures.length - 1]?.temperature <=
                          15,
                      'bg-green-200':
                        probe.mesures[probe.mesures.length - 1]?.temperature <=
                        10,
                    }"
                  >
                    <div class="flex items-center space-x-2">
                      <fa-icon :icon="['fas', 'thermometer-half']" />
                      <span>
                        {{ probe.name }} :
                        {{
                          probe.mesures[probe.mesures.length - 1]?.temperature
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
    </div>
    <span v-else class="font-semibold text-xl text-center">
      Aucun magasin ne correspond à vos critères de recherche
    </span>

    <ModalProbe
      v-if="showProbeChart"
      :fridge="selectedFridge"
      :series="
        selectedFridge.sondes.map((probe) => ({
          name: probe.name,
          data: probe.mesures.map((temperature) => temperature.temperature),
        }))
      "
      :options="chatOptions"
      @close="hideModal()"
    />

    <Modal
      v-if="showAddShop"
      title="Ajouter un magasin"
      :class="'w-1/3'"
      @close="showAddShop = false"
    >
      <template #body>
        <div class="flex flex-col space-y-1 text-gray-500 w-full">
          <label for="name">Nom du magasin</label>
          <input v-model="newShop.name" type="text" id="name" class="input" />
        </div>
      </template>

      <template #footer="{ slotScope }">
        <div class="flex justify-center mt-5 items-center space-x-5">
          <button class="btn-danger" @click="slotScope()">Annuler</button>
          <button class="btn-primary" @click="saveShop(slotScope)">
            Enregistrer
          </button>
        </div>
      </template>
    </Modal>

    <Modal
      v-if="showAddMachine"
      title="Ajouter une machine"
      :class="'w-1/3'"
      @close="showAddMachine = false"
    >
      <template #body>
        <div class="flex flex-col space-y-1 text-gray-500 w-full">
          <label for="name">Nom de la machine</label>
          <input
            v-model="newMachine.name"
            type="text"
            id="name"
            class="input"
          />
        </div>
      </template>

      <template #footer="{ slotScope }">
        <div class="flex justify-center mt-5 items-center space-x-5">
          <button class="btn-danger" @click="slotScope()">Annuler</button>
          <button class="btn-primary" @click="saveMachine(slotScope)">
            Enregistrer
          </button>
        </div>
      </template>
    </Modal>

    <Modal
      v-if="showAddProbe"
      title="Ajouter une sonde"
      :class="'w-1/3'"
      @close="showAddProbe = false"
    >
      <template #body>
        <div class="flex flex-col space-y-1 text-gray-500 w-full">
          <label for="name">Nom de la sonde</label>
          <input v-model="newProbe.name" type="text" id="name" class="input" />
        </div>
      </template>

      <template #footer="{ slotScope }">
        <div class="flex justify-center mt-5 items-center space-x-5">
          <button class="btn-danger" @click="slotScope()">Annuler</button>
          <button class="btn-primary" @click="saveProbe(slotScope)">
            Enregistrer
          </button>
        </div>
      </template>
    </Modal>
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
const showAddShop = ref(false)
const showAddProbe = ref(false)
const newShop = ref({
  name: "",
})
const selectedMachine = ref(null)
const selectedShop = ref(null)
const showAddMachine = ref(false)
const newMachine = ref({
  name: "",
})
const newProbe = ref({
  name: "",
})

// Fetch the shops data
const fetchShops = async () => {
  const { data } = await $fetch(`${config.public.API_URL}/magasin/magasin`, {
    headers: {
      Authorization: `Bearer ${config.public.API_TOKEN}`,
    },
  })
  console.log(data)

  data.forEach((shop) => {
    shop.passerelles.forEach((gateway) => {
      gateway.machines.forEach((fridge) => {
        fridge.sondes.forEach((probe) => {
          probe.mesures.sort((a, b) => new Date(a.date) - new Date(b.date))
        })
      })
    })
  })

  shops.value = data
  filteredShops.value = shops.value
}

const saveShop = async (slotScope) => {
  const data = await $fetch(`${config.public.API_URL}/magasin/magasin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.public.API_TOKEN}`,
    },
    body: JSON.stringify(newShop.value),
  })

  showAddShop.value = false
  slotScope()

  fetchShops()
}

const saveMachine = async (slotScope) => {
  await $fetch(`${config.public.API_URL}/machine/machine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.public.API_TOKEN}`,
    },
    body: JSON.stringify({
      name: newMachine.value.name,
      idPhysique: newMachine.value.name,
      passerelleId: selectedShop.value.passerelles[0].id,
    }),
  })

  showAddMachine.value = false
  slotScope()

  fetchShops()
}

const saveProbe = async (slotScope) => {
  const data = await $fetch(`${config.public.API_URL}/sonde/sonde`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.public.API_TOKEN}`,
    },
    body: JSON.stringify({
      name: newProbe.value.name,
      idPhysique: newProbe.value.name,
      machineId: selectedMachine.value.id,
    }),
  })

  showAddProbe.value = false
  slotScope()

  fetchShops()
}

// Apply filters and sort
const applyFiltersAndSort = () => {
  filteredShops.value = shops.value
    .map((shop) => {
      const filteredmachines = shop.passerelles.map((gateway) =>
        gateway.machines
          .map((fridge) => {
            const filteredProbes = fridge.sondes.filter((probe) => {
              let lastTemperature =
                probe.mesures[probe.mesures.length - 1]?.temperature

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
              sondes: filteredProbes,
            }
          })
          .filter((fridge) => fridge.sondes.length > 0)
      )

      return {
        ...shop,
        machines: filteredmachines,
      }
    })
    .filter((shop) => shop.machines.length > 0)

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
      else if (key === "machines") return a.machines.length - b.machines.length
      else if (key === "temperature") {
        const avgTempA = getAverageTemperature(a)
        const avgTempB = getAverageTemperature(b)
        return avgTempA - avgTempB
      }
    })
  } else {
    filteredShops.value.sort((a, b) => {
      if (key === "name") return b.name.localeCompare(a.name)
      else if (key === "machines") return b.machines.length - a.machines.length
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

  shop.passerelles.forEach((gateway) => {
    gateway.machines.forEach((fridge) => {
      fridge.sondes.forEach((probe) => {
        probe.mesures.forEach((mesure) => {
          totalTemp += mesure.temperature
          count++
        })
      })
    })
  })

  return totalTemp / count
}

// Modal visibility
const showModal = (probe) => {
  selectedFridge.value = probe
  showProbeChart.value = true
}

const showModalMachine = (shop) => {
  selectedShop.value = shop
  showAddMachine.value = true
}

const showModalProbe = (machine) => {
  selectedMachine.value = machine
  showAddProbe.value = true
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
    categories: selectedFridge.value?.sondes[0].mesures.map(
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
