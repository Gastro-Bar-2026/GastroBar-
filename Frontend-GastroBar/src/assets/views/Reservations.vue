<script setup>
import { computed, ref } from 'vue'
import { api } from '../../api.js'
import SiteNav from './SiteNav.vue'

const props = defineProps({
  authenticated: Boolean,
  user: Object,
  services: { type: Array, default: () => [] }
})
const emit = defineEmits(['navigate', 'logout'])
const date = ref('')
const time = ref('19:00')
const guests = ref(2)
const notes = ref('')
const error = ref('')
const success = ref(false)
const busy = ref(false)
const today = new Date()
const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const availableServices = computed(() => props.services.filter(service => service.disponible))
const reservationService = computed(() => availableServices.value.find(service => service.categoria === 'Reserva de Mesa'))
const times = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

function resetForm() {
  date.value = ''
  time.value = '19:00'
  guests.value = 2
  notes.value = ''
  error.value = ''
}

async function submit() {
  error.value = ''
  if (!props.authenticated) { emit('navigate', 'reservations'); return }
  if (!date.value) { error.value = 'Selecciona una fecha para tu reserva.'; return }
  if (!reservationService.value) {
    error.value = 'No se encontró el servicio de reserva de mesa. Inténtalo más tarde.'
    return
  }

  const fecha = new Date(`${date.value}T${time.value}:00`)
  if (Number.isNaN(fecha.getTime()) || fecha <= new Date()) {
    error.value = 'Selecciona una fecha y hora futuras.'
    return
  }

  busy.value = true
  try {
    await api.createReservation({
      servicio: reservationService.value._id,
      fecha: fecha.toISOString(),
      numeroPersonas: Number(guests.value),
      notas: notes.value.trim()
    })
    success.value = true
    resetForm()
    setTimeout(() => {
      success.value = false
    }, 5000)
  } catch (cause) {
    error.value = cause.message
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <div class="reservation-page">
    <SiteNav active="reservations" :authenticated="props.authenticated" :role="props.user?.role" @navigate="emit('navigate', $event)" @logout="emit('logout')" />
    <main class="reservation-content">
      <p class="admin-eyebrow">GASTROBAR · RESERVAS</p><h1>Reserva tu mesa</h1>
      <p class="admin-lead">Elige el día y la hora. Nuestro equipo revisará tu solicitud.</p>
      <div v-if="success" class="reservation-success" role="alert">
        Tu reserva quedó registrada correctamente y aparece como <strong>confirmada</strong> en el sistema.
      </div>
      <form v-else class="reservation-form" @submit.prevent="submit">
        <label>Fecha<input v-model="date" type="date" :min="minDate" required></label>
        <label>Hora<select v-model="time" required><option v-for="slot in times" :key="slot" :value="slot">{{ slot }}</option></select></label>
        <label>Personas<input v-model.number="guests" type="number" min="1" max="20" required></label>
        <label class="reservation-notes">Notas para el restaurante<textarea v-model="notes" rows="3" placeholder="Ocasión especial, preferencias…"></textarea></label>
        <p v-if="error" class="reservation-error" role="alert">{{ error }}</p>
        <button class="veloris-btn-reserve-pill" type="submit" :disabled="busy">{{ busy ? 'Enviando…' : 'Enviar solicitud' }}</button>
      </form>
    </main>
  </div>
</template>