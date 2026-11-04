<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  reservations: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] },
  user: { type: Object, default: () => ({}) },
  initialSection: { type: String, default: 'productos' }
})
const emit = defineEmits(['update:modelValue', 'update:reservations', 'update:users', 'navigate', 'logout'])
const servicios = computed({ get: () => props.modelValue, set: valor => emit('update:modelValue', valor) })
const filtro = ref('')
const paginaActual = ref(1)
const serviciosPorPagina = 5
const seccion = ref(props.initialSection)
const filtroReservas = ref('')
const estadoReserva = ref('Todas')
const paginaReservas = ref(1)
const filtroUsuarios = ref('')
const paginaUsuarios = ref(1)
const modalAbierto = ref(false)
const modalUsuarioAbierto = ref(false)
const productoPorEliminar = ref(null)
const aviso = ref('')
const idEditando = ref(null)
const formularioVacio = () => ({ nombre: '', categoria: 'Comidas', precio: '', ingredientes: '', descripcion: '', foto: '' })
const formulario = ref(formularioVacio())
const idUsuarioEditando = ref(null)
const avisoUsuario = ref('')
const formularioUsuarioVacio = () => ({ nombre: '', correo: '', rol: 'customer', estado: 'Activo' })
const formularioUsuario = ref(formularioUsuarioVacio())
const serviciosFiltrados = computed(() => {
  const texto = filtro.value.trim().toLocaleLowerCase('es')
  return servicios.value.filter(item => `${item.nombre} ${item.categoria}`.toLocaleLowerCase('es').includes(texto))
})
const totalPaginas = computed(() => Math.max(1, Math.ceil(serviciosFiltrados.value.length / serviciosPorPagina)))
const serviciosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * serviciosPorPagina
  return serviciosFiltrados.value.slice(inicio, inicio + serviciosPorPagina)
})
const paginasVisibles = computed(() => {
  const inicio = Math.max(1, Math.min(paginaActual.value - 2, totalPaginas.value - 4))
  return Array.from({ length: Math.min(5, totalPaginas.value) }, (_, indice) => inicio + indice)
})
const reservasFiltradas = computed(() => {
  const texto = filtroReservas.value.trim().toLocaleLowerCase('es')
  return props.reservations.filter(reserva => {
    const coincideEstado = estadoReserva.value === 'Todas' || reserva.status === estadoReserva.value
    const coincideTexto = `${reserva.customer} ${reserva.email}`.toLocaleLowerCase('es').includes(texto)
    return coincideEstado && coincideTexto
  })
})
const totalPaginasReservas = computed(() => Math.max(1, Math.ceil(reservasFiltradas.value.length / serviciosPorPagina)))
const reservasPaginadas = computed(() => reservasFiltradas.value.slice((paginaReservas.value - 1) * serviciosPorPagina, paginaReservas.value * serviciosPorPagina))
const paginasReservasVisibles = computed(() => {
  const inicio = Math.max(1, Math.min(paginaReservas.value - 2, totalPaginasReservas.value - 4))
  return Array.from({ length: Math.min(5, totalPaginasReservas.value) }, (_, indice) => inicio + indice)
})
const usuariosFiltrados = computed(() => {
  const texto = filtroUsuarios.value.trim().toLocaleLowerCase('es')
  return props.users.filter(usuario => `${usuario.nombre} ${usuario.correo} ${etiquetaRol(usuario.rol)}`.toLocaleLowerCase('es').includes(texto))
})
const totalPaginasUsuarios = computed(() => Math.max(1, Math.ceil(usuariosFiltrados.value.length / serviciosPorPagina)))
const usuariosPaginados = computed(() => usuariosFiltrados.value.slice((paginaUsuarios.value - 1) * serviciosPorPagina, paginaUsuarios.value * serviciosPorPagina))
const paginasUsuariosVisibles = computed(() => {
  const inicio = Math.max(1, Math.min(paginaUsuarios.value - 2, totalPaginasUsuarios.value - 4))
  return Array.from({ length: Math.min(5, totalPaginasUsuarios.value) }, (_, indice) => inicio + indice)
})
const categoriaVisible = categoria => categoria === 'Cocteles' ? 'C\u00f3cteles' : categoria
const precio = valor => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor)
const etiquetaRol = rol => ({ customer: 'Cliente', employee: 'Empleado', admin: 'Administrador' })[rol] || 'Cliente'
const iniciales = nombre => nombre.trim().split(/\s+/).slice(0, 2).map(parte => parte[0] || '').join('').toLocaleUpperCase('es')

