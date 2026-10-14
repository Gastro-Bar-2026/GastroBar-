<script setup>
import { computed, ref } from 'vue'
import SiteNav from './SiteNav.vue'

const props = defineProps({ user: Object, reservations: { type: Array, default: () => [] } })
const emit = defineEmits(['navigate', 'logout'])
const filter = ref('Todas')
const visibleReservations = computed(() => filter.value === 'Todas'
  ? props.reservations
  : props.reservations.filter(item => item.status === filter.value))
const pendingCount = computed(() => props.reservations.filter(item => item.status === 'Pendiente').length)
const confirmedCount = computed(() => props.reservations.filter(item => item.status === 'Confirmada').length)
function setStatus(reservation, status) { reservation.status = status }
</script>

<template>
  <div class="admin-page">
    <SiteNav active="admin" authenticated :role="props.user?.role" @navigate="emit('navigate', $event)" @logout="emit('logout')" />
    <main class="admin-content">
      <p class="admin-eyebrow">GESTIÓN DEL RESTAURANTE</p>
      <h1>Panel de reservas</h1>
      <p class="admin-lead">Hola{{ props.user?.name ? ', ' + props.user.name : '' }}. Revisa y actualiza las solicitudes de reserva.</p>
      <section class="admin-stats" aria-label="Resumen de reservas">
        <article><span>Total</span><strong>{{ props.reservations.length }}</strong></article>
        <article><span>Pendientes</span><strong>{{ pendingCount }}</strong></article>
        <article><span>Confirmadas</span><strong>{{ confirmedCount }}</strong></article>
      </section>
      <section class="admin-reservation-panel">
        <div class="admin-panel-heading"><div><h2>Solicitudes</h2><p>Reservas registradas por los clientes</p></div>
          <label class="admin-filter">Estado
            <select v-model="filter"><option>Todas</option><option>Pendiente</option><option>Confirmada</option><option>Cancelada</option></select>
          </label>
        </div>
        <div v-if="!visibleReservations.length" class="admin-empty">No hay reservas en esta categoría todavía.</div>
        <div v-else class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>Cliente</th><th>Fecha</th><th>Hora</th><th>Personas</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody><tr v-for="reservation in visibleReservations" :key="reservation.id">
            <td><strong>{{ reservation.customer }}</strong><small>{{ reservation.email }}</small></td>
            <td>{{ reservation.date }}</td><td>{{ reservation.time }}</td><td>{{ reservation.guests }}</td>
            <td><span class="reservation-status" :class="reservation.status.toLowerCase()">{{ reservation.status }}</span></td>
            <td class="admin-actions"><button type="button" @click="setStatus(reservation, 'Confirmada')">Confirmar</button><button type="button" @click="setStatus(reservation, 'Cancelada')">Cancelar</button></td>
          </tr></tbody>
        </table></div>
      </section>
    </main>
  </div>
</template>