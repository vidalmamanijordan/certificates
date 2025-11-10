<template>
  <transition name="fade-zoom" appear>
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="relative bg-white rounded-2xl shadow-2xl p-4 w-full max-w-md text-gray-800 transform transition-all duration-300 border border-blue-100 hover:border-blue-300 hover:shadow-blue-100/70"
      >
        <!-- ❌ Botón de cerrar -->
        <button
          @click="$emit('close')"
          class="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 class="text-xl font-bold mb-3 text-center text-gray-800">Resultados</h2>

        <p
          v-if="certificados.length"
          class="text-center text-2xl font-semibold bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4 leading-snug tracking-wide"
        >
          {{ certificados[0].full_names }}
        </p>

        <div class="mb-3">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por evento o fecha..."
            class="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>

        <div v-if="paginatedCertificados.length">
          <ul class="space-y-2">
            <li
              v-for="(cert, index) in paginatedCertificados"
              :key="index"
              class="border border-gray-200 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-sm transform transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white text-sm"
            >
              <p><strong>Código:</strong> {{ cert.certificate_code }}</p>
              <p><strong>Evento:</strong> {{ cert.event }}</p>
              <p><strong>Fecha:</strong> {{ cert.date }}</p>
              <p>
                <strong>Participación:&nbsp;</strong>
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-white text-xs font-semibold transition-all duration-300',
                    cert.type.toLowerCase() === 'organizador'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : cert.type.toLowerCase() === 'ponente'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : cert.type.toLowerCase() === 'asistente'
                      ? 'bg-green-500 hover:bg-green-600'
                      : '',
                  ]"
                >
                  {{ cert.type }}
                </span>
              </p>

              <div class="flex items-center justify-between mt-3">
                <strong class="text-gray-700">Certificado:</strong>
                <a
                  :href="cert.url"
                  target="_blank"
                  class="group flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-amber-600 transition-all duration-300"
                >
                  <Award
                    class="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-6"
                  />
                  <span class="tracking-wide">Ver</span>
                </a>
              </div>
            </li>
          </ul>

          <div class="flex justify-end items-center gap-2 mt-4 text-xs">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-40 transition"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>

            <span class="text-gray-700 font-medium">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-40 transition"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 mt-4 text-sm">
          No se encontraron resultados
        </div>

        <div class="mt-5 text-center">
          <button
            @click="$emit('close')"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg shadow-md transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ChevronLeft, ChevronRight, Award } from "lucide-vue-next";

const props = defineProps({
  visible: Boolean,
  certificados: Array,
});

const searchTerm = ref("");
const currentPage = ref(1);
const itemsPerPage = 2;

const filteredCertificados = computed(() => {
  let certificados = [...props.certificados];
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    certificados = certificados.filter(
      (cert) =>
        cert.event.toLowerCase().includes(term) || cert.date.toLowerCase().includes(term)
    );
  }
  return certificados.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalPages = computed(() =>
  Math.ceil(filteredCertificados.value.length / itemsPerPage)
);

const paginatedCertificados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCertificados.value.slice(start, start + itemsPerPage);
});

watch(searchTerm, () => (currentPage.value = 1));

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
