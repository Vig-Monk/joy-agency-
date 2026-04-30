<template>
  <div class="login-root">
    <div class="login-card">
      <div class="login-brand">
        <span class="brand-logo">Joy<em>Agency</em></span>
        <span class="brand-tag">Admin Portal</span>
      </div>

      <p class="login-desc">Sign in to manage workers and bookings.</p>

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div class="lfield">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@joyagency.com"
            required
            autocomplete="email"
          />
        </div>
        <div class="lfield">
          <label for="password">Password</label>
          <div class="pw-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <button type="button" class="pw-toggle" @click="showPw = !showPw">
              <!-- Eye / Eye-off icon -->
              <svg v-if="!showPw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="login-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Signing in…' : 'Sign In' }}</span>
        </button>
      </form>

      <RouterLink to="/" class="back-link">← Back to website</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../services/api.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const showPw = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = null
  try {
    const { token } = await login(email.value, password.value)
    localStorage.setItem('joy_admin_token', token)
    router.push('/admin/workers')
  } catch (err) {
    error.value = err.message || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  background: #0a0d13;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  /* subtle grid texture */
  background-image:
    linear-gradient(rgba(27,191,191,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27,191,191,0.03) 1px, transparent 1px);
  background-size: 32px 32px;
}

.login-card {
  background: #181c25;
  border-radius: 20px;
  padding: 36px 32px;
  width: 100%;
  max-width: 380px;
  border: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

.login-brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}
.brand-logo {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--teal);
  letter-spacing: -0.5px;
}
.brand-logo em { font-style: normal; color: var(--orange); }
.brand-tag {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(232,234,240,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 2px 7px;
  border-radius: 4px;
}

.login-desc {
  font-size: 0.88rem;
  color: rgba(232,234,240,0.4);
  margin-bottom: 28px;
  line-height: 1.5;
}

.login-form { display: flex; flex-direction: column; gap: 16px; }

.lfield { display: flex; flex-direction: column; gap: 7px; }
.lfield label {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(232,234,240,0.5);
  letter-spacing: 0.3px;
}

.lfield input {
  background: #242938;
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 0.95rem;
  color: #f0f2f7;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}
.lfield input::placeholder { color: rgba(232,234,240,0.2); }
.lfield input:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(27,191,191,0.1);
}

/* Password field */
.pw-wrap { position: relative; }
.pw-wrap input { padding-right: 44px; }
.pw-toggle {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(232,234,240,0.3);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.pw-toggle:hover { color: rgba(232,234,240,0.65); }

/* Error */
.login-error {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(233,30,140,0.08);
  border: 1px solid rgba(233,30,140,0.2);
  border-radius: 9px;
  padding: 10px 13px;
  color: var(--pink);
  font-size: 0.84rem;
  font-weight: 500;
}

/* Submit */
.login-btn {
  background: var(--teal);
  color: #fff;
  border: none;
  padding: 13px;
  border-radius: 11px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.15s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'DM Sans', sans-serif;
}
.login-btn:hover:not(:disabled) { background: #17aaaa; transform: translateY(-1px); }
.login-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.back-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 0.82rem;
  color: rgba(232,234,240,0.3);
  text-decoration: none;
  transition: color 0.15s;
}
.back-link:hover { color: rgba(232,234,240,0.6); }

@media (max-width: 420px) {
  .login-card { padding: 28px 20px; }
}
</style>