watch([filtro, filtroReservas, estadoReserva, filtroUsuarios], () => {
  paginaActual.value = 1
  paginaReservas.value = 1
  paginaUsuarios.value = 1
})
watch(() => props.initialSection, valor => { seccion.value = valor })

function nuevoServicio() {
  idEditando.value = null
  formulario.value = formularioVacio()
  aviso.value = ''
  modalAbierto.value = true
}
function seleccionarFoto(evento) {
  const archivo = evento.target.files?.[0]
  if (!archivo) return
  if (!archivo.type.startsWith('image/')) { aviso.value = 'Selecciona un archivo de imagen.'; return }
  const lector = new FileReader()
  lector.onload = () => { formulario.value.foto = lector.result; aviso.value = '' }
  lector.readAsDataURL(archivo)
}
function guardar() {
  const datos = { ...formulario.value, nombre: formulario.value.nombre.trim(), precio: Number(formulario.value.precio), ingredientes: formulario.value.ingredientes.split(',').map(item => item.trim()).filter(Boolean) }
  if (!datos.nombre || !datos.precio || datos.precio < 1 || !datos.ingredientes.length) {
    aviso.value = 'Completa el nombre, el precio y los ingredientes.'
    return
  }
  if (idEditando.value !== null) {
    servicios.value = servicios.value.map(item => item.id === idEditando.value ? { ...item, ...datos } : item)
    aviso.value = 'Servicio actualizado.'
  } else {
    servicios.value = [...servicios.value, { id: Date.now(), ...datos }]
    aviso.value = 'Servicio agregado al menú.'
    paginaActual.value = Math.ceil(servicios.value.length / serviciosPorPagina)
  }
  modalAbierto.value = false
}
function editar(item) {
  idEditando.value = item.id
  formulario.value = { ...item, ingredientes: item.ingredientes.join(', ') }
  aviso.value = ''
  modalAbierto.value = true
}
function eliminar(id) {
  servicios.value = servicios.value.filter(item => item.id !== id)
  paginaActual.value = Math.min(paginaActual.value, totalPaginas.value)
  aviso.value = 'Servicio eliminado.'
}

function confirmarEliminacion() {
  if (!productoPorEliminar.value) return
  eliminar(productoPorEliminar.value.id)
  productoPorEliminar.value = null
}

function cambiarEstadoReserva(reserva, estado) {
  emit('update:reservations', props.reservations.map(item => item.id === reserva.id ? { ...item, status: estado } : item))
}

function nuevaCuenta() {
  idUsuarioEditando.value = null
  formularioUsuario.value = formularioUsuarioVacio()
  avisoUsuario.value = ''
  modalUsuarioAbierto.value = true
}

function editarCuenta(usuario) {
  idUsuarioEditando.value = usuario.id
  formularioUsuario.value = { ...usuario }
  avisoUsuario.value = ''
  modalUsuarioAbierto.value = true
}

function guardarCuenta() {
  const datos = {
    ...formularioUsuario.value,
    nombre: formularioUsuario.value.nombre.trim(),
    correo: formularioUsuario.value.correo.trim().toLocaleLowerCase('es')
  }
  if (!datos.nombre || !datos.correo.includes('@')) {
    avisoUsuario.value = 'Escribe el nombre y un correo electrónico válido.'
    return
  }
  if (props.users.some(usuario => usuario.correo === datos.correo && usuario.id !== idUsuarioEditando.value)) {
    avisoUsuario.value = 'Ya existe una cuenta con ese correo electrónico.'
    return
  }
  if (idUsuarioEditando.value !== null) {
    const cuentaActual = props.users.find(usuario => usuario.id === idUsuarioEditando.value)
    if (cuentaActual?.correo === props.user?.email && (datos.rol !== 'admin' || datos.estado !== 'Activo')) {
      avisoUsuario.value = 'No puedes cambiar el rol o desactivar tu propia cuenta de administrador.'
      return
    }
    emit('update:users', props.users.map(usuario => usuario.id === idUsuarioEditando.value ? { ...usuario, ...datos } : usuario))
  } else {
    emit('update:users', [...props.users, { id: Date.now(), ...datos }])
    paginaUsuarios.value = 1
  }
  modalUsuarioAbierto.value = false
}

function eliminarCuenta(usuario) {
  if (usuario.correo === props.user?.email) return
  emit('update:users', props.users.filter(item => item.id !== usuario.id))
  paginaUsuarios.value = Math.min(paginaUsuarios.value, totalPaginasUsuarios.value)
}

