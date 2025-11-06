<script setup>
import { ref, getCurrentInstance, watch } from "vue";
import { getCertificatesByInput } from "@/services/sheets";
import ModalCertificates from "@/components/ModalCertificates.vue";

const dni = ref("");
const certificados = ref([]);
const showModal = ref(false);

const { appContext } = getCurrentInstance();
const toastr = appContext.config.globalProperties.$toastr;

// 🔹 Limpiar input
const clearInput = () => {
  dni.value = "";
};

// 🔹 Validar que solo acepte números (pero permitir letras para códigos también)
watch(dni, (newValue) => {
  if (!newValue) return;

  // Si contiene solo letras y no dígitos, se avisa que el código debe tener formato válido
  if (!/^[a-zA-Z0-9]*$/.test(newValue)) {
    toastr.info("Por favor, ingrese un DNI o Código válido (sin símbolos)");
    dni.value = newValue.replace(/[^a-zA-Z0-9]/g, "");
  }
});

// 🔹 Buscar certificados
const buscarCertificados = async () => {
  if (!dni.value) {
    toastr.warning("Por favor, ingrese su DNI o Código de estudiante");
    return;
  }

  try {
    const result = await getCertificatesByInput(dni.value);
    if (result.length) {
      certificados.value = result;
      showModal.value = true;
    } else {
      toastr.info("No se encontraron certificados para este DNI o Código");
    }
  } catch (error) {
    toastr.error("Error al buscar certificados");
    console.error(error);
  }
};
</script>

<template>
  <section
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white px-4"
  >
    <h1 class="text-6xl font-extrabold drop-shadow-lg mb-4 animate-pulse">
      Certificados
    </h1>
    <p class="text-lg text-white/90 mb-8 text-center">
      Ingrese DNI o Código para validar tus certificados ✨
    </p>

    <!-- Input con botón de búsqueda -->
    <div class="flex w-full max-w-md">
      <div class="relative flex-1">
        <input
          type="text"
          v-model="dni"
          placeholder="Ingrese su DNI o Código"
          class="w-full px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 pr-10"
        />

        <!-- Botón de limpiar -->
        <button
          v-if="dni"
          @click="clearInput"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>
      </div>

      <!-- Botón buscar -->
      <button
        @click="buscarCertificados"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-r-lg flex items-center justify-center transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
          />
        </svg>
      </button>
    </div>
  </section>

  <!-- Modal con los resultados -->
  <ModalCertificates
    :visible="showModal"
    :certificados="certificados"
    @close="showModal = false"
  />
</template>

<style scoped>
.toast {
  margin-bottom: 6px !important;
}
</style>
