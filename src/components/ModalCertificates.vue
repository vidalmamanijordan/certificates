<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg text-gray-800">
      <h2 class="text-2xl font-bold mb-2 text-center">Resultados</h2>

      <!-- 👤 Nombre del participante -->
      <p
        v-if="certificados.length"
        class="text-left text-lg font-bold bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-5 leading-snug tracking-wide"
      >
        {{ certificados[0].full_names }}
      </p>

      <!-- 🔍 Campo de búsqueda -->
      <div class="mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nombre del evento o fecha..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 📋 Lista filtrada -->
      <div v-if="filteredCertificados.length">
        <ul class="space-y-3">
          <li
            v-for="(cert, index) in filteredCertificados"
            :key="index"
            class="border p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <p><strong>Evento:</strong> {{ cert.event }}</p>
            <p><strong>Código:</strong> {{ cert.certificate_code }}</p>
            <p><strong>Fecha:</strong> {{ cert.date }}</p>
            <p><strong>DNI:</strong> {{ cert.dni }}</p>
            <p>
              <strong>Ver certificado:</strong>
              <a :href="cert.url" target="_blank" class="text-blue-600 underline">
                Abrir enlace
              </a>
            </p>
          </li>
        </ul>
      </div>

      <div v-else class="text-center text-gray-500">No se encontraron resultados</div>

      <div class="mt-6 text-center">
        <button
          @click="$emit('close')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  visible: Boolean,
  certificados: Array,
});

const searchTerm = ref("");

// 🔎 Filtra y ordena los certificados (más recientes primero)
const filteredCertificados = computed(() => {
  let certificados = [...props.certificados];

  // Filtrado por evento o fecha
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    certificados = certificados.filter(
      (cert) =>
        cert.event.toLowerCase().includes(term) || cert.date.toLowerCase().includes(term)
    );
  }

  // 🕒 Ordenar por fecha descendente (más recientes primero)
  return certificados.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
});
</script>