function formatDate(value) {
  if (!value) return '—'
  const fecha = new Date(`${value}T00:00:00`)
  return Number.isNaN(fecha.getTime())
    ? value
    : new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(fecha)
}
</script>

<template>
  <main class="admin-servicios">
    <aside class="barra-lateral">
      <button class="marca" type="button" aria-label="Ir a productos" @click="seccion = 'productos'">GASTROBAR</button>
      <p class="submarca">PANEL DE ADMINISTRACIÓN</p>
      <nav class="navegacion" aria-label="Navegación de administración">
        <button type="button" :class="{ activo: seccion === 'productos' }" :aria-current="seccion === 'productos' ? 'page' : undefined" @click="seccion = 'productos'">Productos</button>
        <button type="button" :class="{ activo: seccion === 'reservas' }" :aria-current="seccion === 'reservas' ? 'page' : undefined" @click="seccion = 'reservas'">Reservas</button>
        <button type="button" :class="{ activo: seccion === 'usuarios' }" :aria-current="seccion === 'usuarios' ? 'page' : undefined" @click="seccion = 'usuarios'">Usuarios</button>
      </nav>
      <div class="perfil"><span class="avatar">{{ iniciales(props.user?.name || 'Administrador') }}</span><span><strong>{{ props.user?.name || 'Administrador' }}</strong><small>Administrador</small></span></div>
      <button class="salir" type="button" @click="emit('logout')">Cerrar sesión</button>
    </aside>

    <section id="servicios" class="zona-principal">
      <div class="barra-superior">
        <label class="buscador">
          <span aria-hidden="true">⌕</span>
          <input v-if="seccion === 'productos'" v-model="filtro" type="search" placeholder="Buscar productos por nombre o categoría" aria-label="Buscar productos">
          <input v-else-if="seccion === 'reservas'" v-model="filtroReservas" type="search" placeholder="Buscar reservas por cliente o correo" aria-label="Buscar reservas">
          <input v-else v-model="filtroUsuarios" type="search" placeholder="Buscar usuarios por nombre, correo o rol" aria-label="Buscar usuarios">
        </label>
        <span class="marca-superior">GASTROBAR</span>
      </div>
      <div class="contenido">
        <div class="encabezado-pagina">
          <div>
            <p class="sobre-titulo">PANEL DE ADMINISTRACIÓN</p>
            <h1>{{ seccion === 'productos' ? 'Productos' : seccion === 'reservas' ? 'Reservas' : 'Usuarios' }}</h1>
            <p class="descripcion-pagina">
              {{ seccion === 'productos' ? 'Administra los platos, bebidas y botellas que ofreces en tu gastrobar.' : seccion === 'reservas' ? 'Consulta las solicitudes y actualiza el estado de las reservas.' : 'Administra las cuentas, los roles y el estado de acceso.' }}
            </p>
          </div>
          <button v-if="seccion === 'productos'" class="boton-agregar" type="button" @click="nuevoServicio">+ Agregar producto</button>
          <button v-else-if="seccion === 'usuarios'" class="boton-agregar" type="button" @click="nuevaCuenta">+ Agregar usuario</button>
        </div>

        <section v-if="seccion === 'productos'" class="panel-tabla" aria-label="Productos del gastrobar">
          <div class="tabla-titulo"><div><h2>Catálogo de productos</h2><p>Consulta y actualiza los productos disponibles.</p></div><span>{{ servicios.length }} productos</span></div>
          <div class="tabla-contenedor"><table><thead><tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>
            <tr v-for="item in serviciosPaginados" :key="item.id"><td>{{ item.id }}</td><td><div class="producto"><img v-if="item.foto" :src="item.foto" :alt="item.nombre"><span v-else class="sin-foto">{{ item.nombre.slice(0, 1).toLocaleUpperCase('es') }}</span><span><strong>{{ item.nombre }}</strong><small>{{ item.ingredientes.join(', ') }}</small></span></div></td><td><span class="etiqueta-categoria">{{ categoriaVisible(item.categoria) }}</span></td><td>{{ precio(item.precio) }}</td><td><div class="acciones"><button type="button" aria-label="Editar producto" @click="editar(item)">Editar</button><button type="button" class="eliminar" aria-label="Eliminar producto" @click="productoPorEliminar = item">Eliminar</button></div></td></tr>
          </tbody></table></div>
          <p v-if="!serviciosFiltrados.length" class="vacio">No se encontraron productos. Agrega uno nuevo o cambia la búsqueda.</p>
          <div class="pie-tabla">
            <span>Mostrando {{ serviciosFiltrados.length ? (paginaActual - 1) * serviciosPorPagina + 1 : 0 }} - {{ Math.min(paginaActual * serviciosPorPagina, serviciosFiltrados.length) }} de {{ serviciosFiltrados.length }} productos</span>
            <nav class="paginacion" aria-label="Paginación del catálogo">
              <button type="button" aria-label="Página anterior" :disabled="paginaActual === 1" @click="paginaActual--">‹</button>
              <button v-for="pagina in paginasVisibles" :key="pagina" type="button" :class="{ activa: paginaActual === pagina }" :aria-current="paginaActual === pagina ? 'page' : undefined" :aria-label="`Página ${pagina}`" @click="paginaActual = pagina">{{ pagina }}</button>
              <button type="button" aria-label="Página siguiente" :disabled="paginaActual === totalPaginas" @click="paginaActual++">›</button>
            </nav>
          </div>
        </section>

        <section v-else-if="seccion === 'reservas'" class="panel-tabla" aria-label="Reservas">
          <div class="tabla-titulo">
            <div><h2>Reservas registradas</h2><p>Revisa y actualiza las solicitudes de tus clientes.</p></div>
            <label class="filtro-estado">Estado
              <select v-model="estadoReserva" aria-label="Filtrar reservas por estado">
                <option>Todas</option><option>Pendiente</option><option>Confirmada</option><option>Cancelada</option>
              </select>
            </label>
          </div>
          <div v-if="!reservasFiltradas.length" class="vacio">{{ props.reservations.length ? 'No se encontraron reservas con estos criterios.' : 'Todavía no hay solicitudes de reserva.' }}</div>
          <div v-else class="tabla-contenedor"><table><thead><tr><th>ID</th><th>Cliente</th><th>Correo electrónico</th><th>Fecha</th><th>Hora</th><th>Personas</th><th>Notas</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
            <tr v-for="(reserva, indice) in reservasPaginadas" :key="reserva.id"><td>{{ (paginaReservas - 1) * serviciosPorPagina + indice + 1 }}</td><td><div class="producto"><span class="sin-foto">{{ iniciales(reserva.customer || 'Cliente') }}</span><strong>{{ reserva.customer || 'Cliente' }}</strong></div></td><td>{{ reserva.email || '—' }}</td><td>{{ formatDate(reserva.date) }}</td><td>{{ reserva.time || '—' }}</td><td>{{ reserva.guests }}</td><td>{{ reserva.notes || '—' }}</td><td><span class="etiqueta-categoria" :class="`estado-${reserva.status.toLocaleLowerCase('es')}`">{{ reserva.status }}</span></td><td><div class="acciones"><button type="button" :disabled="reserva.status === 'Confirmada'" @click="cambiarEstadoReserva(reserva, 'Confirmada')">Confirmar</button><button type="button" class="eliminar" :disabled="reserva.status === 'Cancelada'" @click="cambiarEstadoReserva(reserva, 'Cancelada')">Cancelar</button></div></td></tr>
          </tbody></table></div>
          <div class="pie-tabla">
            <span>Mostrando {{ reservasFiltradas.length ? (paginaReservas - 1) * serviciosPorPagina + 1 : 0 }} - {{ Math.min(paginaReservas * serviciosPorPagina, reservasFiltradas.length) }} de {{ reservasFiltradas.length }} reservas</span>
            <nav class="paginacion" aria-label="Paginación de reservas">
              <button type="button" aria-label="Página anterior" :disabled="paginaReservas === 1" @click="paginaReservas--">‹</button>
              <button v-for="pagina in paginasReservasVisibles" :key="pagina" type="button" :class="{ activa: paginaReservas === pagina }" :aria-label="`Página ${pagina}`" @click="paginaReservas = pagina">{{ pagina }}</button>
              <button type="button" aria-label="Página siguiente" :disabled="paginaReservas === totalPaginasReservas" @click="paginaReservas++">›</button>
            </nav>
          </div>
        </section>

        <section v-else class="panel-tabla" aria-label="Usuarios">
          <div class="tabla-titulo"><div><h2>Usuarios del sistema</h2><p>Clientes, empleados y administradores del gastrobar.</p></div><span>{{ props.users.length }} usuarios</span></div>
          <div v-if="!usuariosFiltrados.length" class="vacio">{{ props.users.length ? 'No se encontraron usuarios con esta búsqueda.' : 'Todavía no hay cuentas registradas.' }}</div>
          <div v-else class="tabla-contenedor"><table><thead><tr><th>ID</th><th>Nombre</th><th>Correo electrónico</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
            <tr v-for="(usuario, indice) in usuariosPaginados" :key="usuario.id"><td>{{ (paginaUsuarios - 1) * serviciosPorPagina + indice + 1 }}</td><td><div class="producto"><span class="sin-foto">{{ iniciales(usuario.nombre) }}</span><strong>{{ usuario.nombre }}</strong></div></td><td>{{ usuario.correo }}</td><td><span class="etiqueta-categoria" :class="`rol-${usuario.rol}`">{{ etiquetaRol(usuario.rol) }}</span></td><td><span class="etiqueta-categoria" :class="usuario.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'">{{ usuario.estado }}</span></td><td><div class="acciones"><button type="button" aria-label="Editar usuario" :disabled="usuario.correo === props.user?.email" @click="editarCuenta(usuario)">Editar</button><button type="button" class="eliminar" aria-label="Eliminar usuario" :disabled="usuario.correo === props.user?.email" @click="eliminarCuenta(usuario)">Eliminar</button></div></td></tr>
          </tbody></table></div>
          <div class="pie-tabla">
            <span>Mostrando {{ usuariosFiltrados.length ? (paginaUsuarios - 1) * serviciosPorPagina + 1 : 0 }} - {{ Math.min(paginaUsuarios * serviciosPorPagina, usuariosFiltrados.length) }} de {{ usuariosFiltrados.length }} usuarios</span>
            <nav class="paginacion" aria-label="Paginación de usuarios">
              <button type="button" aria-label="Página anterior" :disabled="paginaUsuarios === 1" @click="paginaUsuarios--">‹</button>
              <button v-for="pagina in paginasUsuariosVisibles" :key="pagina" type="button" :class="{ activa: paginaUsuarios === pagina }" :aria-label="`Página ${pagina}`" @click="paginaUsuarios = pagina">{{ pagina }}</button>
              <button type="button" aria-label="Página siguiente" :disabled="paginaUsuarios === totalPaginasUsuarios" @click="paginaUsuarios++">›</button>
            </nav>
          </div>
        </section>
      </div>
    </section>

    <div v-if="modalAbierto" class="capa-modal" @click.self="modalAbierto = false" @keydown.esc="modalAbierto = false">
      <form class="formulario-modal" @submit.prevent="guardar"><div class="cabecera-modal"><div><p class="sobre-titulo">ADMINISTRACIÓN DEL MENÚ</p><h2>{{ idEditando === null ? 'Agregar servicio' : 'Editar servicio' }}</h2></div><button type="button" class="cerrar-modal" @click="modalAbierto = false">Cerrar</button></div>
        <div class="campos"><label>Nombre del plato o bebida<input v-model="formulario.nombre" type="text" placeholder="Ejemplo: Limonada de mango" required></label><label>Categoría<select v-model="formulario.categoria"><option value="Comidas">Comidas</option><option value="Cocteles">Cócteles</option><option value="Botellas">Botellas</option></select></label><label>Precio en pesos colombianos<input v-model="formulario.precio" type="number" min="1" step="1000" placeholder="22000" required></label><label>Ingredientes separados por coma<input v-model="formulario.ingredientes" type="text" placeholder="Limón, hierbabuena, soda" required></label><label class="ancho-completo">Descripción<textarea v-model="formulario.descripcion" rows="3" placeholder="Describe el producto para el menú"></textarea></label><label class="ancho-completo">Foto del producto<input type="file" accept="image/*" @change="seleccionarFoto"><small>Selecciona una imagen desde tu computador.</small></label><div v-if="formulario.foto" class="vista-previa ancho-completo"><img :src="formulario.foto" alt="Vista previa del producto"><span>Vista previa de la foto</span></div></div>
        <p v-if="aviso" class="aviso" role="status">{{ aviso }}</p><div class="acciones-modal"><button class="boton-secundario" type="button" @click="modalAbierto = false">Cancelar</button><button class="boton-agregar" type="submit">{{ idEditando === null ? 'Guardar servicio' : 'Guardar cambios' }}</button></div>
      </form>
    </div>

    <div v-if="modalUsuarioAbierto" class="capa-modal" @click.self="modalUsuarioAbierto = false" @keydown.esc="modalUsuarioAbierto = false">
      <form class="formulario-modal" @submit.prevent="guardarCuenta">
        <div class="cabecera-modal"><div><p class="sobre-titulo">ADMINISTRACIÓN DE USUARIOS</p><h2>{{ idUsuarioEditando === null ? 'Agregar usuario' : 'Editar usuario' }}</h2></div><button type="button" class="cerrar-modal" @click="modalUsuarioAbierto = false">Cerrar</button></div>
        <div class="campos">
          <label>Nombre completo<input v-model="formularioUsuario.nombre" type="text" autocomplete="name" required></label>
          <label>Correo electrónico<input v-model="formularioUsuario.correo" type="email" autocomplete="email" required></label>
          <label>Rol<select v-model="formularioUsuario.rol"><option value="customer">Cliente</option><option value="employee">Empleado</option><option value="admin">Administrador</option></select></label>
          <label>Estado<select v-model="formularioUsuario.estado"><option>Activo</option><option>Inactivo</option></select></label>
        </div>
        <p v-if="avisoUsuario" class="aviso" role="alert">{{ avisoUsuario }}</p>
        <div class="acciones-modal"><button class="boton-secundario" type="button" @click="modalUsuarioAbierto = false">Cancelar</button><button class="boton-agregar" type="submit">{{ idUsuarioEditando === null ? 'Agregar usuario' : 'Guardar cambios' }}</button></div>
      </form>
    </div>

    <div v-if="productoPorEliminar" class="capa-modal" @click.self="productoPorEliminar = null" @keydown.esc="productoPorEliminar = null">
      <section class="confirmacion-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirmacion-titulo" aria-describedby="confirmacion-descripcion">
        <p class="sobre-titulo">CONFIRMAR ELIMINACIÓN</p>
        <h2 id="confirmacion-titulo">¿Estás seguro?</h2>
        <p id="confirmacion-descripcion">Se eliminará el producto <strong>{{ productoPorEliminar.nombre }}</strong> del menú. Esta acción no se puede deshacer.</p>
        <div class="acciones-modal">
          <button class="boton-secundario" type="button" @click="productoPorEliminar = null">Cancelar</button>
          <button class="boton-eliminar-confirmado" type="button" @click="confirmarEliminacion">Sí, eliminar</button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
