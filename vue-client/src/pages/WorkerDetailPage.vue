<template>
  <div class="detail-root">
    <!-- Top nav bar -->
    <header class="detail-nav">
      <RouterLink to="/workers" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Workers
      </RouterLink>
      <RouterLink to="/" class="brand-link">Joy<span>Agency</span></RouterLink>
    </header>

    <!-- States -->
    <div v-if="loading" class="detail-loading">
      <div class="sk-hero"></div>
      <div class="sk-form"></div>
    </div>
    <div v-else-if="error" class="state-msg state-error">{{ error }}</div>

    <!-- Content -->
    <div v-else-if="worker" class="detail-wrap">

      <!-- Worker hero card -->
      <div class="worker-hero">
        <div class="hero-photo">
          <img v-if="worker.photo_url" :src="worker.photo_url" :alt="worker.name" />
          <div v-else class="photo-init">{{ worker.name.charAt(0) }}</div>
        </div>
        <div class="hero-body">
          <span :class="['avail-pill', worker.is_available ? 'pill-yes' : 'pill-no']">
            <span class="pill-dot"></span>
            {{ worker.is_available ? 'Available for placement' : 'Currently booked' }}
          </span>
          <h1>{{ worker.name }}</h1>
          <div class="hero-meta">
            <span class="meta-cat">{{ worker.category }}</span>
            <span v-if="worker.location" class="meta-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ worker.location }}
            </span>
          </div>
          <p v-if="worker.bio" class="hero-bio">{{ worker.bio }}</p>

          <!-- WhatsApp direct link -->
          <a :href="waLink" target="_blank" rel="noopener noreferrer" class="wa-direct">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Enquire via WhatsApp
          </a>
        </div>
      </div>

      <!-- Booking form -->
      <div class="booking-card">
        <h2>Send a booking request</h2>
        <p class="booking-sub">Joy Agency will contact you within 24 hours to confirm.</p>

        <div v-if="bookingSuccess" class="booking-success">
          <div class="success-icon">✓</div>
          <h3>Request sent!</h3>
          <p>We'll be in touch soon. You can also reach us directly on WhatsApp.</p>
          <a :href="waLink" target="_blank" rel="noopener noreferrer" class="wa-direct" style="margin-top: 8px">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Open WhatsApp
          </a>
        </div>

        <form v-else @submit.prevent="submitBooking" class="booking-form" novalidate>
          <div class="bfield">
            <label for="bname">Your Name <span class="req">*</span></label>
            <input id="bname" v-model="form.client_name" placeholder="Full name" required />
          </div>
          <div class="bfield">
            <label for="bphone">Phone Number <span class="req">*</span></label>
            <input id="bphone" v-model="form.client_phone" type="tel" placeholder="07XX XXX XXX" required />
          </div>
          <div class="bfield">
            <label for="bmsg">Message <span class="optional">(optional)</span></label>
            <textarea id="bmsg" v-model="form.message" placeholder="Describe your needs, schedule, or any questions…" rows="4"></textarea>
          </div>
          <div v-if="bookingError" class="bfield-error">{{ bookingError }}</div>
          <button type="submit" class="submit-btn" :disabled="submitting">
            <span v-if="submitting" class="spinner"></span>
            {{ submitting ? 'Sending…' : 'Send Booking Request' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getWorker, submitBooking as apiSubmitBooking } from '../services/api.js'

const route = useRoute()
const worker = ref(null)
const loading = ref(true)
const error = ref(null)
const form = ref({ client_name: '', client_phone: '', message: '' })
const submitting = ref(false)
const bookingSuccess = ref(false)
const bookingError = ref(null)

const waLink = computed(() => {
  if (!worker.value) return '#'
  const text = `Hello JOY Agency! I'd like to enquire about ${worker.value.name} (${worker.value.category}).`
  return `https://wa.me/254703935838?text=${encodeURIComponent(text)}`
})

async function loadWorker() {
  try { worker.value = await getWorker(route.params.id) }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
}

async function submitBooking() {
  submitting.value = true
  bookingError.value = null
  try {
    await apiSubmitBooking({ worker_id: worker.value.id, ...form.value })
    bookingSuccess.value = true
  } catch (err) { bookingError.value = err.message }
  finally { submitting.value = false }
}

onMounted(loadWorker)
</script>

<style scoped>
.detail-root {
  min-height: 100vh;
  background: #0f1117;
  color: #e8eaf0;
  font-family: 'DM Sans', sans-serif;
}

/* Nav */
.detail-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  background: #0f1117;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}
.back-link {
  display: flex; align-items: center; gap: 6px;
  color: rgba(232,234,240,0.5);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.back-link:hover { color: #f0f2f7; }
.brand-link {
  font-size: 1rem; font-weight: 800;
  color: var(--teal); text-decoration: none;
  letter-spacing: -0.3px;
}
.brand-link span { color: var(--orange); }

/* Layout */
.detail-wrap {
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Worker hero */
.worker-hero {
  background: #181c25;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  display: flex;
  gap: 0;
}

.hero-photo {
  width: 160px;
  min-height: 220px;
  flex-shrink: 0;
  background: #1e2330;
  overflow: hidden;
}
.hero-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.photo-init {
  width: 100%; height: 100%; min-height: 220px;
  display: flex; align-items: center; justify-content: center;
  font-size: 4rem; font-weight: 800; color: var(--teal);
}

.hero-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

/* Availability pill */
.avail-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 20px;
  font-size: 0.75rem; font-weight: 700;
  width: fit-content;
}
.pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.pill-yes { background: rgba(27,191,191,0.12); color: var(--teal); }
.pill-yes .pill-dot { background: var(--teal); }
.pill-no  { background: rgba(233,30,140,0.12); color: var(--pink); }
.pill-no .pill-dot  { background: var(--pink); }

h1 { font-size: clamp(1.3rem, 4vw, 1.7rem); font-weight: 700; color: #f0f2f7; margin: 0; }

.hero-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.meta-cat {
  font-size: 0.78rem; font-weight: 700;
  color: var(--orange); text-transform: uppercase; letter-spacing: 0.5px;
}
.meta-loc {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.8rem; color: rgba(232,234,240,0.4);
}

.hero-bio {
  font-size: 0.88rem; line-height: 1.6;
  color: rgba(232,234,240,0.5); margin: 0;
}

/* WhatsApp direct */
.wa-direct {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(37,211,102,0.1);
  border: 1px solid rgba(37,211,102,0.2);
  color: #25D366;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  width: fit-content;
  margin-top: 4px;
  transition: background 0.15s;
}
.wa-direct:hover { background: rgba(37,211,102,0.18); }

/* Booking card */
.booking-card {
  background: #181c25;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 22px;
}
.booking-card h2 { font-size: 1.05rem; font-weight: 700; color: #f0f2f7; margin: 0 0 4px; }
.booking-sub { font-size: 0.83rem; color: rgba(232,234,240,0.38); margin-bottom: 20px; }

.booking-form { display: flex; flex-direction: column; gap: 14px; }

.bfield { display: flex; flex-direction: column; gap: 6px; }
.bfield label {
  font-size: 0.78rem; font-weight: 600;
  color: rgba(232,234,240,0.5); letter-spacing: 0.3px;
}
.req { color: var(--pink); }
.optional { color: rgba(232,234,240,0.25); font-weight: 400; }

.bfield input,
.bfield textarea {
  background: #242938;
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 0.92rem;
  color: #f0f2f7;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: vertical;
}
.bfield input::placeholder,
.bfield textarea::placeholder { color: rgba(232,234,240,0.2); }
.bfield input:focus,
.bfield textarea:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(27,191,191,0.1);
}

.bfield-error {
  color: var(--pink); font-size: 0.82rem;
  background: rgba(233,30,140,0.07);
  border-radius: 8px; padding: 8px 12px;
}

.submit-btn {
  background: var(--orange);
  color: #fff; border: none;
  padding: 13px;
  border-radius: 11px;
  font-size: 0.95rem; font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, transform 0.15s;
}
.submit-btn:hover:not(:disabled) { background: #e0841a; transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

/* Booking success */
.booking-success {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 20px 0 8px; gap: 8px;
}
.success-icon {
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(27,191,191,0.12);
  color: var(--teal); font-size: 1.5rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.booking-success h3 { font-size: 1.1rem; font-weight: 700; color: #f0f2f7; margin: 0; }
.booking-success p { font-size: 0.88rem; color: rgba(232,234,240,0.45); margin: 0; }

/* Spinner */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Skeleton */
.detail-loading { max-width: 680px; margin: 0 auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
.sk-hero { height: 220px; border-radius: 16px; }
.sk-form { height: 300px; border-radius: 16px; }
.sk-hero, .sk-form {
  background: linear-gradient(90deg, #181c25 25%, #1e2330 50%, #181c25 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.state-msg { text-align: center; padding: 60px 20px; color: rgba(232,234,240,0.35); }
.state-error { color: var(--pink); }

/* Responsive */
@media (max-width: 500px) {
  .worker-hero { flex-direction: column; }
  .hero-photo { width: 100%; min-height: 200px; }
  .photo-init { min-height: 200px; }
  .hero-body { padding: 16px; }
  .detail-wrap { padding: 16px 14px 60px; }
  .booking-card { padding: 18px 16px; }
}
</style>
