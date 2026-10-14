<script setup>
import { ref } from 'vue'
import './style.css'
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
const reservations = ref([])

function openLogin(destination = 'home') {
  afterLogin.value = destination
  view.value = 'login'
}

function navigate(destination) {
  if (destination === 'login') return openLogin('home')
  if (destination === 'reservations' && !authenticated.value) return openLogin('reservations')
  if (destination === 'admin' && (!authenticated.value || currentUser.value?.role !== 'admin')) return openLogin('admin')
  view.value = destination
}

function authenticate(user) {
  authenticated.value = true
  currentUser.value = user
  view.value = afterLogin.value
}

function logout() {
  authenticated.value = false
  currentUser.value = null
  view.value = 'home'
}

function createReservation(details) {
  reservations.value.unshift({
    id: Date.now(),
    customer: currentUser.value?.name || currentUser.value?.email || 'Cliente',
    email: currentUser.value?.email || '',
    ...details,
    status: 'Pendiente'
  })
  view.value = 'home'
}
</script>

<template>
  <Home v-if="view === 'home'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Login v-else-if="view === 'login'" @authenticate="authenticate" @go-register="view = 'register'" @go-home="view = 'home'" />
  <Register v-else-if="view === 'register'" @authenticate="authenticate" @go-login="openLogin('home')" @go-home="view = 'home'" />
  <Menu v-else-if="view === 'menu'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Contact v-else-if="view === 'contact'" :authenticated="authenticated" :user="currentUser" @navigate="navigate" @logout="logout" />
  <Reservations v-else-if="view === 'reservations'" :user="currentUser" :authenticated="authenticated" @navigate="navigate" @logout="logout" @submit-reservation="createReservation" />
  <Dashboard v-else-if="view === 'admin'" :user="currentUser" :reservations="reservations" @navigate="navigate" @logout="logout" />
</template>
