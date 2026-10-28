<script setup>
import { ref } from 'vue'
import './style.css'
import Home from './assets/views/Home.vue'
import Login from './assets/views/login.vue'
import Register from './assets/views/Register.vue'
import Menu from './assets/views/Menu.vue'
import Contact from './assets/views/Contact.vue'
import Reservations from './assets/views/Reservations.vue'
import AdminServicios from './assets/views/AdminServicios.vue'

const view = ref('home')
const authenticated = ref(false)
const currentUser = ref(null)
const afterLogin = ref('home')
const toast = ref(null)
let toastTimer = null
function showToast(message, type = 'success') {
  toast.value = { message, type }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}
const reservations = ref([])
try { const savedReservations = JSON.parse(localStorage.getItem('gastrobar-reservations') || '[]'); reservations.value = Array.isArray(savedReservations) ? savedReservations : [] } catch { reservations.value = [] }
const users = ref([])
try { const savedUsers = JSON.parse(localStorage.getItem('gastrobar-admin-users') || '[]'); users.value = Array.isArray(savedUsers) ? savedUsers.filter(account => account && (account.registered === true || account.correo || account.email)) : [] } catch { users.value = [] }

// Cuenta de administrador principal (siempre existe; solo ella accede al panel)
const ADMIN_CUENTA = {
  email: 'admin@gastrobar.com',
  correo: 'admin@gastrobar.com',
  name: 'Administrador GastroBar',
  nombre: 'Administrador GastroBar',
  rol: 'admin',
  estado: 'Activo',
  password: 'GastroBarAdmin#2026',
  role: 'admin',
  registered: true
}
if (!users.value.some(account => account.email === ADMIN_CUENTA.email)) {
  users.value.unshift(ADMIN_CUENTA)
  localStorage.setItem('gastrobar-admin-users', JSON.stringify(users.value))
}
// Refuerzo: si en la base quedó con otro rol, se corrige a admin
const adminGuardado = users.value.find(account => account.email === ADMIN_CUENTA.email)
if (adminGuardado && (adminGuardado.role !== 'admin' || adminGuardado.password !== ADMIN_CUENTA.password)) {
  Object.assign(adminGuardado, { role: 'admin', rol: 'admin', estado: 'Activo', password: ADMIN_CUENTA.password })
  localStorage.setItem('gastrobar-admin-users', JSON.stringify(users.value))
}
const menuServices = ref([
  { id: 1, nombre: 'Mojito de la casa', categoria: 'Cocteles', precio: 22000, ingredientes: ['Ron blanco', 'Hierbabuena', 'Lim\u00f3n', 'Soda'], foto: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=85', descripcion: 'Ron blanco, hierbabuena fresca y lim\u00f3n en una mezcla refrescante.' },
  { id: 2, nombre: 'Margarita cl\u00e1sica', categoria: 'Cocteles', precio: 26000, ingredientes: ['Tequila', 'Triple sec', 'Lim\u00f3n', 'Sal'], foto: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85', descripcion: 'Tequila y c\u00edtricos con un borde de sal, preparada al momento.' },
  { id: 3, nombre: 'Hamburguesa Gastrobar', categoria: 'Comidas', precio: 32000, ingredientes: ['Carne de res', 'Queso', 'Cebolla caramelizada', 'Pan artesanal'], foto: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85', descripcion: 'Carne a la parrilla con queso y cebolla caramelizada en pan artesanal.' },
  { id: 4, nombre: 'Tabla para compartir', categoria: 'Comidas', precio: 38000, ingredientes: ['Quesos', 'Embutidos', 'Aceitunas', 'Pan artesanal'], foto: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85', descripcion: 'Una selecci\u00f3n de quesos y embutidos para compartir en la mesa.' },
  { id: 5, nombre: 'Whisky de reserva', categoria: 'Botellas', precio: 180000, ingredientes: ['Whisky escoc\u00e9s'], foto: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=85', descripcion: 'Botella de whisky de reserva, servida con hielo si lo deseas.' },
  { id: 6, nombre: 'Limonada de coco', categoria: 'Cocteles', precio: 16000, ingredientes: ['Lim\u00f3n', 'Leche de coco', 'Az\u00facar', 'Hielo'], foto: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85', descripcion: 'Bebida cremosa de lim\u00f3n y coco, preparada con ingredientes frescos.' }
])

function openLogin(destination = 'home') {
  afterLogin.value = destination
  view.value = 'login'
}

function navigate(destination) {
  if (destination === 'admin-menu') {
    if (!authenticated.value || currentUser.value?.role !== 'admin') return openLogin('admin-menu')
    view.value = 'admin-menu'
    return
  }
  if (destination === 'login') return openLogin('home')
  if (destination === 'reservations' && !authenticated.value) return openLogin('reservations')
  if (destination === 'admin' && (!authenticated.value || currentUser.value?.role !== 'admin')) return openLogin('admin')
  view.value = destination
}

function authenticate(user) {
  // Doble verificación: la cuenta DEBE existir en la base de datos con su contraseña
  const cuenta = users.value.find(account => account.email === user.email)
  if (!user.registered) {
    if (!cuenta || cuenta.password !== user.password) {
      showToast('No se puede iniciar sesión: la cuenta no está registrada en la base de datos.', 'error')
      return openLogin('home')
    }
  }
  if (user.registered) {
    if (cuenta) {
      users.value[users.value.indexOf(cuenta)] = { ...cuenta, ...user, nombre: user.name || cuenta.nombre, correo: cuenta.correo || user.email }
    } else {
      users.value.push({
        id: Date.now(),
        email: user.email,
        correo: user.email,
        name: user.name,
        nombre: user.name,
        password: user.password,
        role: user.role,
        rol: user.role,
        estado: 'Activo',
        registered: true
      })
    }
    localStorage.setItem('gastrobar-admin-users', JSON.stringify(users.value))
  }
  authenticated.value = true
  currentUser.value = user
  view.value = user.role === 'admin' ? 'admin' : afterLogin.value
  showToast(user.registered ? 'Cuenta creada e inicio de sesión completado ✅' : 'Inicio de sesión completado ✅')
}

function registerUser(user) {
  const correo = user.email.trim().toLowerCase()
  const cuentaExistente = users.value.find(account => account.email === correo)
  if (cuentaExistente) {
    showToast('Ya existe una cuenta registrada con este correo. Inicia sesión.', 'error')
    return
  }
  authenticate({ ...user, registered: true })
}

function actualizarServicios(nuevos) {
  const previos = menuServices.value
  menuServices.value = nuevos
  const agregado = nuevos.find(item => !previos.some(p => p.id === item.id))
  if (agregado) { showToast(`Producto "${agregado.nombre}" agregado al menú ✅`); return }
  const eliminado = previos.find(item => !nuevos.some(n => n.id === item.id))
  if (eliminado) { showToast(`Producto "${eliminado.nombre}" eliminado del menú 🗑️`); return }
  const actualizado = nuevos.find(item => { const p = previos.find(x => x.id === item.id); return p && JSON.stringify(p) !== JSON.stringify(item) })
  if (actualizado) showToast(`Producto "${actualizado.nombre}" actualizado ✅`)
}

function actualizarUsuarios(nuevos) {
  const previos = users.value
  users.value = nuevos
  localStorage.setItem('gastrobar-admin-users', JSON.stringify(users.value))
  const agregado = nuevos.find(item => !previos.some(p => p.id === item.id))
  if (agregado) { showToast(`Usuario "${agregado.nombre || agregado.name}" agregado ✅`); return }
  const eliminado = previos.find(item => !nuevos.some(n => n.id === item.id))
  if (eliminado) { showToast(`Usuario "${eliminado.nombre || eliminado.name}" eliminado 🗑️`); return }
  const actualizado = nuevos.find(item => { const p = previos.find(x => x.id === item.id); return p && JSON.stringify(p) !== JSON.stringify(item) })
  if (actualizado) showToast(`Usuario "${actualizado.nombre || actualizado.name}" actualizado ✅`)
}

function logout() {
  authenticated.value = false
  currentUser.value = null
  view.value = 'home'
  showToast('Sesión cerrada correctamente 👋')
}

function createReservation(details) {
  reservations.value.unshift({
    id: Date.now(),
    customer: currentUser.value?.name || currentUser.value?.email || 'Cliente',
    email: currentUser.value?.email || '',
    ...details,
    status: 'Pendiente'
  })
  saveReservations()
  showToast('Reserva registrada correctamente ✅')
  view.value = 'home'
}

function saveReservations() {
  localStorage.setItem('gastrobar-reservations', JSON.stringify(reservations.value))
}

function updateReservations(nuevas) {
  reservations.value = nuevas
  saveReservations()
}

function setReservationStatus(reserva, estado) {
  if (reserva.status === 'Cancelada') {
    showToast('Una reserva cancelada no puede modificarse.', 'error')
    return
  }
  if (estado === 'Cancelada') {
    reservaACancelar.value = reserva
    return
  }
  updateReservations(reservations.value.map(item => item.id === reserva.id ? { ...item, status: estado } : item))
  showToast(`Reserva ${estado.toLowerCase()} correctamente ✅`)
}

function guardarEdicionReserva(datos) {
  if (reservaEditando.value.status === 'Cancelada') {
    showToast('Una reserva cancelada no puede editarse.', 'error')
    reservaEditando.value = null
    return
  }
  updateReservations(reservations.value.map(item => item.id === reservaEditando.value.id ? { ...item, ...datos } : item))
  showToast('Reserva actualizada y guardada ✅')
  reservaEditando.value = null
}

const reservaACancelar = ref(null)
const reservaEditando = ref(null)
const edicion = ref({ date: '', time: '19:00', guests: 2, notes: '' })
function editarReserva(reserva) {
  if (reserva.status === 'Cancelada') {
    showToast('Una reserva cancelada no puede editarse.', 'error')
    return
  }
  edicion.value = { date: reserva.date, time: reserva.time, guests: reserva.guests, notes: reserva.notes || '' }
  reservaEditando.value = reserva
}
function confirmarCancelacion() {
  if (!reservaACancelar.value) return
  updateReservations(reservations.value.map(item => item.id === reservaACancelar.value.id ? { ...item, status: 'Cancelada' } : item))
  showToast('Reserva cancelada correctamente ✅')
  reservaACancelar.value = null
}
</script>

<template>
  <Home v-if="view === 'home'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Login v-else-if="view === 'login'" :accounts="users" @authenticate="authenticate" @go-register="view = 'register'" @go-home="view = 'home'" />
  <Register v-else-if="view === 'register'" @register="registerUser" @go-login="openLogin('home')" @go-home="view = 'home'" />
  <Menu v-else-if="view === 'menu'" :authenticated="authenticated" :user="currentUser" :model-value="menuServices" @navigate="navigate" @logout="logout" />
  <AdminServicios
    v-else-if="view === 'admin-menu' || view === 'admin'"
    :initial-section="view === 'admin' ? 'reservas' : 'productos'"
    :model-value="menuServices"
    :reservations="reservations"
    :users="users"
    :user="currentUser"
    @update:model-value="actualizarServicios"
    @update:reservations="updateReservations"
    @confirm-reservation="setReservationStatus($event, 'Confirmada')"
    @cancel-reservation="setReservationStatus($event, 'Cancelada')"
    @edit-reservation="editarReserva"
    @update:users="actualizarUsuarios"
    @navigate="navigate"
    @logout="logout"
    @salir="view = 'menu'"
  />
  <Contact v-else-if="view === 'contact'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Reservations v-else-if="view === 'reservations'" :user="currentUser" :authenticated="authenticated" @navigate="navigate" @logout="logout" @submit-reservation="createReservation" />
  <transition name="toast-fade">
    <div v-if="toast" class="gb-toast" :class="toast.type" role="status">{{ toast.message }}</div>
  </transition>

  <div v-if="reservaACancelar" class="gb-capa-modal" @click.self="reservaACancelar = null">
    <section class="gb-confirmacion" role="alertdialog" aria-modal="true">
      <p class="gb-sobre-titulo">CONFIRMAR CANCELACIÓN</p>
      <h2>¿Cancelar esta reserva?</h2>
      <p>La reserva de <strong>{{ reservaACancelar.customer }}</strong> del <strong>{{ reservaACancelar.date }}</strong> a las <strong>{{ reservaACancelar.time }}</strong> quedará cancelada y <strong>ya no podrá modificarse</strong>.</p>
      <div class="gb-acciones">
        <button class="gb-btn-secundario" type="button" @click="reservaACancelar = null">Volver</button>
        <button class="gb-btn-peligro" type="button" @click="confirmarCancelacion">Sí, cancelar reserva</button>
      </div>
    </section>
  </div>

  <div v-if="reservaEditando" class="gb-capa-modal" @click.self="reservaEditando = null">
    <form class="gb-confirmacion gb-form" @submit.prevent="guardarEdicionReserva({ date: edicion.date, time: edicion.time, guests: Number(edicion.guests), notes: edicion.notes })">
      <p class="gb-sobre-titulo">EDITAR RESERVA</p>
      <h2>Editar datos de la reserva</h2>
      <p class="gb-cliente">{{ reservaEditando.customer }} · {{ reservaEditando.email }}</p>
      <div class="gb-campos">
        <label>Fecha<input v-model="edicion.date" type="date" required></label>
        <label>Hora<select v-model="edicion.time"><option>17:00</option><option>18:00</option><option>19:00</option><option>20:00</option><option>21:00</option><option>22:00</option></select></label>
        <label>Personas<input v-model="edicion.guests" type="number" min="1" max="20" required></label>
        <label class="gb-ancho">Notas<textarea v-model="edicion.notes" rows="2"></textarea></label>
      </div>
      <div class="gb-acciones">
        <button class="gb-btn-secundario" type="button" @click="reservaEditando = null">Cancelar</button>
        <button class="gb-btn-primario" type="submit">Guardar cambios</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.gb-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 14px 26px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .35);
}
.gb-toast.success { background: #1f8a4c; }
.gb-toast.error { background: #b3372f; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity .25s ease, transform .25s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

.gb-capa-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(8, 7, 11, .82);
  backdrop-filter: blur(4px);
}
.gb-confirmacion {
  width: min(480px, 100%);
  padding: 26px;
  border: 1px solid rgba(225, 186, 125, .2);
  border-radius: 10px;
  background: #141116;
  color: #f4efe8;
  box-shadow: 0 25px 80px rgba(0, 0, 0, .5);
}
.gb-confirmacion h2 { margin: 0; font: 500 24px 'Playfair Display', Georgia, serif; }
.gb-sobre-titulo { margin: 0 0 8px; color: #d7aa70; font-size: 10px; font-weight: 700; letter-spacing: 2px; }
.gb-confirmacion > p { margin: 12px 0 0; color: #c8c0b4; font-size: 13px; line-height: 1.7; }
.gb-cliente { color: #a79d92 !important; font-size: 11px !important; }
.gb-campos { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
.gb-campos label { display: grid; gap: 6px; color: #d8cfc3; font-size: 11px; font-weight: 600; }
.gb-campos input, .gb-campos select, .gb-campos textarea { padding: 10px; border: 1px solid rgba(255, 255, 255, .18); border-radius: 5px; background: #141116; color: #f4efe8; font: 400 12px 'Plus Jakarta Sans', sans-serif; }
.gb-ancho { grid-column: 1 / -1; }
.gb-acciones { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
.gb-btn-secundario { padding: 10px 14px; border: 1px solid rgba(255, 255, 255, .18); border-radius: 5px; background: transparent; color: #d6d0c8; font: 500 11px 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
.gb-btn-peligro { padding: 10px 14px; border: 1px solid #a63b3b; border-radius: 5px; background: #a63b3b; color: #fff; font: 600 11px 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
.gb-btn-primario { padding: 10px 14px; border: 1px solid #d7aa70; border-radius: 5px; background: #d7aa70; color: #211b13; font: 600 11px 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
</style>
