<template>
  <div class="menu-component-root">
    <!-- Barra superior mantenida también dentro de la vista del menú -->
    <header class="navbar menu-navbar">
      <button
        type="button"
        class="logo menu-home-trigger"
        aria-label="Volver al inicio"
        @click="emit('go-home')"
      >
        <span class="logo-text">GASTROBAR</span>
      </button>

      <nav class="nav-links">
        <button type="button" class="nav-item menu-home-link" @click="emit('go-home')">Inicio</button>
        <a href="#menu" class="nav-item active">Menú</a>
        <a href="#interior" class="nav-item">Interior</a>
        <button type="button" class="nav-item menu-home-link" @click="emit('go-home-nosotros')">Nosotros</button>
        <a href="#contactos" class="nav-item">Contactos</a>
      </nav>
    </header>

    <!-- =========================================================================
         SECCIÓN DEL MENÚ (ENCABEZADO + FILTROS + TARJETAS FLYER "WHISKY NIGHT")
         ========================================================================= -->
    <section id="menu" class="menu-luxury-section">
      <div class="menu-header-center">
        <span class="menu-pre-tag">EXCLUSIVA CARTA DE CATA & ALTA COCINA</span>
        <h2 class="menu-title-lux">MENÚ DE COMIDAS & CÓCTELES</h2>
        <p class="menu-lead-text">
          Haz clic en cualquiera de las tarjetas para desplegar la tarjeta flotante con la ficha técnica detallada del producto.
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
            Cócteles & Whiskies
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
              <span class="flyer-logo-text">TU LOGO</span>
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
                <span class="flyer-headline-word">{{ product.flyerTitleTop }}</span>
                <span class="flyer-headline-word">{{ product.flyerTitleBottom }}</span>
              </div>

              <!-- Letra manuscrita elegante: Welcome -->
              <div class="flyer-script-welcome">Bienvenido</div>

              <!-- Subtítulo: THE BEST WHISKY IN THE WORLD -->
              <div class="flyer-sub-banner">
                <span class="flyer-sub-title">{{ product.flyerSubtitle }}</span>
                <span class="flyer-sub-lead">{{ product.flyerTagline }}</span>
              </div>

              <!-- Párrafo pequeño de cata / lorem ipsum -->
              <p class="flyer-small-print">
                LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIP SCING ELIT, SED DO EIUSMOD.
              </p>

              <!-- Vaso con whisky en las rocas y hielo en la base -->
              <div class="flyer-glass-container">
                <img
                  :src="product.flyerGlass"
                  alt="Whisky Glass"
                  class="flyer-glass-img"
                  loading="lazy"
                />
                <div class="flyer-glass-vignette"></div>
              </div>

              <!-- Dirección al pie del flyer -->
              <div class="flyer-bottom-address">
                {{ product.address }}
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
                <span class="flyer-hint-arrow">→</span>
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
        >
          ✕
        </button>

        <!-- Barra superior de navegación interna -->
        <div class="prosandoval-navbar">
          <div class="prosandoval-brand">
            <svg class="prosandoval-logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="8" r="3.5" opacity="0.9" />
              <circle cx="16" cy="8" r="3.5" opacity="0.9" />
              <circle cx="8" cy="16" r="3.5" opacity="0.9" />
              <circle cx="16" cy="16" r="3.5" opacity="0.9" />
            </svg>
            <span class="prosandoval-brand-name">BARKYEN</span>
          </div>

          <nav class="prosandoval-nav-links">
            <span class="prosandoval-nav-link">INICIO</span>
            <span class="prosandoval-nav-link">CATEGORÍAS</span>
            <span class="prosandoval-nav-link">OFERTAS</span>
            <span class="prosandoval-nav-link">BLOG</span>
            <span class="prosandoval-nav-link">CONTACTO</span>
          </nav>

          <button type="button" class="prosandoval-cart-btn" aria-label="Carrito de compras">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 01-8 0"></path>
            </svg>
          </button>
        </div>

        <!-- Cuerpo a 2 Columnas -->
        <div class="prosandoval-body-grid">
          <!-- Columna Izquierda: Información Textual -->
          <div class="prosandoval-info-col">
            <span class="prosandoval-category-tag">{{ selectedProduct.categoryLabel }}</span>
            <h2 class="prosandoval-product-title">{{ selectedProduct.name }}</h2>

            <div class="prosandoval-white-divider"></div>

            <p class="prosandoval-description-para">
              {{ selectedProduct.description }}
            </p>

            <div class="prosandoval-price-val">{{ selectedProduct.price }}</div>

            <button
              type="button"
              class="prosandoval-buy-btn"
              :class="{ success: orderSuccess }"
              @click="handleOrder"
            >
              {{ orderSuccess ? '¡ORDENADO CON ÉXITO!' : 'COMPRAR AHORA' }}
            </button>

            <div class="prosandoval-dots-box">
              <span class="prosandoval-dot-item active"></span>
              <span class="prosandoval-dot-item"></span>
              <span class="prosandoval-dot-item"></span>
              <span class="prosandoval-dot-item"></span>
            </div>
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