* {
  box-sizing: border-box;
}

.admin-servicios {
  display: flex;
  min-height: 100vh;
  background: #08070b;
  color: #f4efe8;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.barra-lateral {
  position: sticky;
  top: 0;
  display: flex;
  flex: 0 0 245px;
  flex-direction: column;
  min-height: 100vh;
  padding: 30px 16px 20px;
  border-right: 1px solid rgba(225, 186, 125, .12);
  background: #111014;
}

.marca {
  display: block;
  margin: 0 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #f6f0e7;
  font: 600 23px 'Playfair Display', serif;
  letter-spacing: 1px;
  text-align: left;
  cursor: pointer;
}

.submarca {
  margin: 7px 12px 34px;
  color: #d7aa70;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.navegacion {
  display: grid;
  gap: 7px;
}

.navegacion button,
.salir {
  width: 100%;
  padding: 13px 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #c8c0b4;
  text-align: left;
  font: 500 13px 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
}

.navegacion button:hover,
.navegacion button.activo {
  background: rgba(215, 170, 112, .14);
  color: #f6f0e7;
}

.navegacion button.activo {
  box-shadow: inset 3px 0 #d7aa70;
}

.perfil {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: auto;
  padding: 20px 7px 12px;
  border-top: 1px solid rgba(255, 255, 255, .12);
}

