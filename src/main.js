import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 🧩 Importar Toastr
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

// ⚙️ Configurar Toastr globalmente (opcional pero recomendado)
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  timeOut: 2000,
  preventDuplicates: false, // ✅ permite mostrar varias veces
  newestOnTop: false,       // ✅ los nuevos van debajo
}

// 🚀 Crear app Vue
const app = createApp(App)

// 🔗 Inyectar Toastr globalmente (para poder usar this.$toastr)
app.config.globalProperties.$toastr = toastr

app.use(router)

app.mount('#app')
