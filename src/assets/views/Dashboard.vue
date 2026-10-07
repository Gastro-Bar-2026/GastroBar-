<template>
  <div class="dashboard-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <div class="brand-mark">G</div>
        <div>
          <p class="brand-label">Gastrobar</p>
          <span class="brand-subtitle">Admin</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button type="button" class="nav-item active">
          <span>Dashboard</span>
        </button>
        <button type="button" class="nav-item">
          <span>Reservas</span>
        </button>
        <button type="button" class="nav-item">
          <span>Menú</span>
        </button>
        <button type="button" class="nav-item">
          <span>Clientes</span>
        </button>
        <button type="button" class="nav-item">
          <span>Reportes</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button type="button" class="logout-btn">Cerrar sesión</button>
      </div>
    </aside>

    <main class="main-panel">
      <header class="topbar">
        <div>
          <p class="eyebrow">Panel principal</p>
          <h1>Dashboard</h1>
        </div>

        <div class="topbar-actions">
          <button type="button" class="ghost-btn">Hoy</button>
          <button type="button" class="primary-btn">Nueva reserva</button>
        </div>
      </header>

      <section class="stats-grid">
        <article v-for="card in stats" :key="card.label" class="stat-card">
          <p>{{ card.label }}</p>
          <h2>{{ card.value }}</h2>
          <span :class="card.trendClass">{{ card.trend }}</span>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel panel-large">
          <div class="panel-header">
            <h3>Actividad reciente</h3>
            <button type="button" class="link-btn">Ver más</button>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recentActivity" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.service }}</td>
                  <td>{{ item.time }}</td>
                  <td>
                    <span :class="['status-pill', item.statusClass]">{{ item.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h3>Resumen</h3>
          </div>

          <div class="summary-list">
            <div v-for="item in summary" :key="item.label" class="summary-item">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  { label: 'Ventas', value: '$8.4K', trend: '+12.5%', trendClass: 'trend positive' },
  { label: 'Reservas', value: '126', trend: '+8.1%', trendClass: 'trend positive' },
  { label: 'Clientes', value: '94', trend: '+3.4%', trendClass: 'trend positive' },
  { label: 'Cancelaciones', value: '7', trend: '-2.0%', trendClass: 'trend negative' }
])

const recentActivity = ref([
  { name: 'María P.', service: 'Cena íntima', time: '18:30', status: 'Confirmada', statusClass: 'confirmed' },
  { name: 'Carlos R.', service: 'Brunch', time: '11:00', status: 'Pendiente', statusClass: 'pending' },
  { name: 'Ana S.', service: 'Cócteles', time: '20:15', status: 'En curso', statusClass: 'active' },
  { name: 'Luis M.', service: 'Cumpleaños', time: '21:00', status: 'Confirmada', statusClass: 'confirmed' }
])

const summary = ref([
  { label: 'Mes actual', value: '74%' },
  { label: 'Satisfacción', value: '96%' },
  { label: 'Productos top', value: '12' },
  { label: 'Mesas ocupadas', value: '18/24' }
])
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: #0d1117;
}

* {
  box-sizing: border-box;
}

.dashboard-shell {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #090d13 0%, #121826 100%);
  color: #edf2ff;
}

.sidebar {
  width: 260px;
  background: rgba(17, 24, 39, 0.95);
  border-right: 1px solid rgba(148, 163, 184, 0.18);
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 20px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #c8a96b, #f2d18d);
  color: #121826;
  font-weight: 800;
}

.brand-label {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.brand-subtitle {
  color: #94a3b8;
  font-size: 0.72rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.nav-item {
  border: none;
  background: transparent;
  color: #dfe7f5;
  text-align: left;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(245, 185, 72, 0.18), rgba(255, 255, 255, 0.04));
  color: #f8e2a8;
  border: 1px solid rgba(245, 185, 72, 0.34);
}

.nav-item:hover {
  background: rgba(148, 163, 184, 0.08);
}

.sidebar-footer {
  margin-top: auto;
}

.logout-btn,
.primary-btn,
.ghost-btn,
.link-btn {
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
}

.logout-btn {
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.08);
  color: #f4f8ff;
}

.main-panel {
  flex: 1;
  padding: 30px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0;
  color: #b7c2d9;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.topbar h1 {
  margin: 8px 0 0;
  font-size: clamp(2rem, 2.5vw, 2.8rem);
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.primary-btn,
.ghost-btn {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
}

.primary-btn {
  background: linear-gradient(135deg, #d9b15c, #f7d79d);
  color: #101827;
}

.ghost-btn {
  background: rgba(148, 163, 184, 0.08);
  color: #edf2ff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.84);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 18px 20px;
}

.stat-card p {
  margin: 0;
  color: #a7b7d8;
}

.stat-card h2 {
  margin: 14px 0 8px;
  font-size: clamp(1.6rem, 2vw, 2.2rem);
}

.trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.trend.positive {
  color: #7ee7b1;
}

.trend.negative {
  color: #f7a7a7;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
}

.panel {
  background: rgba(15, 23, 42, 0.84);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 18px 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.08rem;
}

.link-btn {
  background: transparent;
  color: #f9d78e;
  font-weight: 600;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  color: #e7edf9;
}

th {
  color: #9fb0d1;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 94px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
}

.status-pill.confirmed {
  background: rgba(120, 255, 177, 0.12);
  color: #8ef0b5;
}

.status-pill.pending {
  background: rgba(255, 197, 87, 0.12);
  color: #f8d171;
}

.status-pill.active {
  background: rgba(108, 160, 255, 0.12);
  color: #9dc0ff;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  color: #dfe7f5;
}

.summary-item strong {
  color: #f0d895;
}

@media (max-width: 980px) {
  .dashboard-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  }

  .stats-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
