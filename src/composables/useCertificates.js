// src/composables/useCertificates.js
import { ref } from "vue";
import { getCertifiedData } from "@/services/sheets";

export function useCertificates() {
  const data = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const rows = await getCertifiedData();
      data.value = rows;
    } catch (err) {
      console.error(err);
      error.value = "No se pudo cargar los datos.";
    } finally {
      loading.value = false;
    }
  };

  const findByDniOrCode = (term) => {
    if (!term) return null;
    const t = String(term).trim();
    return (
      data.value.find(
        (item) =>
          (item.dni && item.dni === t) ||
          (item.certificate_code && item.certificate_code === t) ||
          (item.code && item.code === t)
      ) || null
    );
  };

  return { data, loading, error, fetchData, findByDniOrCode };
}
