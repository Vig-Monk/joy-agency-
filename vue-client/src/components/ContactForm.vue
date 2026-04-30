<template>
  <div class="contact-wrap reveal-section" id="contact" ref="sectionRef">
    <div class="contact-inner">

      <!-- Left: Text + Details -->
      <div class="contact-text reveal-item" style="--delay:0s">
        <div class="sec-kicker">Get in touch</div>
        <h2 class="sec-title">Find your<br />perfect match.</h2>
        <p>Tell us what you need and we'll get back to you within 24 hours. No obligation, no pressure.</p>
        <div class="cdetails">
          <div class="cdetail"><div class="ci ci-t">📍</div> Nairobi, Kenya</div>
          <div class="cdetail"><div class="ci ci-o">📞</div> +254 703 935838</div>
          <div class="cdetail"><div class="ci ci-p">📧</div> Wambuinjuguna1994@gmail.com</div>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="cform reveal-item" style="--delay:0.15s">

        <!-- Success State -->
        <div v-if="submitted" class="form-success">
          <div class="success-icon">✅</div>
          <h3>Inquiry Sent!</h3>
          <p>We'll get back to you within 24 hours.</p>
          <a :href="whatsappLinkFromForm" target="_blank" rel="noopener noreferrer" class="btn btn-dark" style="display:inline-block;margin-top:1rem;">
            Also Chat on WhatsApp →
          </a>
        </div>

        <!-- Form -->
        <template v-else>
          <div v-if="errors.length" class="form-errors">
            <p v-for="(e, i) in errors" :key="i">{{ e }}</p>
          </div>

          <form @submit.prevent="submitForm" novalidate>
            <div class="frow">
              <div class="ff">
                <label for="fullName">Full Name</label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  placeholder="Wanjiru Kamau"
                  :class="{ error: fieldError('fullName') }"
                />
              </div>
              <div class="ff">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="hello@email.com"
                  :class="{ error: fieldError('email') }"
                />
              </div>
            </div>

            <div class="frow">
              <div class="ff">
                <label for="phone">Phone</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              <div class="ff">
                <label for="service">Service Needed</label>
                <select id="service" v-model="form.service">
                  <option value="">Select a service</option>
                  <option>Nanny / Childcare</option>
                  <option>Housekeeper</option>
                  <option>Caretaker / Elderly Support</option>
                  <option>Personal Chef</option>
                  <option>Emergency Staffing</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div class="ff" style="margin-bottom:0">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                placeholder="Tell us about your needs, schedule, and preferences..."
                :class="{ error: fieldError('message') }"
              ></textarea>
            </div>

            <button class="fsub" type="submit" :disabled="loading">
              <span v-if="loading">Sending…</span>
              <span v-else>Send Inquiry →</span>
            </button>
          </form>

          <p class="form-alt-text">
            Prefer WhatsApp?
            <a :href="whatsappLinkFromForm" target="_blank" rel="noopener noreferrer">
              Message us directly →
            </a>
          </p>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const sectionRef = ref(null)
useScrollReveal(sectionRef)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  service: '',
  message: '',
})

const loading = ref(false)
const submitted = ref(false)
const errors = ref([])
const errorFields = ref([])

function fieldError(field) {
  return errorFields.value.includes(field)
}

function validate() {
  const errs = []
  const fields = []

  if (!form.value.fullName.trim()) {
    errs.push('Full name is required.')
    fields.push('fullName')
  }
  if (!form.value.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errs.push('A valid email address is required.')
    fields.push('email')
  }
  if (!form.value.message.trim()) {
    errs.push('Please write a message.')
    fields.push('message')
  }

  errors.value = errs
  errorFields.value = fields
  return errs.length === 0
}

const whatsappLinkFromForm = computed(() => {
  const name = form.value.fullName || 'there'
  const service = form.value.service ? ` I'm interested in: ${form.value.service}.` : ''
  const msg = form.value.message ? ` Details: ${form.value.message}` : ''
  const text = `Hello JOY Agency! My name is ${name}.${service}${msg}`
  return `https://wa.me/254703935838?text=${encodeURIComponent(text)}`
})

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqewkbyb'

async function submitForm() {
  if (!validate()) return

  loading.value = true
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.value.fullName,
        email: form.value.email,
        phone: form.value.phone,
        service: form.value.service,
        message: form.value.message,
      }),
    })

    if (res.ok) {
      submitted.value = true
    } else {
      errors.value = ['Submission failed. Please try WhatsApp or email us directly.']
    }
  } catch {
    errors.value = ['Network error. Please try again or contact us via WhatsApp.']
  } finally {
    loading.value = false
  }
}
</script>
