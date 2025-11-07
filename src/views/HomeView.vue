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

      <!-- Botón buscar amarillo sólido con icono de lupa -->
      <button
        @click="buscarCertificados"
        class="bg-yellow-400 text-white px-4 py-3 rounded-r-lg flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <!-- Icono clásico de lupa -->
          <circle cx="11" cy="11" r="7" stroke-linecap="round" stroke-linejoin="round" />
          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke-linecap="round"
            stroke-linejoin="round"
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