.avatar {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: #d7aa70;
  color: #211b13;
  font-weight: 700;
}

.perfil strong,
.perfil small {
  display: block;
}

.perfil strong {
  font-size: 12px;
}

.perfil small {
  margin-top: 4px;
  color: #a89f92;
  font-size: 10px;
}

.salir {
  padding-left: 7px;
  font-size: 11px;
}

.zona-principal {
  min-width: 0;
  flex: 1;
  background: radial-gradient(ellipse at 86% 0, rgba(90, 45, 130, .12), transparent 34%), #08070b;
}

.barra-superior {
  display: flex;
  height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 clamp(22px, 4vw, 58px);
  border-bottom: 1px solid rgba(255, 255, 255, .1);
  background: rgba(17, 16, 20, .88);
}

.buscador {
  display: flex;
  width: min(550px, 70%);
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 7px;
  background: rgba(255, 255, 255, .045);
  color: #d7aa70;
  font-size: 12px;
}

.buscador > span {
  font-size: 20px;
}

.buscador input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f4efe8;
  font: inherit;
}

.buscador input::placeholder {
  color: #918981;
}

.marca-superior {
  color: #d7aa70;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.contenido {
  width: min(1450px, 100%);
  margin: auto;
  padding: 38px clamp(22px, 4vw, 58px) 62px;
}

