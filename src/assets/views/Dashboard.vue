<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { defaultMenuProducts } from './menuData.js'

const props = defineProps({
  user: { type: Object, default: () => ({}) },
  reservations: { type: Array, default: () => [] },
  users: { type: Array, default: () => [] }
})
const emit = defineEmits(['logout'])
const section = ref('reservas')
const query = ref('')
const statusFilter = ref('Todas')
const page = ref(1)
const pageSize = 5
const productKey = 'gastrobar-admin-products'
const products = ref([])
const form = ref(emptyForm())
const editingId = ref(null)
const productFormSection = ref(null)
const notice = ref('')
const pendingDelete = ref(null)

function emptyForm() { return { name: '', category: 'Bebida', price: '', description: '', ingredients: '', image: '' } }
function loadProducts() {
  try {
    const saved = localStorage.getItem(productKey)
    products.value = saved === null ? defaultMenuProducts.map(item => ({ ...item, category: item.categoryType === 'comida' ? 'Comida' : 'Bebida' })) : JSON.parse(saved)
  } catch { products.value = defaultMenuProducts.map(item => ({ ...item, category: item.categoryType === 'comida' ? 'Comida' : 'Bebida' })) }
}
function saveProducts() {
  try { localStorage.setItem(productKey, JSON.stringify(products.value)); return true }
  catch { notice.value = 'No se pudo guardar. Prueba con una imagen m\u00e1s peque\u00f1a.'; return false }
}
function saveProduct() {
  notice.value = ''
  if (!form.value.name.trim() || !form.value.price.trim()) { notice.value = 'Completa el nombre y el precio.'; return }
  const action = editingId.value !== null ? 'actualizado' : 'agregado'
  const existing = products.value.find(item => item.id === editingId.value)
  const categoryType = form.value.category === 'Comida' ? 'comida' : 'bebida'
  const product = {
    ...existing,
    ...form.value,
    id: editingId.value ?? Date.now(),
    categoryType,
    categoryLabel: form.value.category.toLocaleUpperCase('es'),
    ingredients: form.value.ingredients.split(',').map(item => item.trim()).filter(Boolean),
    clubName: 'GASTROBAR',
    flyerSubtitle: form.value.category.toLocaleUpperCase('es'),
    flyerTagline: form.value.description || 'Producto de la casa',
    cardImage: form.value.image || existing?.cardImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85',
    bottleImage: form.value.image || existing?.bottleImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85',
    flyerGlass: existing?.flyerGlass || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80'
  }
  if (editingId.value !== null) products.value = products.value.map(item => item.id === editingId.value ? product : item)
  else products.value.unshift(product)
  if (!saveProducts()) return
  cancelEdit()
  notice.value = `Producto ${action} correctamente.`
}
function editProduct(product) {
  notice.value = ''
  editingId.value = product.id
  form.value = {
    name: product.name || '',
    category: product.category || (product.categoryType === 'comida' ? 'Comida' : 'Bebida'),
    price: product.price || '',
    description: product.description || '',
    ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
    image: product.cardImage || ''
  }
  nextTick(() => productFormSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
function deleteProduct(id) {
  pendingDelete.value = products.value.find(item => item.id === id) || null
}
function confirmDelete() {
  if (!pendingDelete.value) return
  products.value = products.value.filter(item => item.id !== pendingDelete.value.id)
  if (!saveProducts()) { pendingDelete.value = null; return }
  notice.value = 'Producto eliminado correctamente.'
  pendingDelete.value = null
}
function cancelEdit() { editingId.value = null; form.value = emptyForm() }
function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { notice.value = 'Selecciona un archivo de imagen.'; return }
  const reader = new FileReader()
  reader.onerror = () => { notice.value = 'No se pudo leer la imagen seleccionada.' }
  reader.onload = () => {
    const image = new Image()
    image.onerror = () => { notice.value = 'No se pudo abrir la imagen seleccionada.' }
    image.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      form.value.image = canvas.toDataURL('image/jpeg', 0.82)
      notice.value = 'Imagen cargada. Guarda los cambios para aplicarla.'
    }
    image.src = reader.result
  }
  reader.readAsDataURL(file)
}
const filteredReservations = computed(() => {
  const term = query.value.trim().toLocaleLowerCase('es')
  return props.reservations.filter(item => {
    const matchesTerm = !term || `${item.customer || ''} ${item.email || ''}`.toLocaleLowerCase('es').includes(term)
    const matchesStatus = statusFilter.value === 'Todas' || item.status === statusFilter.value
    return matchesTerm && matchesStatus
  })
})
const pageCount = computed(() => Math.max(1, Math.ceil(filteredReservations.value.length / pageSize)))
const pagedReservations = computed(() => filteredReservations.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const visibleUsers = computed(() => props.users)
const pendingCount = computed(() => props.reservations.filter(item => item.status === 'Pendiente').length)
const confirmedCount = computed(() => props.reservations.filter(item => item.status === 'Confirmada').length)
watch([query, statusFilter], () => { page.value = 1 })
watch(pageCount, value => { if (page.value > value) page.value = value })
function setStatus(reservation, status) {
  reservation.status = status
  localStorage.setItem('gastrobar-reservations', JSON.stringify(props.reservations))
}
function goTo(name) { section.value = name; query.value = ''; page.value = 1 }
loadProducts()
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-brand"><strong>GASTROBAR</strong><span>Panel de administraci&oacute;n</span></div>
      <nav class="admin-sections" aria-label="Secciones administrativas">
        <button type="button" :class="{ active: section === 'productos' }" @click="goTo('productos')">Productos</button>
        <button type="button" :class="{ active: section === 'reservas' }" @click="goTo('reservas')">Reservas</button>
        <button type="button" :class="{ active: section === 'usuarios' }" @click="goTo('usuarios')">Usuarios</button>
      </nav>
      <div class="admin-sidebar-account">
        <div class="admin-avatar">{{ (props.user?.name || 'A').slice(0, 1).toUpperCase() }}</div>
        <div><strong>{{ props.user?.name || 'Administrador' }}</strong><span>Administrador</span></div>
        <button type="button" class="admin-logout" @click="emit('logout')">Cerrar sesi&oacute;n</button>
      </div>
    </aside>

    <div class="admin-main-column">
      <header class="admin-toolbar">
        <label v-if="section === 'reservas'" class="admin-search"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="m16 16 4 4"></path></svg><input v-model="query" type="search" placeholder="Buscar reservas por cliente o correo" aria-label="Buscar reservas por cliente o correo"></label>
        <div v-else class="admin-toolbar-spacer"></div>
        <span class="admin-toolbar-brand">GASTROBAR</span>
      </header>

      <main class="admin-content">
        <template v-if="section === 'reservas'">
          <p class="admin-eyebrow">PANEL DE ADMINISTRACI&Oacute;N</p>
          <h1>Reservas</h1>
          <p class="admin-lead">Consulta las solicitudes y actualiza el estado de las reservas.</p>
          <section class="admin-stats" aria-label="Resumen de reservas">
            <article><span>Total</span><strong>{{ props.reservations.length }}</strong></article>
            <article><span>Pendientes</span><strong>{{ pendingCount }}</strong></article>
            <article><span>Confirmadas</span><strong>{{ confirmedCount }}</strong></article>
          </section>
          <section class="admin-reservation-panel">
            <div class="admin-panel-heading"><div><h2>Reservas registradas</h2><p>Revisa las solicitudes y actualiza su estado.</p></div>
              <label class="admin-filter">Estado<select v-model="statusFilter"><option>Todas</option><option>Pendiente</option><option>Confirmada</option><option>Cancelada</option></select></label>
            </div>
            <div v-if="!filteredReservations.length" class="admin-empty">No hay reservas que coincidan con la b&uacute;squeda.</div>
            <div v-else class="admin-table-wrap"><table class="admin-table">
              <thead><tr><th>Cliente</th><th>Fecha</th><th>Hora</th><th>Personas</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody><tr v-for="reservation in pagedReservations" :key="reservation.id">
                <td><strong>{{ reservation.customer }}</strong><small>{{ reservation.email }}</small></td><td>{{ reservation.date }}</td><td>{{ reservation.time }}</td><td>{{ reservation.guests }}</td>
                <td><span class="reservation-status" :class="reservation.status.toLowerCase()">{{ reservation.status }}</span></td>
                <td class="admin-actions"><button type="button" @click="setStatus(reservation, 'Confirmada')">Confirmar</button><button type="button" @click="setStatus(reservation, 'Cancelada')">Cancelar</button></td>
              </tr></tbody>
            </table></div>
            <footer class="admin-pagination"><span>Mostrando {{ filteredReservations.length ? (page - 1) * pageSize + 1 : 0 }} - {{ Math.min(page * pageSize, filteredReservations.length) }} de {{ filteredReservations.length }} reservas</span>
              <div><button type="button" :disabled="page <= 1" aria-label="P&aacute;gina anterior" @click="page--">&#8249;</button><span>{{ page }}</span><button type="button" :disabled="page >= pageCount" aria-label="P&aacute;gina siguiente" @click="page++">&#8250;</button></div>
            </footer>
          </section>
        </template>

        <template v-else-if="section === 'productos'">
          <p class="admin-eyebrow">PANEL DE ADMINISTRACI&Oacute;N</p><h1>Productos</h1>
          <p class="admin-lead">Agrega y actualiza los productos del cat&aacute;logo.</p>
          <section ref="productFormSection" class="admin-reservation-panel">
            <div class="admin-panel-heading"><div><h2>{{ editingId === null ? 'Agregar producto' : 'Editar producto' }}</h2><p>Completa los datos del producto.</p></div></div>
            <form class="admin-product-form" @submit.prevent="saveProduct">
              <label>Nombre<input v-model="form.name" required maxlength="80"></label>
              <label>Tipo<select v-model="form.category"><option>Bebida</option><option>Comida</option><option>Botella</option><option>Botella</option></select></label>
              <label>Precio<input v-model="form.price" required placeholder="$ 25.000 COP"></label>
              <label class="form-wide">Subir imagen desde el dispositivo<input type="file" accept="image/*" @change="handleImageUpload"></label>
              <img v-if="form.image" class="admin-product-preview" :src="form.image" alt="Vista previa del producto">
              <p v-if="notice" class="admin-feedback" role="status">{{ notice }}</p>
              <label class="form-wide">Descripci&oacute;n<textarea v-model="form.description" rows="2"></textarea></label>
              <label class="form-wide">Ingredientes<textarea v-model="form.ingredients" rows="2"></textarea></label>
              <div class="admin-form-actions"><button type="submit">{{ editingId === null ? 'Agregar producto' : 'Guardar cambios' }}</button><button v-if="editingId !== null" type="button" @click="cancelEdit">Cancelar</button></div>
            </form>
            <div v-if="!products.length" class="admin-empty">Todav&iacute;a no hay productos. Agrega el primero con el formulario.</div>
            <div v-else class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Producto</th><th>Tipo</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>
              <tr v-for="product in products" :key="product.id"><td><strong>{{ product.name }}</strong><small>{{ product.description }}</small></td><td>{{ product.category }}</td><td>{{ product.price }}</td><td class="admin-actions"><button type="button" @click="editProduct(product)">Editar</button><button type="button" @click="deleteProduct(product.id)">Eliminar</button></td></tr>
            </tbody></table></div>
          </section>
        </template>

        <template v-else>
          <p class="admin-eyebrow">PANEL DE ADMINISTRACI&Oacute;N</p><h1>Usuarios</h1>
          <p class="admin-lead">Consulta las cuentas registradas en esta sesi&oacute;n.</p>
          <section class="admin-reservation-panel"><div class="admin-panel-heading"><div><h2>Usuarios registrados</h2><p>{{ visibleUsers.length }} usuarios</p></div></div>
            <div v-if="!visibleUsers.length" class="admin-empty">Todav&iacute;a no hay usuarios registrados.</div>
            <div v-else class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Nombre</th><th>Correo electr&oacute;nico</th><th>Rol</th><th>Estado</th></tr></thead><tbody>
              <tr v-for="(account, index) in visibleUsers" :key="account.email || index"><td><strong>{{ account.name || 'Sin nombre' }}</strong></td><td>{{ account.email }}</td><td>{{ account.role === 'admin' ? 'Administrador' : 'Cliente' }}</td><td><span class="reservation-status confirmada">Activo</span></td></tr>
            </tbody></table></div>
          </section>
        </template>
      </main>
    </div>
    <div v-if="pendingDelete" class="admin-confirm-overlay" @click.self="pendingDelete = null" @keydown.esc="pendingDelete = null">
      <section class="admin-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <div class="admin-confirm-mark" aria-hidden="true">!</div>
        <p class="admin-eyebrow">CONFIRMAR ACCI&Oacute;N</p>
        <h2 id="delete-title">Eliminar producto</h2>
        <p id="delete-description">&iquest;Seguro que deseas eliminar <strong>{{ pendingDelete.name }}</strong>? Esta acci&oacute;n no se puede deshacer.</p>
        <div class="admin-confirm-actions">
          <button type="button" class="admin-confirm-cancel" @click="pendingDelete = null">Cancelar</button>
          <button type="button" class="admin-confirm-delete" @click="confirmDelete">S&iacute;, eliminar</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-confirm-overlay{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.76);backdrop-filter:blur(5px)}
