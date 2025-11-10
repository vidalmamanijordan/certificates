<script setup>
import { ref, getCurrentInstance, watch } from "vue";
import { getCertificatesByInput } from "@/services/sheets";
import ModalCertificates from "@/components/ModalCertificates.vue";
import { Award } from "lucide-vue-next";
import upeuFondo from "@/assets/images/upeu-fondo.png";

const dni = ref("");
const certificados = ref([]);
const showModal = ref(false);

const { appContext } = getCurrentInstance();
const toastr = appContext.config.globalProperties.$toastr;

// Limpiar input
const clearInput = () => {
  dni.value = "";
};

// Validar caracteres
watch(dni, (newValue) => {
  if (!newValue) return;
  if (!/^[a-zA-Z0-9]*$/.test(newValue)) {
    toastr.info("Por favor, ingrese un DNI o Código válido (sin símbolos)");
    dni.value = newValue.replace(/[^a-zA-Z0-9]/g, "");
  }
});

// Buscar certificados
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
    class="relative flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white text-center overflow-hidden"
  >
    <!-- Fondo -->
    <div
      class="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none select-none animate-float"
    >
      <img :src="upeuFondo" alt="Fondo UPeU" class="fondo-animado" />
    </div>

    <div
      class="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-800/40 to-blue-700/50 backdrop-blur-[3px]"
    ></div>

    <!-- Contenido -->
    <div
      class="relative z-10 max-w-lg w-full flex flex-col items-center justify-center space-y-6 animate-fade-in-up px-4"
    >
      <h1
        class="text-6xl font-extrabold drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse"
      >
        Certificados
      </h1>

      <p
        class="text-lg text-white/90 flex items-center justify-center gap-3 drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]"
      >
        Ingrese DNI o Código para validar tus certificados
        <span
          class="relative inline-flex items-center justify-center w-8 h-8 rounded-full"
        >
          <span
            class="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-md opacity-80 animate-pulse"
          ></span>
          <Award
            class="relative w-6 h-6 text-yellow-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.7)] transition-transform duration-500 ease-in-out hover:rotate-12 hover:scale-125 animate-glow"
          />
        </span>
      </p>

      <!-- Input y botón -->
      <div class="flex w-full justify-center">
        <div class="relative flex-1 max-w-sm">
          <input
            type="text"
            v-model="dni"
            placeholder="Ingrese su DNI o Código"
            @keyup.enter="buscarCertificados"
            class="w-full px-4 py-3 rounded-l-xl border border-transparent text-gray-800 pr-10 bg-white/90 backdrop-blur-sm shadow-sm hover:border-yellow-400 focus:border-yellow-400 focus:outline-none focus:ring-0 transition-all duration-300 ease-out"
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

    <!-- ⚡ Footer ultra limpio con efecto glow -->
    <footer
      class="fixed bottom-4 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-all duration-500 group animate-slide-up"
    >
      <span class="text-white/70 text-sm font-light tracking-wide">
        Powered by
      </span>
      <span
        class="font-semibold text-sm bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent animate-shimmer group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
      >
        Asuntos Académicos
      </span>
      <span class="text-white/40 text-xs ml-1">
        © UPeU {{ new Date().getFullYear() }}
      </span>
    </footer>
  </section>

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

/* Imagen fondo */
.fondo-animado {
  max-width: 600px;
  width: 80%;
  height: auto;
  drop-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
  filter: hue-rotate(10deg);
  transition: all 0.6s ease-in-out;
}

@media (max-width: 640px) {
  .fondo-animado {
    max-width: 90%;
    opacity: 0.5;
    transform: scale(1.1);
  }
}
@media (min-width: 1024px) {
  .fondo-animado {
    max-width: 750px;
    transform: scale(1.15);
  }
}

/* Animaciones */
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
  animation: fade-in-up 0.9s ease-out both;
}

@keyframes glow {
  0% {
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 14px rgba(255, 235, 59, 1))
      drop-shadow(0 0 24px rgba(255, 215, 0, 0.7));
  }
  100% {
    filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))
      drop-shadow(0 0 10px rgba(255, 215, 0, 0.2));
  }
}
.animate-glow {
  animation: glow 2.5s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1.05);
  }
  50% {
    transform: translateY(-15px) scale(1.08);
  }
}
.animate-float {
  animation: float 8s ease-in-out infinite;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slide-up 0.8s ease-out both;
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
.animate-shimmer {
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
}
</style>
