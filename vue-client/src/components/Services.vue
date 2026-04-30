<template>
  <div class="wrap reveal-section" id="services" ref="sectionRef">
    <div class="sec-kicker">What we offer</div>
    <h2 class="sec-title">Our Services</h2>
    <div class="bento">

      <div class="bc bc-teal span2 reveal-item" style="--delay:0s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1697906100384-375b3390e8f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG5hbm55JTIwYW5kJTIwY2hpbGRjYXJlfGVufDB8fDB8fHww"
          alt="Nanny and child" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-teal">Most Popular</span>
          <div class="bc-title">Nanny &amp; Childcare Placement</div>
          <div class="bc-desc">Trusted, experienced nannies tailored to your family's needs and your children's personalities. We match by temperament, schedule, and parenting style.</div>
        </div>
        <div class="bc-num">01</div>
      </div>

      <div class="bc bc-lime reveal-item" style="--delay:0.1s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80&fit=crop"
          alt="Housekeeper cleaning" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-lime">Domestic</span>
          <div class="bc-title">Housekeepers &amp; Domestic Staff</div>
          <div class="bc-desc">Reliable, discreet staff to keep your home clean, organized, and welcoming every day.</div>
        </div>
        <div class="bc-num">02</div>
      </div>

      <div class="bc bc-orange reveal-item" style="--delay:0.15s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&q=80&fit=crop"
          alt="Personal chef" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-orange">New</span>
          <div class="bc-title">Personal Chefs</div>
          <div class="bc-desc">Professional chefs for daily family meals, special occasions, and private events.</div>
        </div>
        <div class="bc-num">03</div>
      </div>

      <div class="bc bc-pink reveal-item" style="--delay:0.2s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&fit=crop"
          alt="Caretaker" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-pink">Care</span>
          <div class="bc-title">Caretakers &amp; Elderly Support</div>
          <div class="bc-desc">Compassionate, trained professionals for seniors and individuals with special needs.</div>
        </div>
        <div class="bc-num">04</div>
      </div>

      <div class="bc bc-dark reveal-item" style="--delay:0.25s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80&fit=crop"
          alt="Emergency staffing" loading="lazy" style="opacity:0.7;" />
        <div class="bc-body">
          <span class="bc-tag tag-white">Urgent</span>
          <div class="bc-title">Emergency Staffing</div>
          <div class="bc-desc">Quick placements for last-minute or short-term household needs.</div>
        </div>
        <div class="bc-num">05</div>
      </div>

      <div class="bc bc-white reveal-item" style="--delay:0.3s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80&fit=crop"
          alt="Screening verification" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-muted">Trust</span>
          <div class="bc-title">Screening &amp; Verification</div>
          <div class="bc-desc">Background checks, reference calls, and skill assessments on every candidate.</div>
        </div>
        <div class="bc-num">06</div>
      </div>

      <div class="bc bc-teal reveal-item" style="--delay:0.35s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80&fit=crop"
          alt="Personalized matching" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-teal">Matching</span>
          <div class="bc-title">Personalized Matching</div>
          <div class="bc-desc">We understand your home and values before recommending anyone.</div>
        </div>
        <div class="bc-num">07</div>
      </div>

      <div class="bc bc-orange reveal-item" style="--delay:0.4s">
        <img class="bc-img"
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80&fit=crop"
          alt="Ongoing support" loading="lazy" />
        <div class="bc-body">
          <span class="bc-tag tag-orange">Ongoing</span>
          <div class="bc-title">Support &amp; Guidance</div>
          <div class="bc-desc">Continuous assistance and follow-up long after placement is made.</div>
        </div>
        <div class="bc-num">08</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const sectionRef = ref(null)
useScrollReveal(sectionRef)
</script>
