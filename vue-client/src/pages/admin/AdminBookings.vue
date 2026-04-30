<template>
  <div class="admin-root">
    <AdminNav />

    <div class="admin-content">
      <div class="page-header">
        <div>
          <p class="page-label">Incoming</p>
          <h1>Booking Requests <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }} new</span></h1>
        </div>
      </div>

      <div v-if="loading" class="state-loading">
        <div v-for="n in 3" :key="n" class="skeleton-card"></div>
      </div>
      <div v-else-if="error" class="state-msg state-error">{{ error }}</div>
      <div v-else-if="!bookings.length" class="state-msg">No booking requests yet.</div>

      <div v-else class="bookings-list">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          :class="['booking-card', { 'is-unread': !booking.is_read }]"
        >
          <!-- Unread indicator -->
          <div class="unread-bar" v-if="!booking.is_read"></div>

          <div class="bc-header">
            <div class="bc-client">
              <div class="bc-avatar">{{ booking.client_name.charAt(0) }}</div>
              <div class="bc-client-info">
                <span class="bc-name">{{ booking.client_name }}</span>
                <span class="bc-phone">{{ booking.client_phone }}</span>
              </div>
            </div>
            <div class="bc-meta">
              <span v-if="!booking.is_read" class="dot-new"></span>
              <span class="bc-date">{{ formatDate(booking.created_at) }}</span>
            </div>
          </div>

          <div class="bc-worker" v-if="booking.worker_name">
            <span class="bc-worker-label">Requesting</span>
            <strong>{{ booking.worker_name }}</strong>
            <span class="tag tag-cat">{{ booking.worker_category }}</span>
          </div>

          <p v-if="booking.message" class="bc-message">{{ booking.message }}</p>

          <div class="bc-actions">
            <a :href="`tel:${booking.client_phone}`" class="bc-btn bc-btn-call">
              <!-- Phone icon -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call
            </a>
            <a
              :href="`https://wa.me/${formatWA(booking.client_phone)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="bc-btn bc-btn-wa"
            >
              <!-- WhatsApp SVG icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <button
              v-if="!booking.is_read"
              class="bc-btn bc-btn-read"
              @click="markRead(booking)"
            >
              Mark read
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { getBookings, markBookingRead } from '../../services/api.js'

const bookings = ref([])
const loading = ref(true)
const error = ref(null)

const unreadCount = computed(() => bookings.value.filter(b => !b.is_read).length)

async function load() {
  try { bookings.value = await getBookings() }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
}

async function markRead(booking) {
  try { await markBookingRead(booking.id); booking.is_read = true }
  catch (err) { alert('Error: ' + err.message) }
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function formatWA(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? '254' + digits.slice(1) : digits
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
  max-width: 720px;
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
.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0f2f7;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.unread-badge {
  background: var(--pink);
  color: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Skeleton */
.state-loading { display: flex; flex-direction: column; gap: 10px; }
.skeleton-card {
  height: 130px;
  border-radius: 14px;
  background: linear-gradient(90deg, #181c25 25%, #1e2330 50%, #181c25 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.state-msg { text-align: center; padding: 48px 20px; color: rgba(232,234,240,0.35); }
.state-error { color: var(--pink); }

/* Bookings list */
.bookings-list { display: flex; flex-direction: column; gap: 10px; }

.booking-card {
  background: #181c25;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}

.is-unread {
  border-color: rgba(27,191,191,0.2);
  background: #16202b;
}

.unread-bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--teal);
  border-radius: 3px 0 0 3px;
}

.bc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.bc-client { display: flex; align-items: center; gap: 10px; }

.bc-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: rgba(27,191,191,0.1);
  color: var(--teal);
  font-weight: 700;
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.bc-client-info { display: flex; flex-direction: column; gap: 2px; }
.bc-name { font-weight: 700; font-size: 0.95rem; color: #f0f2f7; }
.bc-phone { font-size: 0.8rem; color: rgba(232,234,240,0.45); }

.bc-meta { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.dot-new { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); }
.bc-date { font-size: 0.75rem; color: rgba(232,234,240,0.3); white-space: nowrap; }

.bc-worker {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.83rem; color: rgba(232,234,240,0.5);
  margin-bottom: 8px; flex-wrap: wrap;
}
.bc-worker-label { color: rgba(232,234,240,0.3); }
.bc-worker strong { color: #e8eaf0; }

.tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
.tag-cat { background: rgba(247,148,29,0.12); color: var(--orange); }

.bc-message {
  font-size: 0.86rem;
  color: rgba(232,234,240,0.55);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 10px 12px;
  margin: 8px 0;
  line-height: 1.55;
}

.bc-actions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.bc-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: all 0.15s;
}

.bc-btn-call {
  background: rgba(27,191,191,0.1);
  color: var(--teal);
  border: 1px solid rgba(27,191,191,0.15);
}
.bc-btn-call:hover { background: var(--teal); color: #fff; }

.bc-btn-wa {
  background: rgba(37,211,102,0.1);
  color: #25D366;
  border: 1px solid rgba(37,211,102,0.15);
}
.bc-btn-wa:hover { background: #25D366; color: #fff; }

.bc-btn-read {
  background: rgba(255,255,255,0.05);
  color: rgba(232,234,240,0.45);
  border: 1px solid rgba(255,255,255,0.07);
}
.bc-btn-read:hover { background: rgba(255,255,255,0.1); color: #e8eaf0; }

@media (max-width: 480px) {
  .admin-content { padding: 16px 14px 60px; }
  .bc-btn { padding: 8px 12px; flex: 1; justify-content: center; }
}
</style>
