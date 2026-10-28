<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SiteNav from './SiteNav.vue'

const props = defineProps({ authenticated: Boolean, user: Object })
const emit = defineEmits(['navigate', 'logout'])
const drinks = ref([
  { id: 1, name: 'BOGEMA BAR', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85', description: 'Cócteles de autor preparados para disfrutar sin prisa.' },
  { id: 2, name: 'NEGRONI NEBULA', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85', description: 'Una mezcla intensa, equilibrada y memorable.' },
  { id: 3, name: 'GOLDEN AURA', image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=85', description: 'Notas cálidas para acompañar una buena conversación.' },
  { id: 4, name: 'OBSIDIAN VELVET', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=85', description: 'Una experiencia suave con carácter propio.' },
  { id: 5, name: 'NOCTURNE PRIVÉ', image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=85', description: 'El sabor perfecto para cerrar la noche.' }
])
const activeIndex = ref(0)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const currentDrink = computed(() => drinks.value[activeIndex.value])
let timer = null

function updateWindowWidth() { windowWidth.value = window.innerWidth }
function next() { activeIndex.value = (activeIndex.value + 1) % drinks.value.length }
function prev() { activeIndex.value = (activeIndex.value - 1 + drinks.value.length) % drinks.value.length }
function selectDrink(index) { activeIndex.value = index }
function stopAutoplay() { if (timer) { clearInterval(timer); timer = null } }
function startAutoplay() { stopAutoplay(); timer = setInterval(next, 3500) }

function getCardTransform(index) {
  const total = drinks.value.length
  let offset = (index - activeIndex.value) % total
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total
  const mobile = windowWidth.value < 768

  if (offset === 0) return {
    transform: 'translate(-50%, -50%) translateX(0%) scale(1) perspective(1400px) rotateY(0deg)',
    opacity: 1, zIndex: 30, visibility: 'visible', pointerEvents: 'auto'
  }
  if (mobile) {
    if (Math.abs(offset) >= 2) return {
      transform: `translate(-50%, -50%) translateX(${offset * 120}%) scale(0.4)`,
      opacity: 0, zIndex: 1, visibility: 'hidden', pointerEvents: 'none'
    }
    const direction = offset > 0 ? 1 : -1
    return {
      transform: `translate(-50%, -50%) translateX(${direction * 88}%) scale(0.72) perspective(1000px) rotateY(${direction * -14}deg)`,
      opacity: 0.28, zIndex: 15, visibility: 'visible', pointerEvents: 'auto'
    }
  }
  if (Math.abs(offset) === 1) {
    const direction = Math.sign(offset)
    return {
      transform: `translate(-50%, -50%) translateX(${direction * 95}%) scale(0.78) perspective(1400px) rotateY(${direction * -16}deg)`,
      opacity: 0.45, zIndex: 20, visibility: 'visible', pointerEvents: 'auto'
    }
  }
  const direction = Math.sign(offset)
  return {
    transform: `translate(-50%, -50%) translateX(${direction * 175}%) scale(0.6) perspective(1400px) rotateY(${direction * -26}deg)`,
    opacity: 0.22, zIndex: 10, visibility: 'visible', pointerEvents: 'auto'
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
  <div class="gastrobar-universe home-page">
    <div class="ambient-glow glow-red"></div>
    <div class="ambient-glow glow-purple"></div>
    <div class="stars-texture"></div>
    <div class="holographic-aura aura-top-left"></div>
    <div class="holographic-aura aura-bottom-right"></div>
    <div class="light-ray"></div>

    <SiteNav active="home" :authenticated="props.authenticated" :role="props.user?.role" @navigate="emit('navigate', $event)" @logout="emit('logout')" />

    <main id="inicio" class="carousel-wrapper" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
      <div class="carousel-stage">
        <div
          v-for="(drink, index) in drinks"
          :key="drink.id"
          class="capsule-card"
          :class="{ 'is-active': index === activeIndex }"
          :style="getCardTransform(index)"
          @click="selectDrink(index)"
        >
          <div class="capsule-frame">
            <img :src="drink.image" :alt="drink.name" class="capsule-img">
            <div class="capsule-overlay"></div>
            <div class="capsule-rim-glow"></div>
          </div>
          <div v-if="index === activeIndex" class="overflow-title-container">
            <h1 class="high-fashion-title">{{ currentDrink.name }}</h1>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
        <button type="button" class="control-btn prev" aria-label="Bebida anterior" @click.stop="prev">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button type="button" class="control-btn next" aria-label="Siguiente bebida" @click.stop="next">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </main>
    <div class="home-booking-cta">
      <p>Reserva tu mesa y disfruta la experiencia.</p>
      <button type="button" class="veloris-btn-reserve-pill" @click="emit('navigate', 'reservations')">Reservar una mesa</button>
    </div>

</div>

  <section id="sobre-nosotros" class="veloris-editorial-section">
    <div class="veloris-editorial-card">
      <div class="veloris-editorial-gallery">
        <div class="veloris-photo-primary-frame"><img class="veloris-photo-img" src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop" alt="Cóctel artesanal servido en la barra"></div>
        <div class="veloris-photo-secondary-frame"><img class="veloris-photo-img" src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop" alt="Mesa preparada para compartir"></div>
      </div>
      <div class="veloris-editorial-content">
        <h2 class="veloris-editorial-title">
          <span class="veloris-title-row-1"><span class="serif-bold">SABORES</span><span class="script-italic">de temporada</span></span>
          <span class="veloris-title-row-2"><span class="serif-italic">hechos para</span><span class="serif-bold uppercase">COMPARTIR</span></span>
        </h2>
        <div class="veloris-editorial-tagline">SABORES DE AUTOR CREADOS PARA COMPARTIR</div>
        <p class="veloris-editorial-body">Cócteles de autor y platillos selectos se encuentran en una propuesta de temporada, hecha para degustarse sin prisa.</p>
        <p class="veloris-editorial-quote">Una copa, buena compañía y toda la velada por delante.</p>
        <div class="veloris-editorial-badges">
          <span class="veloris-badge-item">Coctelería de colección</span>
          <span class="veloris-badge-item">Cocina de temporada</span>
          <span class="veloris-badge-item">Ambiente íntimo</span>
        </div>
      </div>
    </div>
  </section>
</template>

