<script setup>
import SiteNav from './SiteNav.vue'
const props = defineProps({ authenticated: Boolean, user: Object })
const emit = defineEmits(['navigate', 'logout'])
// Reemplaza este número y los perfiles de ejemplo por los datos oficiales del restaurante.
const whatsappUrl = 'https://wa.me/573000000000?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20Gastrobar'
</script>
<template>
  <div class="contact-page">
    <SiteNav active="contact" :authenticated="props.authenticated" :role="props.user?.role" @navigate="emit('navigate', $event)" @logout="emit('logout')" />
    <main class="contact-content">
      <p class="admin-eyebrow">ESTAMOS PARA ATENDERTE</p>
      <h1>Contacto</h1>
      <p class="admin-lead">Escríbenos o síguenos para conocer las novedades de Gastrobar.</p>
      <section class="contact-cards">
        <a class="contact-card whatsapp-card" :href="whatsappUrl" target="_blank" rel="noreferrer">
          <span class="contact-icon">WA</span><span class="contact-label">WhatsApp</span><strong>Comunícate con el restaurante</strong><span>Escríbenos para resolver tus dudas</span>
        </a>
        <a class="contact-card" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          <span class="contact-icon">IG</span><span class="contact-label">Instagram</span><strong>@gastrobar</strong><span>Fotos, bebidas y novedades</span>
        </a>
        <a class="contact-card" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
          <span class="contact-icon">FB</span><span class="contact-label">Facebook</span><strong>Gastrobar</strong><span>Eventos y noticias</span>
        </a>
        <a class="contact-card" href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
          <span class="contact-icon">TK</span><span class="contact-label">TikTok</span><strong>@gastrobar</strong><span>Descubre nuestra experiencia</span>
        </a>
      </section>
      <button class="veloris-btn-reserve-pill" type="button" @click="emit('navigate', 'reservations')">Reservar una mesa</button>
    </main>
  </div>
</template>