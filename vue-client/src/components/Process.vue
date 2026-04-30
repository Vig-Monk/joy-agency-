<template>
  <div class="wrap reveal-section" id="process" style="padding-bottom:3rem" ref="sectionRef">
    <div class="sec-kicker">How it works</div>
    <h2 class="sec-title">Simple. Fast. Reliable.</h2>
    <div class="prow">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="clay pstep reveal-item"
        :style="`--delay:${i * 0.1}s`"
      >
        <div class="pstep-bar" :style="`background:${step.color};`"></div>
        <div class="pstep-n" :style="`color:${step.color};`">0{{ i + 1 }}</div>
        <h3>{{ step.title }}</h3>
        <p>{{ step.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

const steps = [
  {
    color: 'var(--teal)',
    title: 'Tell Us Your Needs',
    desc: 'Share your requirements, schedule, and preferences with our team.',
  },
  {
    color: 'var(--orange)',
    title: 'We Source & Screen',
    desc: 'We search our network and rigorously vet suitable candidates.',
  },
  {
    color: 'var(--pink)',
    title: 'Meet Your Matches',
    desc: 'Interview shortlisted candidates and choose who feels right.',
  },
  {
    color: 'var(--lime)',
    title: 'Ongoing Support',
    desc: 'We follow up and remain available to ensure everything runs smoothly.',
  },
]
</script>
