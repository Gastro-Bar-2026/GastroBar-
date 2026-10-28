<script setup>
import { ref } from 'vue'
const emit = defineEmits(['authenticate', 'go-register', 'go-home'])
const email = ref('')
const password = ref('')
const visiblePassword = ref(false)
const error = ref('')
const busy = ref(false)
function submit() {
  error.value = ''
  if (!email.value.trim() || !email.value.includes('@')) { error.value = 'Escribe un correo electrónico válido.'; return }
  if (!password.value) { error.value = 'Escribe tu contraseña.'; return }
  busy.value = true
  setTimeout(() => {
    const normalizedEmail = email.value.trim().toLowerCase()
    emit('authenticate', {
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: normalizedEmail.startsWith('admin@') ? 'admin' : 'customer'
    })
    busy.value = false
  }, 300)
}
</script>
<template>
  <main class="veloris-auth-viewport">
    <div class="veloris-auth-ambient-ray"></div><div class="veloris-auth-dust-overlay"></div><div class="veloris-auth-halo-gold"></div>
    <section class="veloris-auth-container">
      <button class="auth-back-link" type="button" @click="emit('go-home')">← Volver al inicio</button>
      <div class="veloris-auth-eyebrow">GASTROBAR</div>
      <header class="veloris-auth-titles"><h1 class="veloris-auth-heading">Bienvenido</h1><p class="veloris-auth-subtext">Inicia sesión para continuar</p></header>
      <div class="veloris-auth-divider-line"></div>
      <div v-if="error" class="veloris-auth-alert error" role="alert">{{ error }}</div>
      <form class="veloris-auth-form" @submit.prevent="submit">
        <label class="veloris-input-group"><span class="veloris-input-label">Correo electrónico</span><input v-model="email" class="veloris-input-field" type="email" autocomplete="email" placeholder="tu@correo.com" required></label>
        <label class="veloris-input-group"><span class="veloris-input-label">Contraseña</span><span class="veloris-input-wrapper"><input v-model="password" class="veloris-input-field" :type="visiblePassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Tu contraseña" required><button class="veloris-input-action-btn" type="button" @click="visiblePassword = !visiblePassword">{{ visiblePassword ? 'Ocultar' : 'Ver' }}</button></span></label>
        <button class="veloris-btn-gold-submit" type="submit" :disabled="busy">{{ busy ? 'PROCESANDO…' : 'INICIAR SESIÓN' }}</button>
      </form>
      <p class="auth-switch-copy">¿No tienes cuenta? <button class="veloris-toggle-action" type="button" @click="emit('go-register')">Crear cuenta</button></p>
      <p class="auth-demo-note">Demostración del panel: inicia con un correo que comience por <strong>admin@</strong>.</p>
    </section>
  </main>
</template>