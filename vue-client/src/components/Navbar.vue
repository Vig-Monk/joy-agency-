<template>
  <nav :class="{ scrolled: isScrolled }">
    <RouterLink to="/" class="nav-brand">Joy<span>Agency</span></RouterLink>

    <ul>
      <li><a href="#services" @click.prevent="scrollTo('services')">Services</a></li>
      <li><a href="#why" @click.prevent="scrollTo('why')">About</a></li>
      <li><a href="#process" @click.prevent="scrollTo('process')">Process</a></li>
      <li>
        <RouterLink to="/workers" class="nav-workers-link">Browse Workers</RouterLink>
      </li>
      <li>
        <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="nav-btn">
          Get in Touch
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const whatsappLink = `https://wa.me/254703935838?text=${encodeURIComponent("Hello! I'd like to get in touch with JOY Recruitment Agency.")}`

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav-brand {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-decoration: none;
  color: var(--teal);
  flex-shrink: 0;
}
.nav-brand span { color: var(--orange); }

.nav-workers-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--teal) !important;
  text-decoration: none;
  padding: 0.4rem 0.9rem;
  border: 1.5px solid rgba(27,191,191,0.35);
  border-radius: 100px;
  transition: background 0.2s, color 0.2s;
}
.nav-workers-link:hover {
  background: var(--teal);
  color: #fff !important;
  border-color: var(--teal);
}
</style>
