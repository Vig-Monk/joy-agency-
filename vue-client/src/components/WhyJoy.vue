<template>
  <div class="why-wrap reveal-section" id="why" ref="sectionRef">
    <div class="why-inner">
      <div class="why-text reveal-item" style="--delay:0s">
        <div class="sec-kicker">Why JOY</div>
        <h2 class="sec-title">Care you can count on.</h2>
        <p>
          We don't just fill positions — we build lasting relationships between Nairobi families
          and the people who care for them. Every placement is backed by our personal commitment.
        </p>
      </div>
      <div class="why-grid">
        <div
          v-for="(card, i) in cards"
          :key="i"
          class="why-card reveal-item"
          :style="`--delay:${i * 0.1}s`"
        >
          <div class="why-accent" :style="`background:${card.color};`"></div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

const cards = [
  {
    color: 'var(--teal)',
    title: 'Rigorous Screening',
    desc: 'Every candidate passes background checks, interviews, and reference verification.',
  },
  {
    color: 'var(--orange)',
    title: 'Perfect Fit',
    desc: 'We understand your family before making any recommendation.',
  },
  {
    color: 'var(--pink)',
    title: 'Fast Turnaround',
    desc: 'Our Nairobi network means we can respond quickly, even urgently.',
  },
  {
    color: 'var(--lime)',
    title: 'Dedicated Support',
    desc: 'Available for both families and staff throughout the journey.',
  },
]
</script>
