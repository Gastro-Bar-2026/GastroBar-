<template>
  <div class="veloris-auth-viewport">
    <!-- Luces atmosféricas de fondo estilo Veloris -->
    <div class="veloris-auth-ambient-ray"></div>
    <div class="veloris-auth-dust-overlay"></div>
    <div class="veloris-auth-halo-gold"></div>

    <div class="veloris-auth-container">
      <!-- Título Principal y Subtítulo -->
      <div class="veloris-auth-titles">
        <h1 class="veloris-auth-heading">
          {{ mode === 'login' ? 'Bienvenido' : 'Crea una cuenta' }}
        </h1>
        <p class="veloris-auth-subtext">
          {{
            mode === 'login'
              ? 'Inicia sesión para continuar'
                : 'Regístrate y únete a nuestro salón culinario privado'
          }}
        </p>
      </div>

      <!-- Separador tenue -->
      <div class="veloris-auth-divider-line"></div>

      <!-- Alertas de error e información -->
      <div v-if="errorMessage" class="veloris-auth-alert error">
        <span>{{ errorMessage }}</span>
      </div>
      <div v-if="infoMessage" class="veloris-auth-alert info">
        <span>{{ infoMessage }}</span>
      </div>

      <!-- Formulario Principal -->
      <form class="veloris-auth-form" @submit.prevent="handleSubmit" novalidate>
        <!-- Campo Nombre (solo en modo registro) -->
        <div v-if="mode === 'register'" class="veloris-input-group">
          <label class="veloris-input-label">NOMBRE COMPLETO</label>
          <div class="veloris-input-wrapper">
            <input
              v-model="fullName"
              type="text"
              class="veloris-input-field"
              placeholder="Kyle Joel"
              autocomplete="name"
            />
            <!-- Ícono Usuario -->
            <svg class="veloris-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <!-- Campo Email -->
        <div class="veloris-input-group">
          <label class="veloris-input-label">CORREO ELECTRÓNICO</label>
          <div class="veloris-input-wrapper">
            <input
              v-model="email"
              type="email"
              class="veloris-input-field"
              placeholder="you@example.com"
              autocomplete="email"
            />
            <!-- Ícono Mail -->
            <svg class="veloris-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
        </div>

        <!-- Campo Password -->
        <div class="veloris-input-group">
          <label class="veloris-input-label">CONTRASEÑA</label>
          <div class="veloris-input-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="veloris-input-field"
              placeholder="••••••••••••"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
            />
            <!-- Botón Ojo (Mostrar/Ocultar contraseña) -->
            <button
              type="button"
              class="veloris-input-action-btn"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="veloris-input-icon-btn" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else class="veloris-input-icon-btn" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                <line x1="2" x2="22" y1="2" y2="22"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Campo Confirmar Password (solo en modo registro) -->
        <div v-if="mode === 'register'" class="veloris-input-group">
          <label class="veloris-input-label">CONFIRMAR CONTRASEÑA</label>
          <div class="veloris-input-wrapper">
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="veloris-input-field"
              placeholder="••••••••••••"
            />
            <!-- Ícono Lock -->
            <svg class="veloris-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        <!-- Fila Recordarme y Olvidé contraseña -->
        <div class="veloris-auth-options-row">
          <label class="veloris-checkbox-label">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="veloris-hidden-checkbox"
            />
            <span class="veloris-custom-checkbox" :class="{ checked: rememberMe }">
              <svg v-if="rememberMe" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#110f13" stroke-width="3.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="veloris-checkbox-text">RECUÉRDAME</span>
          </label>

          <button
            v-if="mode === 'login'"
            type="button"
            class="veloris-forgot-link"
            @click="handleForgotPassword"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <!-- Botón principal dorado -->
        <button
          type="submit"
          class="veloris-btn-gold-submit"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">PROCESANDO...</span>
          <span v-else-if="mode === 'login'">INICIAR SESIÓN</span>
          <span v-else>CREAR CUENTA</span>
        </button>
      </form>

      <!-- Divisor de acceso alternativo -->
      <div class="veloris-or-divider">
        <div class="veloris-or-line"></div>
        <span class="veloris-or-text">o continúa con</span>
        <div class="veloris-or-line"></div>
      </div>

      <!-- Botones Sociales (Google y Apple) -->
      <div class="veloris-social-row">
        <button
          type="button"
          class="veloris-social-btn"
          @click="handleSocialLogin('Google')"
        >
          <svg class="veloris-social-svg" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          class="veloris-social-btn"
          @click="handleSocialLogin('Apple')"
        >
          <svg class="veloris-social-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.81 1.11-1.95.99-3.09-1 .04-2.2.67-2.9 1.49-.62.72-1.16 1.88-1.01 2.99 1.12.09 2.26-.58 2.92-1.39z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>

      <!-- BOTÓN PRINCIPAL SOLICITADO: ACCEDER SIN REGISTRARSE -->
      <div class="veloris-guest-access-wrap">
        <button
          type="button"
          class="veloris-guest-btn"
          @click="handleGuestAccess"
        >
          <svg class="veloris-guest-sparkle" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          </svg>
          <span>ACCEDER SIN REGISTRARSE</span>
          <svg class="veloris-guest-arrow" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div class="veloris-bottom-toggle">
        <button
          type="button"
          class="veloris-toggle-action"
          @click="switchMode('register')"
        >
          Crear cuenta →
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['authenticate'])

