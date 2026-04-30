<template>
  <div class="wrap reveal-section" id="testimonials" style="padding-top:2rem" ref="sectionRef">
    <div class="sec-kicker">Happy families</div>
    <h2 class="sec-title">What clients say</h2>
    <div class="test-grid">
      <div
        v-for="(t, i) in testimonials"
        :key="i"
        class="clay tcard reveal-item"
        :style="`--delay:${i * 0.15}s`"
      >
        <div class="tcard-stars" :style="`color:${t.color}`">★★★★★</div>
        <blockquote>{{ t.quote }}</blockquote>
        <cite :style="`color:${t.color}`">{{ t.cite }}</cite>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

const testimonials = [
  {
    color: 'var(--teal)',
    quote: '"JOY found us the most wonderful nanny within a week. She\'s become like family — we couldn\'t imagine our home without her."',
    cite: 'Wanjiru M. — Karen, Nairobi',
  },
  {
    color: 'var(--orange)',
    quote: '"We needed a personal chef for our parents\' anniversary dinner and JOY delivered beyond expectations. Truly incredible."',
    cite: 'David O. — Westlands, Nairobi',
  },
  {
    color: 'var(--pink)',
    quote: '"The caretaker they placed for my elderly mother is so compassionate and professional. I finally have peace of mind."',
    cite: 'Amina K. — Lavington, Nairobi',
  },
]
</script>
