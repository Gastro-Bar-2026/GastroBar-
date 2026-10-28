<script setup>
import { ref } from 'vue'
import SiteNav from './SiteNav.vue'

const props = defineProps({ authenticated: Boolean, user: Object })
const emit = defineEmits(['navigate', 'logout', 'submit-reservation'])
const date = ref('')
const time = ref('19:00')
const guests = ref(2)
const notes = ref('')
const error = ref('')
const success = ref(false)
const today = new Date()
const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
function submit() {
  error.value = ''
  if (!props.authenticated) { emit('navigate', 'reservations'); return }
  if (!date.value) { error.value = 'Selecciona una fecha para tu reserva.'; return }
  emit('submit-reservation', { date: date.value, time: time.value, guests: Number(guests.value), notes: notes.value })
  success.value = true
}
</script>
<template>
  <div class="reservation-page">
    <SiteNav active="reservations" :authenticated="props.authenticated" :role="props.user?.role" @navigate="emit('navigate', $event)" @logout="emit('logout')" />
    <main class="reservation-content">
      <p class="admin-eyebrow">GASTROBAR · RESERVAS</p><h1>Reserva tu mesa</h1>
      <p class="admin-lead">Elige el día y la hora. Nuestro equipo revisará tu solicitud.</p>
      <div v-if="success" class="reservation-success">Tu solicitud quedó registrada. ¡Te esperamos!</div>
      <form v-else class="reservation-form" @submit.prevent="submit">
        <label>Fecha<input v-model="date" type="date" :min="minDate" required></label>
        <label>Hora<select v-model="time"><option>17:00</option><option>18:00</option><option>19:00</option><option>20:00</option><option>21:00</option><option>22:00</option></select></label>
        <label>Personas<input v-model.number="guests" type="number" min="1" max="20" required></label>
        <label class="reservation-notes">Notas para el restaurante<textarea v-model="notes" rows="3" placeholder="Ocasión especial, preferencias…"></textarea></label>
        <p v-if="error" class="reservation-error">{{ error }}</p>
        <button class="veloris-btn-reserve-pill" type="submit">Enviar solicitud</button>
      </form>
    </main>
  </div>
</template>