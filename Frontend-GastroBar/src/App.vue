<script setup>
import { onMounted, ref } from 'vue'
import './style.css'
import { api, clearSession, saveSession } from './api.js'
import Home from './assets/views/Home.vue'
import Login from './assets/views/login.vue'
import Register from './assets/views/Register.vue'
import Menu from './assets/views/Menu.vue'
import Contact from './assets/views/Contact.vue'
import Reservations from './assets/views/Reservations.vue'
import Dashboard from './assets/views/Dashboard.vue'

const view = ref('home')
const authenticated = ref(false)
const currentUser = ref(null)
const afterLogin = ref('home')
const services = ref([])
const catalogError = ref('')
const flashMessage = ref('')
const flashTimer = ref(null)

function showFlash(message) {
  flashMessage.value = message
  localStorage.setItem('gastrobar-flash', message)
  if (flashTimer.value) {
    clearTimeout(flashTimer.value)
  }
  flashTimer.value = setTimeout(() => clearFlash(), 5000)
}

function clearFlash() {
  flashMessage.value = ''
  localStorage.removeItem('gastrobar-flash')
  if (flashTimer.value) {
    clearTimeout(flashTimer.value)
    flashTimer.value = null
  }
}

onMounted(async () => {
  const savedFlash = localStorage.getItem('gastrobar-flash')
  if (savedFlash) {
    flashMessage.value = savedFlash
    setTimeout(() => clearFlash(), 5000)
  }

  try {
    services.value = await api.getServices()
  } catch (error) {
    catalogError.value = error.message
  }

  const token = localStorage.getItem('gastrobar-token')
  let savedUser
  try {
    savedUser = JSON.parse(localStorage.getItem('gastrobar-user') || 'null')
  } catch {
    clearSession()
  }
  if (!token || !savedUser?.id) return

  try {
    const account = await api.getUser(savedUser.id)
    currentUser.value = mapUser(account)
    authenticated.value = true
  } catch (error) {
    if (error.status === 401 || error.status === 403 || error.status === 404) {
      clearSession()
      return
    }
    currentUser.value = mapUser(savedUser)
    authenticated.value = true
  }
})

function mapUser(user) {
  return {
    id: user.id || user._id,
    email: user.correo,
    name: user.nombre,
    role: user.rol === 'admin' ? 'admin' : 'customer'
  }
}

function openLogin(destination = 'home') {
  afterLogin.value = destination
  view.value = 'login'
}

async function navigate(destination) {
  if (destination === 'login') return openLogin('home')
  if (destination === 'reservations' && !authenticated.value) return openLogin('reservations')
  if (destination === 'admin' && (!authenticated.value || currentUser.value?.role !== 'admin')) return openLogin('admin')
  view.value = destination
  if (destination === 'menu' || destination === 'reservations') {
    try {
      services.value = await api.getServices()
      catalogError.value = ''
    } catch (error) {
      catalogError.value = error.message
    }
  }
}

function authenticate(response) {
  const user = mapUser(response.usuario)
  saveSession(response.token, user)
  authenticated.value = true
  currentUser.value = user

  const loginMessage = user.role === 'admin'
    ? 'Inicio de sesión exitoso. El acceso quedó registrado en la base de datos.'
    : 'Inicio de sesión exitoso. Tus datos quedaron guardados correctamente.'

  showFlash(loginMessage)

  view.value = user.role === 'admin'
    ? 'admin'
    : afterLogin.value === 'admin'
      ? 'home'
      : afterLogin.value
}

function logout() {
  clearSession()
  showFlash('Se cerró la sesión correctamente.')
  authenticated.value = false
  currentUser.value = null
  view.value = 'home'
}
</script>

<template>
  <Home v-if="view === 'home'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Login v-else-if="view === 'login'" @authenticate="authenticate" @go-register="view = 'register'" @go-home="view = 'home'" />
  <Register v-else-if="view === 'register'" @authenticate="authenticate" @go-login="openLogin('home')" @go-home="view = 'home'" />
  <Menu v-else-if="view === 'menu'" :authenticated="authenticated" :user="currentUser" :services="services" :catalog-error="catalogError" @navigate="navigate" @logout="logout" />
  <Contact v-else-if="view === 'contact'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Reservations v-else-if="view === 'reservations'" :user="currentUser" :authenticated="authenticated" :services="services" :catalog-error="catalogError" @navigate="navigate" @logout="logout" />
  <Dashboard v-else-if="view === 'admin'" :user="currentUser" @logout="logout" />
  <div v-if="flashMessage" class="veloris-auth-alert info" role="alert">{{ flashMessage }}</div>
</template>
