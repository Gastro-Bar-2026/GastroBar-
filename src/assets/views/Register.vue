<script setup>
import { ref } from 'vue'
const emit = defineEmits(['authenticate', 'go-login', 'go-home'])
const name = ref('')
const email = ref('')
const password = ref('')
const confirmation = ref('')
const error = ref('')
const busy = ref(false)
function submit() {
  error.value = ''
  if (!name.value.trim()) { error.value = 'Escribe tu nombre completo.'; return }
  if (!email.value.trim() || !email.value.includes('@')) { error.value = 'Escribe un correo electrónico válido.'; return }
  if (password.value.length < 6) { error.value = 'La contraseña debe tener al menos 6 caracteres.'; return }
  if (password.value !== confirmation.value) { error.value = 'Las contraseñas no coinciden.'; return }
  busy.value = true
  setTimeout(() => {
    emit('authenticate', { email: email.value.trim().toLowerCase(), name: name.value.trim(), role: 'customer' })
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
      <header class="veloris-auth-titles"><h1 class="veloris-auth-heading">Crea tu cuenta</h1><p class="veloris-auth-subtext">Únete a nuestro salón culinario</p></header>
      <div class="veloris-auth-divider-line"></div>
      <div v-if="error" class="veloris-auth-alert error" role="alert">{{ error }}</div>
      <form class="veloris-auth-form" @submit.prevent="submit">
        <label class="veloris-input-group"><span class="veloris-input-label">Nombre completo</span><input v-model="name" class="veloris-input-field" type="text" autocomplete="name" placeholder="Tu nombre" required></label>
        <label class="veloris-input-group"><span class="veloris-input-label">Correo electrónico</span><input v-model="email" class="veloris-input-field" type="email" autocomplete="email" placeholder="tu@correo.com" required></label>
        <label class="veloris-input-group"><span class="veloris-input-label">Contraseña</span><input v-model="password" class="veloris-input-field" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres" required></label>
        <label class="veloris-input-group"><span class="veloris-input-label">Confirmar contraseña</span><input v-model="confirmation" class="veloris-input-field" type="password" autocomplete="new-password" required></label>
        <button class="veloris-btn-gold-submit" type="submit" :disabled="busy">{{ busy ? 'PROCESANDO…' : 'CREAR CUENTA' }}</button>
      </form>
      <p class="auth-switch-copy">¿Ya tienes cuenta? <button class="veloris-toggle-action" type="button" @click="emit('go-login')">Iniciar sesión</button></p>
    </section>
  </main>
</template>