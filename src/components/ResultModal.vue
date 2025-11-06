<!-- src/components/ResultModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full text-gray-800 relative transform transition-transform duration-200"
      role="dialog"
      aria-modal="true"
    >
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h2 class="text-2xl font-bold mb-4 text-indigo-600">Certificado encontrado 🎓</h2>

      <div v-if="result" class="space-y-2">
        <p>
          <strong>Nombre:</strong>
          <span class="font-medium">{{
            result.full_names || result.name || result.nombre
          }}</span>
        </p>
        <p>
          <strong>DNI:</strong>
          <span class="font-medium">{{ result.dni || result.DNI }}</span>
        </p>
        <p>
          <strong>Código:</strong>
          <span class="font-medium">{{
            result.certificate_code || result.code || result.codigo
          }}</span>
        </p>
        <p>
          <strong>Fecha:</strong>
          <span class="font-medium">{{ result.date || result.fecha }}</span>
        </p>

        <a
          v-if="result.url"
          :href="result.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block mt-3 text-blue-600 hover:underline"
        >
          Ver certificado
        </a>
      </div>

      <div v-else class="text-gray-500">Sin datos para mostrar</div>

      <div class="mt-6 text-right">
        <button
          @click="$emit('close')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  result: { type: Object, default: null },
});
</script>

<style scoped>
/* puedes añadir animación si quieres */
</style>
