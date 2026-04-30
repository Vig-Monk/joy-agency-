/**
 * useScrollReveal
 *
 * Watches a section ref with IntersectionObserver.
 * When the section enters the viewport it adds the class `is-visible`
 * to the section itself, which triggers CSS transitions on child
 * `.reveal-item` elements (fade-in + slide-up with staggered delays).
 *
 * Usage:
 *   const sectionRef = ref(null)
 *   useScrollReveal(sectionRef)
 *   // In template: <div ref="sectionRef" class="reveal-section">
 *   //   <div class="reveal-item" style="--delay:0s">…</div>
 *   //   <div class="reveal-item" style="--delay:0.1s">…</div>
 *
 * CSS for this composable lives in style.css under the
 * `.reveal-section` and `.reveal-item` rules.
 */

import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal(sectionRef, options = {}) {
  let observer = null

  onMounted(() => {
    if (!sectionRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Once visible, no need to keep watching
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
      }
    )

    observer.observe(sectionRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
