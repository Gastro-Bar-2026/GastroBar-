<!-- App.vue -->
<script setup>
import './style.css'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Menu from './assets/views/Menu.vue'
import Login from './assets/views/login.vue'

const isAuthenticated = ref(false)
const showMenu = ref(false)

function handleAuthenticate() {
  isAuthenticated.value = true
  showMenu.value = false
}

function handleReserve() {
  const el = document.getElementById('reservas') || document.getElementById('menu')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleNosotros() {
  const section = document.getElementById('sobre-nosotros')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function handleMenuNosotros() {
  showMenu.value = false
  await nextTick()
  handleNosotros()
}

const drinks = ref([
  {
    id: 1,
    name: 'BOGEMA BAR',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 2,
    name: 'NEGRONI NEBULA',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 3,
    name: 'GOLDEN AURA',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 4,
    name: 'OBSIDIAN VELVET',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 5,
    name: 'NOCTURNE PRIVÉ',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=85'
  }
])

const activeIndex = ref(0)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
let timer = null

const currentDrink = computed(() => drinks.value[activeIndex.value])

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % drinks.value.length
}

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + drinks.value.length) % drinks.value.length
}

const selectDrink = (index) => {
  activeIndex.value = index
}

const startAutoplay = () => {
  stopAutoplay()
  timer = setInterval(() => {
    next()
  }, 3500)
}

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Posicionamiento horizontal fluido relativo (%) en perspectiva 3D
const getCardTransform = (index) => {
  const total = drinks.value.length
  let offset = (index - activeIndex.value) % total
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  const isMobile = windowWidth.value < 768

  if (offset === 0) {
    return {
      transform: 'translate(-50%, -50%) translateX(0%) scale(1) perspective(1400px) rotateY(0deg)',
      opacity: 1,
      zIndex: 30,
      visibility: 'visible',
      pointerEvents: 'auto'
    }
  }

  // En celulares (< 768px), ocultar extremos y solapar suavemente las adyacentes
  if (isMobile) {
    if (Math.abs(offset) >= 2) {
      return {
        transform: `translate(-50%, -50%) translateX(${offset * 120}%) scale(0.4)`,
        opacity: 0,
        zIndex: 1,
        visibility: 'hidden',
        pointerEvents: 'none'
      }
    }
    const dir = offset > 0 ? 1 : -1
    return {
      transform: `translate(-50%, -50%) translateX(${dir * 88}%) scale(0.72) perspective(1000px) rotateY(${dir * -14}deg)`,
      opacity: 0.28,
      zIndex: 15,
      visibility: 'visible',
      pointerEvents: 'auto'
    }
  }

  // Escritorio / Monitores grandes (desplazamiento fluido en porcentajes)
  if (offset === -1) {
    return {
      transform: 'translate(-50%, -50%) translateX(-95%) scale(0.78) perspective(1400px) rotateY(16deg)',
      opacity: 0.45,
      zIndex: 20,
      visibility: 'visible',
      pointerEvents: 'auto'
    }
  }
  if (offset === 1) {
    return {
      transform: 'translate(-50%, -50%) translateX(95%) scale(0.78) perspective(1400px) rotateY(-16deg)',
      opacity: 0.45,
      zIndex: 20,
      visibility: 'visible',
      pointerEvents: 'auto'
    }
  }
  if (offset <= -2) {
    return {
      transform: 'translate(-50%, -50%) translateX(-175%) scale(0.6) perspective(1400px) rotateY(26deg)',
      opacity: 0.22,
      zIndex: 10,
      visibility: 'visible',
      pointerEvents: 'auto'
    }
  }
  if (offset >= 2) {
    return {
      transform: 'translate(-50%, -50%) translateX(175%) scale(0.6) perspective(1400px) rotateY(-26deg)',
      opacity: 0.22,
      zIndex: 10,
      visibility: 'visible',
      pointerEvents: 'auto'
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
  stopAutoplay()
})
</script>

<template>
  <Login v-if="!isAuthenticated" @authenticate="handleAuthenticate" />

  <Menu
    v-else-if="showMenu"
    @go-home="showMenu = false"
    @go-home-nosotros="handleMenuNosotros"
  />

  <div v-else class="gastrobar-universe">
    <!-- Luces de neón difusas (glows) ambientales -->
    <div class="ambient-glow glow-red"></div>
    <div class="ambient-glow glow-purple"></div>
    <div class="stars-texture"></div>

    <!-- Resplandores prismáticos celestiales -->
    <div class="holographic-aura aura-top-left"></div>
    <div class="holographic-aura aura-bottom-right"></div>
    <div class="light-ray"></div>

    <!-- Header / Navbar Superior -->
    <header class="navbar">
      <div class="logo">
        <span class="logo-text">GASTROBAR</span>
      </div>

      <nav class="nav-links">
        <button type="button" class="nav-item home-link active" @click="showMenu = false">Inicio</button>
        <a href="#menu" class="nav-item active" @click.prevent="showMenu = true">Menú</a>
        <a href="#interior" class="nav-item">Interior</a>
        <button type="button" class="nav-item home-link" @click="handleNosotros">Nosotros</button>
        <a href="#contactos" class="nav-item">Contactos</a>
      </nav>
    </header>

    <!-- Contenedor Principal Amplio del Carrusel -->
    <main
      class="carousel-wrapper"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
    >
      <div class="carousel-stage">
        <div
          v-for="(drink, index) in drinks"
          :key="drink.id"
          class="capsule-card"
          :class="{ 'is-active': index === activeIndex }"
          :style="getCardTransform(index)"
          @click="selectDrink(index)"
        >
          <!-- Contenedor Cápsula Oval Fluida -->
          <div class="capsule-frame">
            <img :src="drink.image" :alt="drink.name" class="capsule-img" />
            <div class="capsule-overlay"></div>
            <div class="capsule-rim-glow"></div>
          </div>

          <!-- Tipografía BOGEMA Style superpuesta en el centro y sobresaliendo horizontalmente -->
          <div v-if="index === activeIndex" class="overflow-title-container">
            <h1 class="high-fashion-title">
              {{ currentDrink.name }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Botones circulares translúcidos (< y >) bajo la cápsula central -->
      <div class="carousel-controls">
        <button
          type="button"
          class="control-btn prev"
          aria-label="Anterior"
          @click.stop="prev"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          type="button"
          class="control-btn next"
          aria-label="Siguiente"
          @click.stop="next"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </main>

    <!-- Footer Fluido: Descripción y Botón Reserva -->
    <footer class="footer-bar">
      <div class="footer-left">
        <p class="drink-description">
          {{ currentDrink.description }}
        </p>
      </div>

      <div class="footer-right">
        <button type="button" class="reservation-btn">
          <span>Reserva</span>
          <span class="star-icon">✶</span>
        </button>
      </div>
    </footer>
  </div>

  <section v-if="!showMenu" id="sobre-nosotros" class="veloris-editorial-section">
    <div class="veloris-editorial-card">
      <!-- Lado Izquierdo: Composición de Fotos Superpuestas -->
      <div class="veloris-editorial-gallery">
        <!-- Foto Principal: Bartender preparando cóctel en la barra -->
        <div class="veloris-photo-primary-frame">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop"
            alt="Bartender preparando cóctel artesanal en la barra"
            class="veloris-photo-img"
            loading="lazy"
          />
          <div class="veloris-photo-ambient-warmth"></div>
        </div>

        <!-- Foto Secundaria Superpuesta: Mesa con copas de vino y comida -->
        <div class="veloris-photo-secondary-frame">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop"
            alt="Mesa de mármol con platillos para compartir y copas de vino"
            class="veloris-photo-img"
            loading="lazy"
          />
          <div class="veloris-photo-rim-accent"></div>
        </div>
      </div>

      <!-- Lado Derecho: Contenido Editorial "Sobre Nosotros" -->
      <div class="veloris-editorial-content">
        <!-- Título que mezcla Serif clásico y Cursiva -->
        <h2 class="veloris-editorial-title">
          <span class="veloris-title-row-1">
            <span class="serif-bold">SABORES</span>
            <span class="script-italic">de temporada</span>
          </span>
          <span class="veloris-title-row-2">
            <span class="serif-italic">hechos para</span>
            <span class="serif-bold uppercase">COMPARTIR</span>
          </span>
        </h2>

        <!-- Subtítulo -->
        <div class="veloris-editorial-tagline">
          SABORES DE AUTOR CREADOS PARA COMPARTIR
        </div>

        <!-- Texto Descriptivo "Sobre Nosotros" -->
        <p class="veloris-editorial-body">
          Nos enfocamos en cócteles de autor meticulosamente elaborados y platillos
          selectos que dialogan con naturalidad. Ingredientes de temporada, combinaciones
          inesperadas y una propuesta gastronómica concebida para degustarse sin prisa.
        </p>

        <!-- Cita de ambiente -->
        <p class="veloris-editorial-quote">
          Ya sea para disfrutar de una copa o quedarse a compartir toda la velada.
          <br />
          <span class="veloris-quote-sub">
            (Ya sea para disfrutar de una copa al caer la tarde o quedarse a compartir toda la velada.)
          </span>
        </p>

        <!-- Botón de Reserva -->
        <div class="veloris-editorial-actions">
          <button
            type="button"
            class="veloris-btn-reserve-pill"
            @click="handleReserve"
          >
            <span>RESERVAR UNA MESA</span>
          </button>
        </div>

        <!-- Distintivos del bar -->
        <div class="veloris-editorial-badges">
          <div class="veloris-badge-item">
            <span class="veloris-badge-dot"></span>
            <span>Coctelería de Colección</span>
          </div>
          <div class="veloris-badge-item">
            <span class="veloris-badge-dot"></span>
            <span>Cocina & Tapas de Temporada</span>
          </div>
          <div class="veloris-badge-item">
            <span class="veloris-badge-dot"></span>
            <span>Ambiente Íntimo & Luz Tenue</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>