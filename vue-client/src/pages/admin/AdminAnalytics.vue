<template>
  <div class="admin-root">
    <AdminNav />

    <div class="admin-content">
      <div class="page-label">Overview</div>
      <h1>Analytics</h1>

      <div v-if="loading" class="state-loading">
        <div class="skeleton-grid">
          <div v-for="n in 4" :key="n" class="skeleton-stat"></div>
        </div>
        <div class="skeleton-table"></div>
      </div>
      <div v-else-if="error" class="state-msg state-error">{{ error }}</div>

      <template v-else>
        <!-- Summary stats -->
        <div class="stats-grid">
          <div class="stat-card stat-teal">
            <div class="stat-icon">👥</div>
            <div class="stat-num">{{ data.summary.total_workers }}</div>
            <div class="stat-label">Total Workers</div>
          </div>
          <div class="stat-card stat-green">
            <div class="stat-icon">✓</div>
            <div class="stat-num">{{ data.summary.available_workers }}</div>
            <div class="stat-label">Available Now</div>
          </div>
          <div class="stat-card stat-orange">
            <div class="stat-icon">📩</div>
            <div class="stat-num">{{ data.summary.total_bookings }}</div>
            <div class="stat-label">Total Inquiries</div>
          </div>
          <div class="stat-card stat-pink">
            <div class="stat-icon">🔔</div>
            <div class="stat-num">{{ data.summary.unread_bookings }}</div>
            <div class="stat-label">Unread</div>
          </div>
        </div>

        <!-- Worker performance table -->
        <div class="section">
          <div class="section-header">
            <h2>Worker Performance</h2>
          </div>
          <div class="table-wrap">
            <table class="perf-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th class="num-th">Views</th>
                  <th class="num-th">Inquiries</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="w in data.per_worker" :key="w.id">
                  <td class="td-name">{{ w.name }}</td>
                  <td><span class="tag tag-cat">{{ w.category }}</span></td>
                  <td>
                    <span :class="['status-pill', w.is_available ? 'pill-available' : 'pill-booked']">
                      <span class="pill-dot"></span>
                      {{ w.is_available ? 'Available' : 'Booked' }}
                    </span>
                  </td>
                  <td class="num-td">{{ w.views ?? 0 }}</td>
                  <td class="num-td">{{ w.inquiries ?? 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bar chart: inquiries last 7 days -->
        <div class="section" v-if="data.daily_bookings?.length">
          <h2>Inquiries — Last 7 Days</h2>
          <div class="chart-wrap">
            <div class="chart-bars">
              <div
                v-for="day in data.daily_bookings"
                :key="day.day"
                class="bar-col"
              >
                <span class="bar-count">{{ day.count }}</span>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{ height: barPct(day.count) + '%' }"
                  ></div>
                </div>
                <span class="bar-label">{{ formatDay(day.day) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { getAnalytics } from '../../services/api.js'

const data = ref(null)
const loading = ref(true)
const error = ref(null)

async function load() {
  try { data.value = await getAnalytics() }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
}

function barPct(count) {
  const max = Math.max(...(data.value?.daily_bookings.map(d => Number(d.count)) || [1]), 1)
  return Math.max(4, (Number(count) / max) * 100)
}

function formatDay(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric' })
}

onMounted(load)
</script>

<style scoped>
.admin-root {
  min-height: 100vh;
  background: #0f1117;
  color: #e8eaf0;
  font-family: 'DM Sans', sans-serif;
}

.admin-content {
  padding: 24px 20px 60px;
  max-width: 860px;
  margin: 0 auto;
}

.page-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(232,234,240,0.35);
  margin-bottom: 4px;
}
h1 { font-size: 1.5rem; font-weight: 700; color: #f0f2f7; margin: 0 0 24px; }
h2 { font-size: 1rem; font-weight: 700; color: rgba(232,234,240,0.7); margin: 0; }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 28px;
}

.stat-card {
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid rgba(255,255,255,0.05);
}
.stat-icon { font-size: 1.2rem; margin-bottom: 4px; }
.stat-num { font-size: 2rem; font-weight: 800; line-height: 1; color: #f0f2f7; }
.stat-label { font-size: 0.75rem; color: rgba(232,234,240,0.4); margin-top: 2px; font-weight: 500; }

.stat-teal   { background: rgba(27,191,191,0.1); border-color: rgba(27,191,191,0.15); }
.stat-green  { background: rgba(37,211,102,0.08); border-color: rgba(37,211,102,0.12); }
.stat-orange { background: rgba(247,148,29,0.1); border-color: rgba(247,148,29,0.15); }
.stat-pink   { background: rgba(233,30,140,0.1); border-color: rgba(233,30,140,0.15); }

/* Sections */
.section { margin-bottom: 28px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }

/* Table */
.table-wrap {
  background: #181c25;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  overflow-x: auto;
}

.perf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  min-width: 480px; /* ensures readable on small screens with scroll */
}

.perf-table th {
  text-align: left;
  padding: 12px 16px;
  background: #1a1e28;
  color: rgba(232,234,240,0.35);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
}
.num-th { text-align: center; }

.perf-table td {
  padding: 13px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
  color: #c8ccda;
}
.perf-table tr:last-child td { border-bottom: none; }
.perf-table tr:hover td { background: rgba(255,255,255,0.02); }

.td-name { font-weight: 600; color: #e8eaf0; }
.num-td { text-align: center; font-weight: 700; color: #f0f2f7; font-size: 0.95rem; }

.tag { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 0.74rem; font-weight: 600; }
.tag-cat { background: rgba(247,148,29,0.12); color: var(--orange); }

.status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 0.76rem; font-weight: 700;
}
.pill-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.pill-available { background: rgba(27,191,191,0.1); color: var(--teal); }
.pill-available .pill-dot { background: var(--teal); }
.pill-booked { background: rgba(233,30,140,0.1); color: var(--pink); }
.pill-booked .pill-dot { background: var(--pink); }

/* Bar chart */
.chart-wrap {
  background: #181c25;
  border-radius: 14px;
  padding: 20px 16px 16px;
  border: 1px solid rgba(255,255,255,0.06);
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
}
.bar-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(232,234,240,0.4);
}
.bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.bar-fill {
  width: 100%;
  background: var(--teal);
  border-radius: 5px 5px 0 0;
  min-height: 4px;
  opacity: 0.8;
  transition: height 0.4s ease;
}
.bar-label {
  font-size: 0.68rem;
  color: rgba(232,234,240,0.3);
  text-align: center;
  white-space: nowrap;
}

/* Skeletons */
.state-loading { display: flex; flex-direction: column; gap: 16px; }
.skeleton-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.skeleton-stat { height: 90px; border-radius: 14px; }
.skeleton-table { height: 200px; border-radius: 14px; }
.skeleton-stat, .skeleton-table {
  background: linear-gradient(90deg, #181c25 25%, #1e2330 50%, #181c25 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.state-msg { text-align: center; padding: 48px 20px; color: rgba(232,234,240,0.35); }
.state-error { color: var(--pink); }

/* Responsive */
@media (max-width: 600px) {
  .admin-content { padding: 16px 14px 60px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
  h1 { font-size: 1.25rem; }
  .stat-num { font-size: 1.6rem; }
}
</style>
