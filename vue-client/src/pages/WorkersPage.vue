<template>
  <div class="workers-root">

    <!-- Sticky nav -->
    <header class="wp-nav">
      <div class="wp-nav-inner">
        <RouterLink to="/" class="wp-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Home
        </RouterLink>

        <RouterLink to="/" class="wp-brand">Joy<span>Agency</span></RouterLink>

        <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="wp-wa-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </header>

    <!-- Page title -->
    <div class="wp-hero">
      <div class="wp-kicker">Our Team</div>
      <h1>Find your <em>perfect match</em></h1>
      <p>Skilled, vetted domestic professionals across Nairobi</p>
    </div>

    <!-- Sticky filters -->
    <div class="wp-filters">
      <div class="filter-chips">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['filter-btn', { active: selectedCategory === cat }]"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
      <label class="avail-toggle">
        <input type="checkbox" v-model="availableOnly" @change="loadWorkers" />
        <span class="toggle-track">
          <span class="toggle-thumb"></span>
        </span>
        Available only
      </label>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="wp-grid">
      <div v-for="n in 8" :key="n" class="wp-skeleton"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="wp-state">
      <div class="state-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="loadWorkers" class="state-btn">Try again</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!workers.length" class="wp-state">
      <div class="state-icon">🔍</div>
      <p>No workers found for this filter.</p>
      <button @click="resetFilters" class="state-btn">Clear filters</button>
    </div>

    <!-- Worker grid -->
    <div v-else class="wp-grid">
      <RouterLink
        v-for="worker in workers"
        :key="worker.id"
        :to="`/workers/${worker.id}`"
        class="worker-card"
      >
        <div class="card-photo">
          <img v-if="worker.photo_url" :src="worker.photo_url" :alt="worker.name" />
          <div v-else class="card-initials">{{ worker.name.charAt(0) }}</div>
          <span :class="['avail-badge', worker.is_available ? 'badge-yes' : 'badge-no']">
            {{ worker.is_available ? 'Available' : 'Booked' }}
          </span>
        </div>
        <div class="card-body">
          <h3>{{ worker.name }}</h3>
          <span class="card-cat">{{ worker.category }}</span>
          <span class="card-loc" v-if="worker.location">📍 {{ worker.location }}</span>
        </div>
      </RouterLink>
    </div>

    <!-- Footer strip -->
    <div class="wp-footer">
      <RouterLink to="/" class="wp-back wp-back--footer">← Back to Homepage</RouterLink>
      <RouterLink to="/admin/login" class="wp-admin-link">Admin</RouterLink>
    </div>

    <!-- Floating WhatsApp -->
    <a :href="whatsappLink" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWorkers } from '../services/api.js'

const workers    = ref([])
const loading    = ref(true)
const error      = ref(null)
const selectedCategory = ref('All')
const availableOnly    = ref(false)

const whatsappLink = `https://wa.me/254703935838?text=${encodeURIComponent("Hello! I'd like to enquire about one of your workers.")}`
const categories   = ['All', 'Nanny', 'Cleaner', 'Cook', 'Caretaker', 'Gardener', 'Driver', 'Security', 'Other']

