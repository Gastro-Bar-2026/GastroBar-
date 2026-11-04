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
      <header class="contact-heading">
        <p class="contact-eyebrow"><span></span>ESTAMOS PARA ATENDERTE<span></span></p>
        <h1>Contacto</h1>
        <span class="contact-heading-star" aria-hidden="true">✦</span>
        <p class="contact-intro">Escríbenos o síguenos para conocer las novedades de Gastrobar.</p>
      </header>
      <section class="contact-cards">
        <a class="contact-card whatsapp-card" :href="whatsappUrl" target="_blank" rel="noreferrer">
          <span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.5-4.9a8.4 8.4 0 1 1 16-3.9Z"/><path d="M8.2 7.7c.3-.6.7-.6 1-.6h.4c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.5.9 1.3 1.6 2.2 2.1.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.3.3.3.5 0 .4-.2 1.3-.8 1.8-.6.5-1.3.7-2.1.5-1.1-.3-2.4-.9-3.7-2.1-1.1-1-2-2.2-2.4-3.2-.4-1.1 0-2.2.7-2.9Z"/></svg></span>
          <span class="contact-card-copy"><span class="contact-label">WhatsApp</span><strong>Comunícate con el restaurante</strong><span>Escríbenos para resolver tus dudas</span></span>
          <span class="contact-action">Enviar mensaje <span aria-hidden="true">→</span></span>
        </a>
        <a class="contact-card" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          <span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="contact-icon-dot" cx="17.7" cy="6.8" r="1"/></svg></span>
          <span class="contact-card-copy"><span class="contact-label">Instagram</span><strong>@gastrobar</strong><span>Fotos, bebidas y novedades</span></span>
          <span class="contact-action">Visitar perfil <span aria-hidden="true">→</span></span>
        </a>
        <a class="contact-card" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
          <span class="contact-icon contact-icon-facebook" aria-hidden="true">f</span>
          <span class="contact-card-copy"><span class="contact-label">Facebook</span><strong>Gastrobar</strong><span>Eventos y noticias</span></span>
          <span class="contact-action">Visitar perfil <span aria-hidden="true">→</span></span>
        </a>
        <a class="contact-card" href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
          <span class="contact-icon contact-icon-tiktok" aria-hidden="true">♪</span>
          <span class="contact-card-copy"><span class="contact-label">TikTok</span><strong>@gastrobar</strong><span>Descubre nuestra experiencia</span></span>
          <span class="contact-action">Visitar perfil <span aria-hidden="true">→</span></span>
        </a>
      </section>
      <div class="contact-reserve-row"><span></span><button class="veloris-btn-reserve-pill" type="button" @click="emit('navigate', 'reservations')"><span aria-hidden="true">▦</span> Reservar una mesa</button><span></span></div>
    </main>
  </div>
</template>