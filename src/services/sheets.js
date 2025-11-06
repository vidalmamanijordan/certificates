// src/services/sheets.js
import axios from "axios";

// URL pública de tu hoja de Google Sheets
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJc6NfubqnGFtVZlsS6EbHCSPi63UPc43Pni5BmTLZU6DJa2dGyi0rlsxD8HAHVFRBwRQM4TEnC_fj/pub?output=csv";

export const getCertificatesByInput = async (input) => {
  try {
    const response = await axios.get(SHEET_URL);
    const csvData = response.data;

    // Convertir CSV → arreglo de objetos
    const rows = csvData
      .split("\n")
      .map((r) => r.split(","))
      .filter((r) => r.length > 1);

    const headers = rows[0].map((h) => h.trim());
    const data = rows.slice(1).map((r) => {
      const obj = {};
      headers.forEach((key, i) => (obj[key] = r[i]?.trim()));
      return obj;
    });

    // Filtro por DNI o Código (en caso de que el usuario ingrese letras o números)
    const searchValue = String(input).trim();

    const certificados = data.filter(
      (item) =>
        item.dni === searchValue || item.code === searchValue
    );

    return certificados;
  } catch (error) {
    console.error("Error al obtener certificados:", error);
    throw error;
  }
};