const emit = defineEmits(['go-home'])

const isModalOpen = ref(false)
const selectedProduct = ref(null)
const activeFilter = ref('todos')
const orderSuccess = ref(false)

const menuProducts = ref([
  {
    id: 101,
    categoryType: 'bebida',
    categoryLabel: 'WHISKY',
    name: "JACK DANIEL'S",
    price: '$ 28.000 COP',
    description: 'Muy dulce con notas fuertes de vainilla, plátano y coco; el sabor es intenso a plátano, vainilla, azúcar morena y pimienta rosada.',
    cardImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'WHISKY',
    flyerSubtitle: 'EL MEJOR WHISKY',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 102,
    categoryType: 'bebida',
    categoryLabel: 'WHISKY',
    name: 'JOHNNIE WALKER',
    price: '$ 24.000 COP',
    description: 'Black Label 12 años. Ricas notas de frutas maduras del bosque, toques de vainilla cremosa y una inconfundible estela de turba ahumada.',
    cardImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'WHISKY',
    flyerSubtitle: 'EL MEJOR WHISKY',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 103,
    categoryType: 'bebida',
    categoryLabel: 'WHISKY',
    name: 'TALISKER 10',
    price: '$ 32.000 COP',
    description: 'Single Malt de la Isla de Skye. Notas marinas salinas con pimienta negra recién molida, cebada malteada y un humo envolvente.',
    cardImage: 'https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'WHISKY',
    flyerSubtitle: 'EL MEJOR WHISKY',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 104,
    categoryType: 'bebida',
    categoryLabel: 'WHISKY',
    name: 'JAMESON TRIPLE',
    price: '$ 25.000 COP',
    description: 'Triple destilado irlandés con notas ricas de vainilla cremosa, madera tostada y final suavemente especiado.',
    cardImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'WHISKY',
    flyerSubtitle: 'EL MEJOR WHISKY',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 105,
    categoryType: 'bebida',
    categoryLabel: 'WHISKY',
    name: 'BARTERHOUSE 20',
    price: '$ 45.000 COP',
    description: 'Bourbon añejado 20 años en barricas vírgenes de roble americano carbonizado. Caramelo oscuro, nuez moscada y vainas de vainilla pura.',
    cardImage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'WHISKY',
    flyerSubtitle: 'EL MEJOR WHISKY',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 106,
    categoryType: 'bebida',
    categoryLabel: 'CÓCTEL',
    name: 'NEGRONI NEBULA',
    price: '$ 18.000 COP',
    description: 'Campari macerado en frío con botánicos espaciales, ginebra seca artesanal en alambique de cobre y notas florales de naranja amarga.',
    cardImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'CÓCTELES',
    flyerSubtitle: 'LA MEJOR MEZCLA',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 107,
    categoryType: 'comida',
    categoryLabel: 'ALTA COCINA',
    name: 'TÁRTAR BALFEGÓ',
    price: '$ 35.000 COP',
    description: 'Atún rojo Balfegó cortado fino a cuchillo, emulsión de trufa negra melanosporum, alga nori tostada y perlas de caviar Oscietra.',
    cardImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE',
    flyerTitleBottom: 'GOURMET',
    flyerSubtitle: 'EL MEJOR PLATO',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 108,
    categoryType: 'comida',
    categoryLabel: 'CARNES MADURADAS',
    name: 'ENTRECOT AL SARMIENTO',
    price: '$ 32.000 COP',
    description: 'Corte madurado 45 días asado a la leña de sarmiento con mantequilla aromatizada de romero, ajo confitado y escamas de sal negra.',
    cardImage: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE',
    flyerTitleBottom: 'ESPECIAL',
    flyerSubtitle: 'LOS MEJORES CORTES',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 109,
    categoryType: 'comida',
    categoryLabel: 'TAPAS SELECTAS',
    name: 'TABLA 100% BELLOTA',
    price: '$ 28.000 COP',
    description: 'Paleta ibérica de bellota cortada al momento, cuña de queso curado trufado en aceite de oliva virgen extra y tostas artesanales.',
    cardImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE',
    flyerTitleBottom: 'DELICIOSA',
    flyerSubtitle: 'LA MEJOR SELECCIÓN',
    flyerTagline: 'DEL MUNDO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 110,
    categoryType: 'comida',
    categoryLabel: 'HAMBURGUESAS GOURMET',
    name: 'HAMBURGUESA BLACK ANGUS',
    price: '$ 28.000 COP',
    description: 'Carne Black Angus a la parrilla, queso cheddar madurado, cebolla caramelizada, pepinillos y salsa de la casa en pan brioche tostado.',
    cardImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'NOCHE DE',
    flyerTitleBottom: 'HAMBURGUESA',
    flyerSubtitle: 'LA MEJOR HAMBURGUESA',
    flyerTagline: 'DE LA CASA',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 111,
    categoryType: 'comida',
    categoryLabel: 'HAMBURGUESAS GOURMET',
    name: 'TRUFA Y TOCINO',
    price: '$ 32.000 COP',
    description: 'Doble carne a la parrilla, tocino crujiente, queso suizo, mayonesa de trufa y rúcula fresca sobre pan brioche artesanal.',
    cardImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'TRUFA Y',
    flyerTitleBottom: 'BACON',
    flyerSubtitle: 'BACON Y TRUFA',
    flyerTagline: 'SABOR DE LA CASA',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 112,
    categoryType: 'comida',
    categoryLabel: 'HAMBURGUESAS GOURMET',
    name: 'POLLO CRUJIENTE BBQ',
    price: '$ 26.000 COP',
    description: 'Pollo crujiente, queso gouda, ensalada cremosa, jalapeños y salsa BBQ ahumada en pan de sésamo.',
    cardImage: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'POLLO',
    flyerTitleBottom: 'CRUJIENTE',
    flyerSubtitle: 'ESTILO BBQ AHUMADO',
    flyerTagline: 'CRUJIENTE Y FRESCO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 113,
    categoryType: 'comida',
    categoryLabel: 'SALCHIPAPAS',
    name: 'SALCHIPAPA CLÁSICA',
    price: '$ 18.000 COP',
    description: 'Papas doradas, salchicha ahumada en rodajas y queso fundido, terminadas con kétchup, mostaza, mayonesa de la casa y cebollino fresco.',
    cardImage: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'SALCHI',
    flyerTitleBottom: 'PAPA',
    flyerSubtitle: 'COMIDA CALLEJERA CRUJIENTE',
    flyerTagline: 'HECHA PARA COMPARTIR',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  },
  {
    id: 114,
    categoryType: 'comida',
    categoryLabel: 'SALCHIPAPAS',
    name: 'SALCHIPAPA CARGADA',
    price: '$ 24.000 COP',
    description: 'Papas crujientes, salchicha ahumada, doble queso fundido, tocino, cebolla crujiente y salsa especial de la casa.',
    cardImage: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=85',
    bottleImage: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=85',
    flyerGlass: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
    clubName: 'NOMBRE DE TU CLUB',
    flyerTitleTop: 'SALCHI',
    flyerTitleBottom: 'PAPA CARGADA',
    flyerSubtitle: 'QUESO Y BACON',
    flyerTagline: 'SABOR COMPLETO',
    address: '3499 Bridge Avenue, Lafayette- 70506'
  }
])

const filteredProducts = computed(() => {
  if (activeFilter.value === 'todos') return menuProducts.value
  return menuProducts.value.filter(p => p.categoryType === activeFilter.value)
})

function openModal(prod) {
  selectedProduct.value = prod
  orderSuccess.value = false
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleOrder() {
  orderSuccess.value = true
  setTimeout(() => {
    orderSuccess.value = false
  }, 2200)
}
</script>