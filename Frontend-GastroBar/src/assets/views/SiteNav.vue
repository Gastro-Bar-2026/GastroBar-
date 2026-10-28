<script setup>
defineProps({
  active: { type: String, default: 'home' },
  authenticated: { type: Boolean, default: false },
  role: { type: String, default: 'customer' }
})
const emit = defineEmits(['navigate', 'logout'])
</script>

<template>
  <header class="navbar site-navbar">
    <button type="button" class="site-brand" aria-label="Ir al inicio" @click="emit('navigate', 'home')">
      <span class="logo-text">GASTROBAR</span>
    </button>
    <nav class="nav-links" aria-label="Navegación principal">
      <button type="button" class="nav-item" :class="{ active: active === 'home' }" @click="emit('navigate', 'home')">Inicio</button>
      <button type="button" class="nav-item" :class="{ active: active === 'menu' }" @click="emit('navigate', 'menu')">Menú</button>
      <button type="button" class="nav-item" :class="{ active: active === 'contact' }" @click="emit('navigate', 'contact')">Contacto</button>
      <button type="button" class="nav-item" :class="{ active: active === 'reservations' }" @click="emit('navigate', 'reservations')">Reservar</button>
      <button v-if="role === 'admin'" type="button" class="nav-item" :class="{ active: active === 'admin' }" @click="emit('navigate', 'admin')">Administración</button>
      <button v-if="authenticated" type="button" class="nav-item" @click="emit('logout')">Cerrar sesión</button>
      <button v-else type="button" class="nav-item" :class="{ active: active === 'login' }" @click="emit('navigate', 'login')">Iniciar sesión</button>
    </nav>
  </header>
</template>
