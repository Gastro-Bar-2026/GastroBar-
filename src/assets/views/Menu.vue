<template>
  <div class="menu-component-root">
    <!-- Barra superior mantenida también dentro de la vista del menú -->
    <SiteNav active="menu" :authenticated="authenticated" :role="user?.role" @navigate="emit('navigate', $event)" @logout="emit('logout')" />

    <!-- =========================================================================
         SECCIÓN DEL MENÚ (ENCABEZADO + FILTROS + TARJETAS FLYER "WHISKY NIGHT")
         ========================================================================= -->
    <section id="menu" class="menu-luxury-section">
      <div class="menu-header-center">
        <span class="menu-pre-tag">CARTA DE COMIDAS Y BEBIDAS</span>
        <h2 class="menu-title-lux">MENÚ DE COMIDAS Y CÓCTELES</h2>
        <p class="menu-lead-text">
          Selecciona una tarjeta para conocer sus ingredientes y detalles.
        </p>

        <!-- Filtros de categoría -->
        <div class="category-filter-bar">
          <button
            type="button"
            class="cat-pill-btn"
            :class="{ active: activeFilter === 'todos' }"
            @click="activeFilter = 'todos'"
          >
            Todo el Menú
          </button>
          <button
            type="button"
            class="cat-pill-btn"
            :class="{ active: activeFilter === 'bebida' }"
            @click="activeFilter = 'bebida'"
          >
            CÓCTELES Y WHISKIS
          </button>
          <button
            type="button"
            class="cat-pill-btn"
            :class="{ active: activeFilter === 'comida' }"
            @click="activeFilter = 'comida'"
          >
            Platos & Comidas
          </button>
        </div>
      </div>

      <!-- Cuadrícula de 3 columnas: Tarjetas con diseño exacto del flyer WHISKY NIGHT -->
      <div class="tri-grid-container">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="whisky-flyer-card"
          @click="openModal(product)"
        >
          <!-- Encabezado superior con YOUR LOGO -->
          <div class="flyer-top-header">
            <div class="flyer-logo-badge">
              <svg class="flyer-logo-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="8" cy="8" r="3.2" opacity="0.95" />
                <circle cx="16" cy="8" r="3.2" opacity="0.95" />
                <circle cx="8" cy="16" r="3.2" opacity="0.95" />
                <circle cx="16" cy="16" r="3.2" opacity="0.95" />
              </svg>
              <span class="flyer-logo-text">GASTROBAR</span>
            </div>
            <span class="flyer-price-chip">{{ product.price }}</span>
          </div>

          <!-- Cuerpo dividido en 2 columnas: Izquierda tipográfica y Derecha botella en barra -->
          <div class="flyer-split-body">
            <!-- Columna Izquierda: Club Name en arco, WHISKY NIGHT, Welcome, Glass y Dirección -->
            <div class="flyer-col-left">
              <!-- Nombre del Club en Arco SVG -->
              <div class="flyer-arc-wrapper">
                <svg viewBox="0 0 160 38" class="flyer-arc-svg">
                  <path
                    :id="`flyer-arc-path-${product.id}`"
                    d="M 12,32 A 74,26 0 0,1 148,32"
                    fill="transparent"
                  />
                  <text class="flyer-arc-text">
                    <textPath
                      :href="`#flyer-arc-path-${product.id}`"
                      startOffset="50%"
                      text-anchor="middle"
                    >
                      {{ product.clubName }}
                    </textPath>
                  </text>
                </svg>
                <span class="flyer-present-tag">PRESENTA</span>
              </div>

              <!-- Título Principal BOLD condensado: WHISKY NIGHT -->
              <div class="flyer-headline-stack">
                <span
                  v-for="(line, index) in flyerTitleLines(product.name)"
                  :key="`${product.id}-title-${index}`"
                  class="flyer-headline-word"
                >
                  {{ line }}
                </span>
              </div>

              <!-- Letra manuscrita elegante: Welcome -->
              <div class="flyer-script-welcome">Bienvenido</div>

              <!-- Subtítulo: THE BEST WHISKY IN THE WORLD -->
              <div class="flyer-sub-banner">
                <span class="flyer-sub-title">{{ product.flyerSubtitle }}</span>
                <span class="flyer-sub-lead">{{ product.flyerTagline }}</span>
              </div>

              <!-- Vaso con whisky en las rocas y hielo en la base -->
              <div class="flyer-glass-container">
                <img
                  :src="product.flyerGlass"
                  alt="Vaso de whisky"
                  class="flyer-glass-img"
                  loading="lazy"
                />
                <div class="flyer-glass-vignette"></div>
              </div>

            </div>

            <!-- Columna Derecha: Botella iluminada sobre la barra de madera -->
            <div class="flyer-col-right">
              <img
                :src="product.cardImage"
                :alt="product.name"
                class="flyer-bottle-hero-img"
                loading="lazy"
              />
              <div class="flyer-bottle-halo"></div>
              <div class="flyer-bottle-inner-shadow"></div>

              <!-- Indicador interactivo para abrir la tarjeta flotante -->
              <div class="flyer-action-hint">
                <span>VER DETALLES</span>
                
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- =========================================================================
         2. SEGUNDA TARJETA FLOTANTE INTERACTIVA (MODAL DE CATA GLASSMORPHISM)
         ========================================================================= -->
    <div
      v-if="isModalOpen && selectedProduct"
      class="prosandoval-overlay"
      @click.self="closeModal"
    >
      <div class="prosandoval-card" role="dialog" aria-modal="true">
        <!-- Botón cerrar (X) -->
        <button
          type="button"
          class="prosandoval-close-btn"
          aria-label="Cerrar modal"
          @click="closeModal"
        >X</button>

        <!-- Cuerpo a 2 Columnas -->
        <div class="prosandoval-body-grid">
          <!-- Columna Izquierda: Información Textual -->
          <div class="prosandoval-info-col">
            <span class="prosandoval-category-tag">{{ selectedProduct.categoryLabel }}</span>
            <h2 class="prosandoval-product-title">{{ selectedProduct.name }}</h2>

            <div class="prosandoval-white-divider"></div>

            <p class="prosandoval-description-para">{{ selectedProduct.description }}</p>
            <h3 class="product-ingredients-title">Ingredientes</h3>
            <p class="prosandoval-description-para">{{ selectedProduct.ingredients || selectedProduct.description }}</p>

            <div class="prosandoval-price-val">{{ selectedProduct.price }}</div>