.encabezado-pagina {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.sobre-titulo {
  margin: 0 0 8px;
  color: #d7aa70;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
}

.encabezado-pagina h1,
.cabecera-modal h2 {
  margin: 0;
  color: #f6f0e7;
  font: 500 34px 'Playfair Display', Georgia, serif;
}

.descripcion-pagina {
  margin: 8px 0 0;
  color: #aaa29a;
  font-size: 13px;
}

.boton-agregar {
  flex: 0 0 auto;
  padding: 12px 18px;
  border: 1px solid #d7aa70;
  border-radius: 7px;
  background: #d7aa70;
  color: #211b13;
  font: 600 12px 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
}

.boton-agregar:hover {
  border-color: #e5bb7b;
  background: transparent;
  color: #e5bb7b;
}

.panel-tabla {
  overflow: hidden;
  padding: 20px 20px 0;
  border: 1px solid rgba(225, 186, 125, .16);
  border-radius: 9px;
  background: rgba(255, 255, 255, .035);
}

.tabla-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 18px;
}

.tabla-titulo h2 {
  margin: 0;
  color: #f4efe8;
  font: 600 19px 'Playfair Display', Georgia, serif;
}

.tabla-titulo p {
  margin: 5px 0 0;
  color: #aaa29a;
  font-size: 11px;
}

