<template>
  <div class="fw-wrap reveal-section" ref="sectionRef">
    <div class="fw-inner">

      <div class="fw-header reveal-item" style="--delay:0s">
        <div>
          <div class="fw-kicker">Meet our team</div>
          <h2 class="fw-title">Available right now</h2>
        </div>
        <RouterLink to="/workers" class="fw-see-all">View all workers →</RouterLink>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="fw-loading">
        <div v-for="n in 4" :key="n" class="fw-skeleton"></div>
      </div>

      <!-- Empty / error — fail gracefully -->
      <div v-else-if="error || !workers.length" class="fw-empty reveal-item" style="--delay:0.1s">
        <p>Our team is ready to help your family.</p>
        <RouterLink to="/workers" class="fw-cta-btn">Browse All Workers →</RouterLink>
      </div>

      <!-- Worker cards -->
      <div v-else class="fw-grid">
        <RouterLink
          v-for="(worker, i) in workers"
          :key="worker.id"
          :to="`/workers/${worker.id}`"
          class="fw-card reveal-item"
          :style="`--delay:${i * 0.1}s`"
        >
          <div class="fw-photo">
            <img v-if="worker.photo_url" :src="worker.photo_url" :alt="worker.name" />
            <div v-else class="fw-initials">{{ worker.name.charAt(0) }}</div>
            <span class="fw-dot" :class="worker.is_available ? 'dot-available' : 'dot-booked'"></span>
          </div>
          <div class="fw-body">
            <h3>{{ worker.name }}</h3>
            <span class="fw-cat">{{ worker.category }}</span>
            <span class="fw-loc" v-if="worker.location">📍 {{ worker.location }}</span>
            <span class="fw-status" :class="worker.is_available ? 'status-yes' : 'status-no'">
              {{ worker.is_available ? '✓ Available' : 'Booked' }}
            </span>
          </div>
        </RouterLink>
      </div>

      <!-- Bottom CTA -->
      <div class="fw-footer reveal-item" style="--delay:0.5s">
        <RouterLink to="/workers" class="fw-cta-btn">See All Workers →</RouterLink>
        <p>{{ totalCount > 4 ? `${totalCount - 4} more workers available` : 'New workers added regularly' }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { getWorkers } from '../services/api.js'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

const workers = ref([])
const loading = ref(true)
const error = ref(null)
const totalCount = ref(0)

onMounted(async () => {
  try {
    const all = await getWorkers({ available: 'true' })
    totalCount.value = all.length
    workers.value = all.slice(0, 4)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Section wrapper ──
   Hardcoded dark colours — does NOT use --ink or --white
   so system dark mode cannot break it. This section is
   intentionally dark on ALL devices regardless of OS theme. */
.fw-wrap {
  background: #111317;
}

.fw-inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 5rem 2.5rem;
}

/* Header */
.fw-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.fw-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 0.4rem;
}

.fw-title {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 400;
  color: #f0f2f7;
  margin: 0;
  line-height: 1.15;
}

.fw-see-all {
  color: #1BBFBF;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1.5px solid rgba(27, 191, 191, 0.3);
  padding-bottom: 2px;
  transition: border-color 0.2s;
  white-space: nowrap;
}
.fw-see-all:hover { border-color: #1BBFBF; }

/* Grid */
.fw-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

/* Card */
.fw-card {
  text-decoration: none;
  color: inherit;
  background: #1a1f2b;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.25s, box-shadow 0.25s;
}
.fw-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

/* Photo */
.fw-photo {
  position: relative;
  aspect-ratio: 3 / 4;
  background: #1e2530;
  overflow: hidden;
}
.fw-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.4s;
}
.fw-card:hover .fw-photo img { transform: scale(1.04); }

.fw-initials {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; font-weight: 800; color: #1BBFBF;
}

/* Availability dot */
.fw-dot {
  position: absolute;
  top: 10px; right: 10px;
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 2px solid #111317;
}
.dot-available { background: #1BBFBF; }
.dot-booked    { background: #E91E8C; }

/* Card body */
.fw-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.fw-body h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f0f2f7;
  margin: 0;
}
.fw-cat {
  font-size: 0.72rem;
  font-weight: 700;
  color: #F7941D;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.fw-loc {
  font-size: 0.75rem;
  color: rgba(240, 242, 247, 0.35);
}
.fw-status {
  font-size: 0.72rem;
  font-weight: 700;
  margin-top: 4px;
}
.status-yes { color: #1BBFBF; }
.status-no  { color: #E91E8C; }

/* Footer CTA */
.fw-footer {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.fw-footer p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.28);
}

/* CTA button — hardcoded so it works on both themes */
.fw-cta-btn {
  display: inline-block;
  background: #f0f2f7;
  color: #111317;
  text-decoration: none;
  padding: 0.7rem 1.6rem;
  border-radius: 100px;
  font-size: 0.88rem;
  font-weight: 700;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
}
.fw-cta-btn:hover {
  background: #ffffff;
  transform: translateY(-2px);
}

/* Loading skeletons */
.fw-loading {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.fw-skeleton {
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

/* Empty */
.fw-empty {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.fw-empty p { color: rgba(255, 255, 255, 0.35); font-size: 1rem; }

/* ── Responsive ── */
@media (max-width: 960px) {
  .fw-grid, .fw-loading { grid-template-columns: repeat(2, 1fr); }
  .fw-inner { padding: 4rem 1.5rem; }
}

@media (max-width: 480px) {
  .fw-grid, .fw-loading { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .fw-inner { padding: 3rem 1rem; }
  .fw-title { font-size: 1.4rem; }
}
</style>