const mode = ref('login') // 'login' | 'register'
const email = ref('')
const password = ref('')
const fullName = ref('')
const confirmPassword = ref('')
const rememberMe = ref(true)
const showPassword = ref(false)
const errorMessage = ref('')
const infoMessage = ref('')
const isSubmitting = ref(false)

function switchMode(newMode) {
  mode.value = newMode
  errorMessage.value = ''
  infoMessage.value = ''
}

function handleSubmit() {
  errorMessage.value = ''
  infoMessage.value = ''

  if (mode.value === 'login') {
    if (!email.value.trim()) {
      errorMessage.value = 'Por favor introduce tu correo electrónico.'
      return
    }
    if (!password.value) {
      errorMessage.value = 'Por favor introduce tu contraseña.'
      return
    }

    isSubmitting.value = true
    setTimeout(() => {
      isSubmitting.value = false
      const namePart = email.value.split('@')[0] || 'Miembro'
      emit('authenticate', {
        email: email.value.trim(),
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        isGuest: false
      })
    }, 600)
  } else {
    // Modo Registro
    if (!fullName.value.trim()) {
      errorMessage.value = 'Por favor introduce tu nombre completo.'
      return
    }
    if (!email.value.trim() || !email.value.includes('@')) {
      errorMessage.value = 'Por favor introduce un correo electrónico válido.'
      return
    }
    if (password.value.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.'
      return
    }
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden.'
      return
    }

    isSubmitting.value = true
    setTimeout(() => {
      isSubmitting.value = false
      emit('authenticate', {
        email: email.value.trim(),
        name: fullName.value.trim(),
        isGuest: false
      })
    }, 650)
  }
}

function handleGuestAccess() {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    emit('authenticate', {
      email: 'invitado@veloris.lounge',
      name: 'Invitado Privé',
      isGuest: true
    })
  }, 400)
}

function handleSocialLogin(provider) {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    emit('authenticate', {
      email: `miembro.${provider.toLowerCase()}@veloris.lounge`,
      name: `Usuario ${provider}`,
      isGuest: false
    })
  }, 500)
}

function handleForgotPassword() {
  if (!email.value.trim()) {
    infoMessage.value = 'Introduce tu correo arriba y te enviaremos un enlace de recuperación.'
  } else {
    infoMessage.value = `Enlace de recuperación enviado a ${email.value}. Revisa tu bandeja de entrada.`
  }
}
</script>