.tabla-titulo > span {
  color: #a79d92;
  font-size: 11px;
}

.filtro-estado {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #bdb4a9;
  font-size: 11px;
}

.filtro-estado select {
  padding: 9px 10px;
  border: 1px solid rgba(255, 255, 255, .16);
  border-radius: 7px;
  background: #141116;
  color: #f4efe8;
  font: 11px 'Plus Jakarta Sans', sans-serif;
}

.tabla-contenedor {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 12px;
}

th {
  padding: 13px 12px;
  border-top: 1px solid rgba(255, 255, 255, .12);
  border-bottom: 1px solid rgba(255, 255, 255, .12);
  color: #d7aa70;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .5px;
}

td {
  padding: 13px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, .08);
  color: #d6d0c8;
}

tbody tr:hover {
  background: rgba(255, 255, 255, .025);
}

.producto {
  display: flex;
  min-width: 190px;
  align-items: center;
  gap: 11px;
}

.producto img,
.sin-foto {
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  border-radius: 6px;
  object-fit: cover;
}

.sin-foto {
  display: grid;
  place-items: center;
  background: rgba(215, 170, 112, .14);
  color: #e5bb7b;
  font: 600 17px 'Playfair Display', serif;
}

.producto strong,
.producto small {
  display: block;
}

.producto strong {
  color: #f4efe8;
  font-size: 12px;
}

.producto small {
  max-width: 330px;
  margin-top: 4px;
  overflow: hidden;
  color: #a79d92;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.etiqueta-categoria {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 5px;
  background: rgba(215, 170, 112, .14);
  color: #e5bb7b;
  font-size: 10px;
}

.etiqueta-categoria.estado-pendiente {
  background: rgba(196, 136, 56, .18);
  color: #f0c985;
}

.etiqueta-categoria.estado-confirmada,
.etiqueta-categoria.estado-activo {
  background: rgba(43, 139, 98, .2);
  color: #8ce0b5;
}

.etiqueta-categoria.estado-cancelada,
.etiqueta-categoria.estado-inactivo {
  background: rgba(166, 59, 59, .2);
  color: #f3a2a2;
}

.etiqueta-categoria.rol-customer {
  background: rgba(73, 130, 212, .18);
  color: #9dc5ff;
}

.etiqueta-categoria.rol-employee {
  background: rgba(146, 97, 207, .18);
  color: #c9a5ff;
}

.etiqueta-categoria.rol-admin {
  background: rgba(166, 59, 59, .2);
  color: #f3a2a2;
}

.acciones {
  display: flex;
  gap: 7px;
}

.acciones button {
  padding: 6px 7px;
  border: 1px solid rgba(215, 170, 112, .25);
  border-radius: 5px;
  background: transparent;
  color: #e5bb7b;
  font: 500 10px 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
}

.acciones button:hover {
  background: rgba(215, 170, 112, .12);
}

.acciones button.eliminar {
  border-color: rgba(243, 162, 162, .25);
  color: #f3a2a2;
}

.acciones button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.vacio {
  padding: 28px;
  color: #a79d92;
  text-align: center;
  font-size: 12px;
}

.pie-tabla {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 15px 12px;
  color: #a79d92;
  font-size: 10px;
}