async function loadWorkers() {
  loading.value = true
  error.value   = null
  try {
    const filters = {}
    if (selectedCategory.value !== 'All') filters.category = selectedCategory.value
    if (availableOnly.value)              filters.available = 'true'
    workers.value = await getWorkers(filters)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function selectCategory(cat) {
  selectedCategory.value = cat
  loadWorkers()
}

function resetFilters() {
  selectedCategory.value = 'All'
  availableOnly.value    = false
  loadWorkers()
}

onMounted(loadWorkers)
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────────── */
/* .workers-root is declared in global style.css as dark */

/* ── Nav ───────────────────────────────────────────────────── */
.wp-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #0f1117;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.wp-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 52px;
  max-width: 1300px;
  margin: 0 auto;
}

.wp-back {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(240, 242, 247, 0.45);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
  flex-shrink: 0;
}
.wp-back:hover { color: #f0f2f7; }

.wp-brand {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #1BBFBF;
  text-decoration: none;
}
.wp-brand span { color: #F7941D; }

.wp-wa-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(37, 211, 102, 0.1);
  color: #25D366;
  border: 1px solid rgba(37, 211, 102, 0.2);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
  flex-shrink: 0;
}
.wp-wa-btn:hover { background: rgba(37, 211, 102, 0.18); }

/* ── Hero heading ──────────────────────────────────────────── */
.wp-hero {
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem 1.5rem 1.5rem;
}

.wp-kicker {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(240, 242, 247, 0.3);
  margin-bottom: 0.5rem;
}

.wp-hero h1 {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 400;
  color: #f0f2f7;
  line-height: 1.15;
  margin-bottom: 0.5rem;
}
.wp-hero h1 em { font-style: italic; color: #1BBFBF; }

.wp-hero p {
  font-size: 0.92rem;
  color: rgba(240, 242, 247, 0.4);
}

/* ── Filters ───────────────────────────────────────────────── */
.wp-filters {
  position: sticky;
  top: 52px; /* below nav */
  z-index: 40;
  background: #181c25;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 0.85rem 1.5rem;
  max-width: 100%;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.filter-btn {
  padding: 5px 14px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: rgba(240, 242, 247, 0.45);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
  white-space: nowrap;
}
.filter-btn:hover {
  border-color: #1BBFBF;
  color: #1BBFBF;
}
.filter-btn.active {
  background: #1BBFBF;
  border-color: #1BBFBF;
  color: #0f1117;
}

/* Custom toggle switch */
.avail-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(240, 242, 247, 0.5);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.avail-toggle input { display: none; }

.toggle-track {
  width: 36px;
  height: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: background 0.2s, border-color 0.2s;
  flex-shrink: 0;
}
.avail-toggle input:checked ~ .toggle-track {
  background: #1BBFBF;
  border-color: #1BBFBF;
}

.toggle-thumb {
  position: absolute;
  top: 2px; left: 2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.avail-toggle input:checked ~ .toggle-track .toggle-thumb {
  transform: translateX(16px);
}

/* ── Worker grid ───────────────────────────────────────────── */
.wp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  padding: 1.5rem;
  max-width: 1300px;
  margin: 0 auto;
}

/* ── Worker card ───────────────────────────────────────────── */
.worker-card {
  background: #1a1f2b;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.worker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(27, 191, 191, 0.2);
}

.card-photo {
  position: relative;
  aspect-ratio: 3 / 4;
  background: #1e2530;
  overflow: hidden;
}
.card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.35s;
}
.worker-card:hover .card-photo img { transform: scale(1.04); }

.card-initials {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #1BBFBF;
}

.avail-badge {
  position: absolute;
  top: 8px; right: 8px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.badge-yes { background: #1BBFBF; color: #0f1117; }
.badge-no  { background: #E91E8C; color: #fff; }

.card-body {
  padding: 13px 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.card-body h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f0f2f7;
  margin: 0;
}
.card-cat {
  font-size: 0.72rem;
  font-weight: 700;
  color: #F7941D;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.card-loc {
  font-size: 0.75rem;
  color: rgba(240, 242, 247, 0.35);
}

/* ── Skeletons ─────────────────────────────────────────────── */
.wp-skeleton {
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  background: linear-gradient(90deg, #1a1f2b 25%, #232836 50%, #1a1f2b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── States ────────────────────────────────────────────────── */
.wp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: rgba(240, 242, 247, 0.35);
  font-size: 0.95rem;
}
.state-icon { font-size: 2rem; }

.state-btn {
  padding: 8px 22px;
  border-radius: 100px;
  border: 1.5px solid #1BBFBF;
  background: transparent;
  color: #1BBFBF;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.state-btn:hover { background: #1BBFBF; color: #0f1117; }

/* ── Footer ────────────────────────────────────────────────── */
.wp-footer {
  display: flex;
  justify-content: center;
  gap:40px;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  max-width: 1300px;
  margin: 1rem auto 0;
}

.wp-back--footer {
  color: rgba(240, 242, 247, 0.35);
  font-size: 0.83rem;
}
.wp-back--footer:hover { color: rgba(240, 242, 247, 0.7); }

.wp-admin-link {
  font-size: 0.75rem;
  color: rgba(240, 242, 247, 0.15);
  text-decoration: none;
  transition: color 0.2s;
}
.wp-admin-link:hover { color: rgba(240, 242, 247, 0.45); }

/* ── Floating WhatsApp ─────────────────────────────────────── */
.wa-float {
  position: fixed;
  bottom: 1.5rem; right: 1.5rem;
  z-index: 999;
  width: 52px; height: 52px;
  border-radius: 50%;
  background: #25D366;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
}
.wa-float:hover {
  transform: translateY(-3px) scale(1.06);
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.55);
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 640px) {
  .wp-nav-inner  { padding: 0 1rem; }
  .wp-hero       { padding: 2rem 1rem 1rem; }
  .wp-filters    { padding: 0.75rem 1rem; top: 52px; }
  .wp-grid       { padding: 1rem; gap: 10px; grid-template-columns: 1fr 1fr; }
  .wp-footer     { padding: 1rem; }
  .card-body h3  { font-size: 0.88rem; }
}

@media (max-width: 380px) {
  .wp-wa-btn span { display: none; }
  .wp-wa-btn { padding: 6px 10px; }
}
</style>
