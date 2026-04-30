<template>
  <nav class="admin-nav">
    <RouterLink to="/admin/workers" class="nav-brand">
      Joy<span>Agency</span>
      <small>Admin</small>
    </RouterLink>

    <div class="nav-links">
      <RouterLink to="/admin/workers" class="nav-link">Workers</RouterLink>
      <RouterLink to="/admin/bookings" class="nav-link nav-link--bookings">
        Bookings
        <span v-if="unread > 0" class="nav-badge">{{ unread }}</span>
      </RouterLink>
      <RouterLink to="/admin/analytics" class="nav-link">Analytics</RouterLink>
      <RouterLink to="/workers" class="nav-link nav-link--site">↗ Site</RouterLink>
      <button class="nav-logout" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBookings } from '../services/api.js'

const router = useRouter()
const unread = ref(0)

async function loadUnread() {
  try {
    const bookings = await getBookings()
    unread.value = bookings.filter(b => !b.is_read).length
  } catch { /* fail silently */ }
}

function logout() {
  localStorage.removeItem('joy_admin_token')
  router.push('/admin/login')
}

onMounted(loadUnread)
</script>

<style scoped>
.admin-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f1117;
  padding: 0 1.25rem;
  height: 52px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 1rem;
  /* prevent overflow on narrow screens */
  min-width: 0;
}

.nav-brand {
  font-size: 1rem;
  font-weight: 800;
  color: var(--teal);
  text-decoration: none;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
  letter-spacing: -0.3px;
}
.nav-brand span { color: var(--orange); }
.nav-brand small {
  font-size: 0.62rem;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-left: 2px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: nowrap;
  overflow-x: auto;
  /* hide scrollbar but allow scroll on very small screens */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.nav-links::-webkit-scrollbar { display: none; }

.nav-link {
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 500;
  position: relative;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}

.nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
.nav-link.router-link-active { color: #fff; background: rgba(255,255,255,0.09); }

.nav-link--site { color: var(--teal); }
.nav-link--site:hover { color: var(--teal); background: rgba(27,191,191,0.1); }

.nav-badge {
  position: absolute;
  top: 1px;
  right: 1px;
  background: var(--pink);
  color: #fff;
  font-size: 0.58rem;
  font-weight: 800;
  min-width: 14px;
  height: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
}

.nav-logout {
  background: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.4);
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 6px;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
  flex-shrink: 0;
}
.nav-logout:hover { border-color: var(--pink); color: var(--pink); }

/* On very small screens, reduce padding */
@media (max-width: 380px) {
  .admin-nav { padding: 0 0.75rem; }
  .nav-link { padding: 5px 7px; font-size: 0.78rem; }
  .nav-brand small { display: none; }
}
</style>