.paginacion {
  display: flex;
  align-items: center;
  gap: 6px;
}

.paginacion button {
  display: grid;
  min-width: 32px;
  height: 32px;
  place-items: center;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 7px;
  background: transparent;
  color: #d6d0c8;
  font: 11px 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
}

.paginacion button.activa {
  border-color: #d7aa70;
  background: #d7aa70;
  color: #211b13;
  font-weight: 700;
}

.paginacion button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.capa-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(8, 7, 11, .82);
  backdrop-filter: blur(4px);
}

.formulario-modal {
  width: min(680px, 100%);
  max-height: 92vh;
  overflow: auto;
  padding: 25px;
  border: 1px solid rgba(225, 186, 125, .16);
  border-radius: 10px;
  background: #141116;
  box-shadow: 0 25px 80px #0005;
}

.confirmacion-modal {
  width: min(440px, 100%);
  padding: 26px;
  border: 1px solid rgba(225, 186, 125, .2);
  border-radius: 10px;
  background: #141116;
  box-shadow: 0 25px 80px #0005;
}

.confirmacion-modal h2 {
  margin: 0;
  color: #f6f0e7;
  font: 500 25px 'Playfair Display', Georgia, serif;
}

.confirmacion-modal > p:not(.sobre-titulo) {
  margin: 12px 0 0;
  color: #c8c0b4;
  font-size: 13px;
  line-height: 1.7;
}

.confirmacion-modal strong {
  color: #f4efe8;
}

.boton-eliminar-confirmado {
  padding: 10px 15px;
  border: 1px solid #a63b3b;
  border-radius: 5px;
  background: #a63b3b;
  color: #fff;
  font: 600 11px 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
}

.boton-eliminar-confirmado:hover {
  border-color: #c55454;
  background: #c55454;
}

.cabecera-modal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.cabecera-modal h2 {
  font-size: 26px;
}

.cerrar-modal,
.boton-secundario {
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 5px;
  background: transparent;
  color: #d6d0c8;
  font: 500 11px 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
}

.campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.campos label {
  display: grid;
  gap: 7px;
  color: #d8cfc3;
  font-size: 11px;
  font-weight: 600;
}

.campos input,
.campos select,
.campos textarea {
  width: 100%;
  padding: 11px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 5px;
  background: #141116;
  color: #f4efe8;
  font: 400 12px 'Plus Jakarta Sans', sans-serif;
}

.campos input[type='file'] {
  padding: 8px;
}

.campos textarea {
  resize: vertical;
}

.campos small {
  color: #a79d92;
  font-weight: 400;
}

.ancho-completo {
  grid-column: 1 / -1;
}

.vista-previa {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #a79d92;
  font-size: 11px;
}

.vista-previa img {
  width: 76px;
  height: 65px;
  border-radius: 5px;
  object-fit: cover;
}

.aviso {
  margin: 14px 0 0;
  color: #e5bb7b;
  font-size: 11px;
}

.acciones-modal {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.acciones-modal .boton-agregar {
  padding: 10px 15px;
}

@media (max-width: 760px) {
  .barra-lateral {
    flex-basis: 190px;
    padding: 24px 10px;
  }

  .marca {
    font-size: 19px;
  }

  .contenido {
    padding-top: 28px;
  }

  .encabezado-pagina {
    align-items: flex-start;
    flex-direction: column;
  }

  .boton-agregar {
    align-self: flex-start;
  }
}

@media (max-width: 560px) {
  .admin-servicios {
    display: block;
  }

  .barra-lateral {
    position: static;
    min-height: auto;
    padding: 15px;
  }

  .marca {
    margin: 0;
  }

  .submarca {
    margin: 4px 0 12px;
  }

  .navegacion {
    display: flex;
    overflow: auto;
  }

  .navegacion button {
    width: auto;
    padding: 9px;
    white-space: nowrap;
  }

  .perfil,
  .salir {
    display: none;
  }

  .barra-superior {
    height: 60px;
    padding: 0 15px;
  }

  .buscador {
    width: 100%;
  }

  .marca-superior {
    display: none;
  }

  .contenido {
    padding: 25px 14px 40px;
  }

  .panel-tabla {
    padding: 14px 10px 0;
  }

  .campos {
    grid-template-columns: 1fr;
  }

  .ancho-completo {
    grid-column: 1;
  }

  .pie-tabla {
    align-items: flex-start;
    flex-direction: column;
  }

  .paginacion {
    align-self: flex-end;
  }
}
</style>
