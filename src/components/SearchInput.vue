<script setup>
import { ref, watch, getCurrentInstance } from "vue";
const emit = defineEmits(["search"]); // emitirá el término al padre
const dni = ref("");

const { appContext } = getCurrentInstance();
const toastr = appContext.config.globalProperties.$toastr;

const clearInput = () => {
  dni.value = "";
};

watch(dni, (newValue) => {
  if (!newValue) return;
  if (!/^\d*$/.test(newValue)) {
    toastr.info("Por favor, ingrese solo números: DNI o Código de estudiante");
    dni.value = newValue.replace(/\D/g, "");
  }
});

const handleSearch = () => {
  if (!dni.value) {
    toastr.warning("Ingrese DNI o código para buscar");
    return;
  }
  emit("search", dni.value);
};
</script>

<template>
  <div class="flex w-full max-w-md">
    <div class="relative flex-1">
      <input
        v-model="dni"
        type="text"
        placeholder="Ingrese su DNI o Código"
        class="w-full px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 pr-10"
      />
      <button
        v-if="dni"
        @click="clearInput"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
      >
        ✕
      </button>
    </div>

    <button
      @click="handleSearch"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-r-lg flex items-center justify-center transition-colors"
    >
      🔍
    </button>
  </div>
</template>