</div>

          <!-- Columna Derecha: Botella Inclinada 3D -->
          <div class="prosandoval-bottle-col">
            <div class="prosandoval-tilted-wrap">
              <img
                :src="selectedProduct.bottleImage || selectedProduct.cardImage"
                :alt="selectedProduct.name"
                class="prosandoval-bottle-img"
              />
              <div class="prosandoval-amber-halo"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SiteNav from './SiteNav.vue'
import { defaultMenuProducts } from './menuData.js'

defineProps({ authenticated: Boolean, user: Object })
const emit = defineEmits(['navigate', 'logout'])

const isModalOpen = ref(false)
const selectedProduct = ref(null)
const activeFilter = ref('todos')

const menuProducts = ref(loadCatalog())

function loadCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem('gastrobar-admin-products') || 'null')
    if (Array.isArray(saved)) return saved
  } catch {}
  return defaultMenuProducts
}


const filteredProducts = computed(() => {
  if (activeFilter.value === 'todos') return menuProducts.value
  return menuProducts.value.filter(product => product.categoryType === activeFilter.value)
})

function flyerTitleLines(name) {
  const words = name.trim().split(/\s+/)
  if (words.length < 2) return words

  let splitAt = 1
  let smallestDifference = Infinity
  for (let index = 1; index < words.length; index += 1) {
    const firstLineLength = words.slice(0, index).join(' ').length
    const secondLineLength = words.slice(index).join(' ').length
    const difference = Math.abs(firstLineLength - secondLineLength)
    if (difference < smallestDifference) {
      smallestDifference = difference
      splitAt = index
    }
  }

  return [words.slice(0, splitAt).join(' '), words.slice(splitAt).join(' ')]
}

function openModal(prod) {
  selectedProduct.value = prod
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

</script>