.admin-confirm-dialog{width:min(440px,100%);padding:30px;border:1px solid rgba(225,186,125,.25);border-radius:16px;background:#151217;box-shadow:0 24px 80px #000b;text-align:center}
.admin-confirm-mark{width:46px;height:46px;margin:0 auto 18px;display:grid;place-items:center;border:1px solid rgba(224,148,113,.35);border-radius:50%;background:rgba(170,68,54,.12);color:#e7957d;font:600 22px Georgia,serif}
.admin-confirm-dialog .admin-eyebrow{margin-bottom:8px}.admin-confirm-dialog h2{margin:0;color:#f6f0e7;font:500 26px 'Playfair Display',Georgia,serif}.admin-confirm-dialog>p:not(.admin-eyebrow){margin:12px 0 24px;color:#bdb4a9;font-size:14px;line-height:1.7}.admin-confirm-dialog strong{color:#f4efe8}
.admin-confirm-actions{display:flex;justify-content:center;gap:12px}.admin-confirm-actions button{min-width:130px;padding:12px 16px;border-radius:8px;font:600 13px 'Plus Jakarta Sans',sans-serif;cursor:pointer}.admin-confirm-cancel{border:1px solid #ffffff30;background:transparent;color:#f4efe8}.admin-confirm-delete{border:1px solid #a64e43;background:#9e4238;color:#fff}
.admin-layout{min-height:100vh;display:grid;grid-template-columns:308px minmax(0,1fr);background:#09080c;color:#f4efe8;font-family:'Plus Jakarta Sans',sans-serif}
.admin-sidebar{position:sticky;top:0;height:100vh;padding:40px 20px 24px 30px;display:flex;flex-direction:column;border-right:1px solid rgba(225,186,125,.18);background:#100e12}
.admin-brand{display:flex;flex-direction:column;gap:7px;padding:0 16px}.admin-brand strong{font:500 29px 'Playfair Display',Georgia,serif;color:#f6f0e7}.admin-brand span{font:700 10px 'Montserrat',sans-serif;letter-spacing:2px;text-transform:uppercase;color:#d7aa70}
.admin-sections{display:grid;gap:8px;margin-top:48px}.admin-sections button{padding:17px 15px;text-align:left;border:0;border-radius:9px;background:transparent;color:#e8ded1;font:inherit;cursor:pointer}.admin-sections button.active{background:#302820;box-shadow:inset 4px 0 #d7aa70}.admin-sections button:hover{background:#211c19}
.admin-sidebar-account{margin-top:auto;padding:22px 10px 0;border-top:1px solid #ffffff25;display:grid;grid-template-columns:48px 1fr;align-items:center;gap:4px 12px}.admin-avatar{grid-row:span 2;width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#d7aa70;color:#211910;font-size:20px}.admin-sidebar-account strong,.admin-sidebar-account span{display:block}.admin-sidebar-account strong{font-size:14px}.admin-sidebar-account span{margin-top:5px;color:#a79d92;font-size:12px}.admin-logout{grid-column:1/-1;margin-top:18px;padding:10px 0;text-align:left;border:0;background:none;color:#e8ded1;font:inherit;cursor:pointer}
.admin-main-column{min-width:0}.admin-toolbar{height:96px;padding:16px clamp(24px,4vw,54px);display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid #ffffff20}.admin-toolbar-spacer{flex:1}.admin-toolbar-brand{font:700 14px 'Montserrat',sans-serif;letter-spacing:2px;color:#d7aa70}.admin-search{width:min(620px,75%);height:60px;padding:0 18px;display:flex;align-items:center;gap:14px;border:1px solid #ffffff25;border-radius:10px;background:#1b191d;color:#e6b96f}.admin-search input{width:100%;border:0;outline:0;background:transparent;color:#f4efe8;font:inherit}.admin-search input::placeholder{color:#a79d92}
.admin-content{width:min(1120px,calc(100% - 80px));margin:0 auto;padding:48px 0 70px}.admin-eyebrow{margin:0 0 12px;color:#d7aa70;font:700 10px 'Montserrat',sans-serif;letter-spacing:2.6px}.admin-content h1{margin:0;color:#f6f0e7;font:400 clamp(34px,5vw,54px) 'Playfair Display',Georgia,serif}.admin-lead{margin:12px 0 30px;color:#c0b6ab;font-size:15px;line-height:1.7}
.admin-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:28px 0}.admin-stats article,.admin-reservation-panel{border:1px solid rgba(225,186,125,.18);border-radius:14px;background:#100e12}.admin-stats article{display:flex;flex-direction:column;gap:8px;padding:20px}.admin-stats article span,.admin-panel-heading p{color:#a79d92;font-size:12px}.admin-stats article strong{color:#e2b878;font:500 30px 'Playfair Display',Georgia,serif}.admin-reservation-panel{padding:24px;overflow:hidden}.admin-panel-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}.admin-panel-heading h2{margin:0 0 6px;font:500 22px 'Playfair Display',Georgia,serif}.admin-panel-heading p{margin:0}.admin-filter{display:flex;align-items:center;gap:10px;color:#bdb4a9;font-size:12px}.admin-filter select,.admin-product-form input,.admin-product-form select,.admin-product-form textarea{border:1px solid #ffffff25;border-radius:8px;background:#141116;color:#f5f0e9;padding:11px 12px;font:inherit}.admin-table-wrap{overflow-x:auto}.admin-table{width:100%;border-collapse:collapse;text-align:left;font-size:13px}.admin-table th{padding:12px;color:#d4a867;font:700 10px 'Montserrat',sans-serif;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #ffffff20}.admin-table td{padding:14px 12px;border-bottom:1px solid #ffffff12;color:#d6d0c8}.admin-table td small{display:block;margin-top:5px;color:#918981}.admin-actions{white-space:nowrap}.admin-actions button{margin-right:7px;border:0;background:transparent;color:#e5bb7b;cursor:pointer;font:inherit;font-size:12px}.admin-empty{padding:44px 12px;text-align:center;color:#b7ada2;font-size:14px}.admin-pagination{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:18px;color:#aaa29a;font-size:12px}.admin-pagination div{display:flex;align-items:center;gap:8px}.admin-pagination button,.admin-pagination div span{width:40px;height:40px;display:grid;place-items:center;border:1px solid #ffffff20;border-radius:9px;background:transparent;color:#e8ded1;font:inherit}.admin-pagination div span{background:#d7aa70;color:#211910}.admin-pagination button:disabled{opacity:.35;cursor:not-allowed}
.admin-product-preview{grid-column:1/-1;width:min(260px,100%);height:180px;object-fit:cover;border:1px solid #ffffff25;border-radius:10px}.admin-feedback{grid-column:1/-1;margin:0;color:#e2b878;font-size:13px}
.admin-product-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:24px}.admin-product-form label{display:grid;gap:7px;color:#c0b6ab;font-size:12px}.admin-product-form .form-wide{grid-column:1/-1}.admin-form-actions{grid-column:1/-1;display:flex;gap:10px}.admin-form-actions button{padding:11px 16px;border:0;border-radius:8px;background:#d7aa70;color:#211910;font:600 13px 'Plus Jakarta Sans',sans-serif;cursor:pointer}.admin-form-actions button+button{border:1px solid #ffffff25;background:transparent;color:#f4efe8}
@media(max-width:850px){.admin-layout{grid-template-columns:220px minmax(0,1fr)}.admin-sidebar{padding:28px 14px}.admin-content{width:calc(100% - 40px);padding-top:34px}.admin-stats{grid-template-columns:1fr}}
@media(max-width:620px){.admin-layout{grid-template-columns:1fr}.admin-sidebar{position:relative;height:auto;padding:18px 16px}.admin-brand{padding:0}.admin-sections{grid-template-columns:repeat(3,1fr);margin-top:18px}.admin-sections button{text-align:center;padding:12px 6px}.admin-sidebar-account{display:none}.admin-toolbar{height:74px;padding:12px 16px}.admin-search{width:100%;height:48px}.admin-toolbar-brand{display:none}.admin-content{width:calc(100% - 32px);padding:28px 0}.admin-product-form{grid-template-columns:1fr}.admin-product-form .form-wide{grid-column:auto}.admin-panel-heading{align-items:flex-start;flex-direction:column}.admin-reservation-panel{padding:16px}.admin-pagination{align-items:flex-start;flex-direction:column}}
</style>
