<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">Joy<em>Agency</em></span>
        <p>Connecting Nairobi families with trusted domestic professionals.</p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h4>Explore</h4>
          <RouterLink to="/workers">Browse Workers</RouterLink>
          <a href="#services" @click.prevent="scrollTo('services')">Services</a>
          <a href="#process" @click.prevent="scrollTo('process')">How It Works</a>
          <a href="#contact" @click.prevent="scrollTo('contact')">Contact Us</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="tel:+254703935838">+254 703 935838</a>
          <a href="mailto:Wambuinjuguna1994@gmail.com">Email Us</a>
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ year }} JOY Recruitment Agency. Nairobi, Kenya.</span>
      <RouterLink to="/admin/login" class="footer-admin-link">Admin</RouterLink>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const whatsappLink = `https://wa.me/254703935838?text=${encodeURIComponent("Hello! I found you via your website.")}`

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.site-footer {
  background: #111;
  color: rgba(255,255,255,0.6);
}

.footer-inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 3.5rem 2.5rem 2rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}
.footer-logo em {
  font-style: normal;
  color: var(--teal);
}

.footer-brand p {
  font-size: 0.88rem;
  line-height: 1.6;
  max-width: 280px;
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-col h4 {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 0.25rem;
}

.footer-col a {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}
.footer-col a:hover { color: var(--teal); }

/* Bottom bar */
.footer-bottom {
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.2rem 2.5rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
}

.footer-admin-link {
  color: rgba(255,255,255,0.2);
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.2s;
}
.footer-admin-link:hover { color: rgba(255,255,255,0.5); }

@media (max-width: 720px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2.5rem 1.5rem 1.5rem;
  }
  .footer-links { gap: 2rem; }
  .footer-bottom { padding: 1rem 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; }
}
</style>
