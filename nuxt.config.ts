// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome"],

  tailwindcss: {
    // Options
  },

  ssr: false,

  fontawesome: {
    component: "fa",
    suffix: true,
    icons: {
      solid: ["times", "thermometer-half", "chevron-down", "add"],
    },
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      API_TOKEN: process.env.API_TOKEN,
    },
  },
})
