<template>
  <section class="hero-section" ref="heroRef">
    <div class="hero">
      <!-- Hero Text -->
      <div class="hero-text">
        <div class="hero-pill">
          <div class="pill-dot"></div>
          Nairobi's Trusted Domestic Agency
        </div>
        <h1>The <em>right people</em><br />for your home.</h1>
        <p class="hero-sub">
          JOY Recruitment Agency connects Nairobi families with skilled, vetted domestic
          professionals — nannies, housekeepers, caretakers, and personal chefs.
        </p>
        <div class="hero-actions">
          <RouterLink to="/workers" class="btn btn-dark">
            Browse Workers →
          </RouterLink>
          <a href="#services" class="btn btn-ghost" @click.prevent="scrollTo('services')">
            Explore Services
          </a>
        </div>
        <p class="hero-trust">
          <span>✓ Background checked</span>
          <span>✓ 500+ placements</span>
          <span>✓ 98% satisfaction</span>
        </p>
      </div>

      <!-- Hero Bento Grid -->
      <div class="hero-bento" ref="bentoRef">
        <div class="hcard hc-teal" ref="card1Ref">
          <img
            class="hcard-img"
            src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80&fit=crop"
            alt="Nanny with child"
            loading="lazy"
          />
          <div class="hcard-body">
            <div class="hcard-kicker">Most requested</div>
            <div class="hcard-val">Nanny Placement</div>
          </div>
        </div>

        <div class="hcard hc-dark hc-stat" ref="card2Ref">
          <div class="hcard-kicker">Placements done</div>
          <div class="hcard-val">500+</div>
          <div class="hcard-note">Happy families served</div>
        </div>

        <div class="hcard hc-orange hc-wide" ref="card3Ref">
          <img
            class="hcard-img"
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fit=crop"
            alt="Personal chef cooking"
            loading="lazy"
          />
          <div class="hcard-body">
            <div class="hcard-kicker">Now available</div>
            <div class="hcard-val">Personal Chefs for families &amp; events</div>
          </div>
        </div>

        <div class="hcard hc-teal hc-stat" ref="card4Ref">
          <div class="hcard-kicker">Satisfaction</div>
          <div class="hcard-val">98%</div>
          <div class="hcard-note">Client rating</div>
        </div>

        <div class="hcard hc-orange hc-stat" ref="card5Ref">
          <div
            class="blob"
            style="background: var(--orange); width: 70px; height: 70px; top: -15px; right: -15px"
          ></div>
          <div style="font-size: 2rem; margin-bottom: 0.4rem">🛡️</div>
          <div class="hcard-kicker">Every candidate</div>
          <div class="hcard-val">Fully Vetted</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const heroRef = ref(null)
const bentoRef = ref(null)
const card1Ref = ref(null)
const card2Ref = ref(null)
const card3Ref = ref(null)
const card4Ref = ref(null)
const card5Ref = ref(null)

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function applyParallax() {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  const progress = -rect.top
  if (bentoRef.value) bentoRef.value.style.transform = `translateY(${progress * 0.08}px)`
  const offsets = [0.04, -0.04, 0.06, -0.03, 0.05]
  const refs = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref]
  refs.forEach((r, i) => {
    if (r.value) r.value.style.transform = `translateY(${progress * offsets[i]}px)`
  })
}

onMounted(() => window.addEventListener('scroll', applyParallax, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', applyParallax))
</script>

<style scoped>
.hero-trust {
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
}
.hero-trust span { display: flex; align-items: center; gap: 0.3rem; }
</style>
