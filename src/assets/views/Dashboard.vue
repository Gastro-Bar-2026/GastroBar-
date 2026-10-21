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

<style>
.admin-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:28px 0}
.admin-stats article,.admin-reservation-panel{border:1px solid rgba(225,186,125,.18);border-radius:14px;background:rgba(255,255,255,.035)}
.admin-stats article{display:flex;flex-direction:column;gap:8px;padding:22px}
.admin-stats article span,.admin-panel-heading p{color:#a79d92;font-size:12px}
.admin-stats article strong{color:#e2b878;font:500 32px 'Playfair Display',Georgia,serif}
.admin-reservation-panel{padding:24px;overflow:hidden}
.admin-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}
.admin-panel-heading h2{margin:0 0 6px;font:500 22px 'Playfair Display',Georgia,serif}
.admin-panel-heading p{margin:0}
.admin-filter{display:flex;align-items:center;gap:10px;color:#bdb4a9;font-size:12px}
.admin-table-wrap{overflow-x:auto}
.admin-table{width:100%;border-collapse:collapse;text-align:left;font-size:13px}
.admin-table th{padding:12px;color:#d4a867;font:700 10px 'Montserrat',sans-serif;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #ffffff20}
.admin-table td{padding:15px 12px;border-bottom:1px solid #ffffff12;color:#d6d0c8}
.admin-table td small{display:block;margin-top:5px;color:#918981}
.reservation-status{display:inline-block;padding:5px 9px;border-radius:20px;background:#c4883830;color:#f0c985;font-size:11px}
.reservation-status.confirmada{background:#2b8b6230;color:#8ce0b5}.reservation-status.cancelada{background:#a63b3b30;color:#f3a2a2}
.admin-actions{white-space:nowrap}.admin-actions button{margin-right:7px;border:0;background:transparent;color:#e5bb7b;cursor:pointer;font:inherit;font-size:12px}
.admin-empty{padding:44px 12px;text-align:center;color:#a79d92;font-size:14px}
@media(max-width:700px){.admin-stats{grid-template-columns:1fr}.admin-panel-heading{align-items:flex-start;flex-direction:column}}
</style>
