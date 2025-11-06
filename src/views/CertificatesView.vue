<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import SearchInput from "@/components/SearchInput.vue";
import ResultModal from "@/components/ResultModal.vue";
import { useCertificates } from "@/composables/useCertificates";

const { data, loading, error, fetchData, findByDniOrCode } = useCertificates();
const result = ref(null);
const showModal = ref(false);

const { appContext } = getCurrentInstance();
const toastr = appContext.config.globalProperties.$toastr;

onMounted(() => {
  fetchData();
});

const handleSearch = (term) => {
  const found = findByDniOrCode(term);
  if (found) {
    result.value = found;
    showModal.value = true;
  } else {
    toastr.warning("No se encontró ningún certificado con ese número");
  }
};
</script>

<template>
  <section
    class="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white px-4 py-12"
  >
    <h1 class="text-4xl font-bold mb-6">Verificación de Certificados</h1>

    <SearchInput @search="handleSearch" />

    <p v-if="loading" class="mt-4 text-white/80">Cargando datos...</p>
    <p v-if="error" class="mt-4 text-red-200">{{ error }}</p>

    <ResultModal :show="showModal" :result="result" @close="showModal = false" />
  </section>
</template>
