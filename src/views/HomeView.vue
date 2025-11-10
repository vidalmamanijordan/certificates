<script setup>
import { ref, getCurrentInstance, watch } from "vue";
import { getCertificatesByInput } from "@/services/sheets";
import ModalCertificates from "@/components/ModalCertificates.vue";

// 🔹 Ícono de certificado
import { Award } from "lucide-vue-next";

const dni = ref("");
const certificados = ref([]);
const showModal = ref(false);

const { appContext } = getCurrentInstance();
const toastr = appContext.config.globalProperties.$toastr;

// 🔹 Limpiar input
const clearInput = () => {
  dni.value = "";
};

// 🔹 Validar caracteres
watch(dni, (newValue) => {
  if (!newValue) return;

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
    class="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white px-6 text-center overflow-hidden"
  >
    <div
      class="max-w-lg w-full flex flex-col items-center justify-center space-y-6 animate-fade-in-up"
    >
      <h1 class="text-6xl font-extrabold drop-shadow-lg animate-pulse">Certificados</h1>

      <!-- 🔹 Texto + Ícono con efectos -->
      <p class="text-lg text-white/90 flex items-center justify-center gap-3">
        Ingrese DNI o Código para validar tus certificados
        <span
          class="relative inline-flex items-center justify-center w-8 h-8 rounded-full"
        >
          <!-- Glow animado detrás -->
          <span
            class="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-md opacity-80 animate-pulse"
          ></span>

          <!-- Ícono principal -->
          <Award
            class="relative w-6 h-6 text-yellow-300 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)] transition-transform duration-500 ease-in-out hover:rotate-12 hover:scale-125 animate-glow"
          />
        </span>
      </p>

      <!-- Input con botón -->
      <div class="flex w-full justify-center">
        <div class="relative flex-1 max-w-sm">
          <input
            type="text"
            v-model="dni"
            placeholder="Ingrese su DNI o Código"
            class="w-full px-4 py-3 rounded-l-xl border border-transparent text-gray-800 pr-10 bg-white/90 backdrop-blur-sm shadow-sm hover:border-yellow-400 focus:border-yellow-400 focus:outline-none focus:ring-0 transition-all duration-300 ease-out"
          />

          <!-- Botón limpiar -->
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
          class="bg-yellow-400 text-white px-4 py-3 rounded-r-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
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
    </div>
  </section>

  <!-- Modal -->
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

/* Animación de entrada */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out both;
}

/* ✨ Animación de brillo continuo */
@keyframes glow {
  0% {
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 235, 59, 0.9))
      drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
  }
  100% {
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.2));
  }
}

.animate-glow {
  animation: glow 2s infinite ease-in-out;
}
</style>
