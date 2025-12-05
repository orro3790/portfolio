# Lenis Smooth Scroll Integration

How Lenis is configured and how to build scroll-linked components.

---

## Architecture Overview

```
+layout.svelte
    │
    ├── Creates Lenis instance on mount
    ├── Runs RAF loop: lenis.raf(time)
    └── Exposes instance via lenisStore
              │
              ▼
        lenisStore (Svelte store)
              │
              ▼
    Scroll-linked components subscribe
    and react to lenis.on('scroll', ...)
```

---

## Global Setup (`+layout.svelte`)

```ts
import Lenis from 'lenis';
import { lenisStore } from '$lib/stores/lenis';

onMount(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2
  });

  lenisStore.set(lenis);

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
    lenisStore.set(null);
  };
});
```

---

## Lenis Store (`$lib/stores/lenis.ts`)

```ts
import { writable } from 'svelte/store';
import type Lenis from 'lenis';

export const lenisStore = writable<Lenis | null>(null);
```

Components subscribe to access the global instance.

---

## Building Scroll-Linked Components

### Pattern: Sticky + Tall Section

For scroll-linked animations (carousels, parallax, reveal sequences):

1. **Create a tall section** — Extra height gives scroll "runway"
2. **Use `position: sticky`** — Lenis works seamlessly with CSS sticky
3. **Subscribe to Lenis scroll events** — Get buttery-smooth progress updates
4. **Drive transforms directly** — No CSS transitions; let Lenis interpolate

### Example: Scroll-Linked Progress

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { lenisStore } from '$lib/stores/lenis';

  let sectionEl: HTMLElement;
  let progress = $state(0);

  function updateProgress() {
    if (!sectionEl) return;
    
    const rect = sectionEl.getBoundingClientRect();
    const sectionHeight = sectionEl.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = sectionHeight - viewportHeight;
    
    if (scrollDistance <= 0) return;
    
    const scrolled = -rect.top;
    progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
  }

  onMount(() => {
    const unsubscribe = lenisStore.subscribe((lenis) => {
      if (!lenis) return;
      
      lenis.on('scroll', updateProgress);
      updateProgress(); // Initial calc
      
      return () => lenis.off('scroll', updateProgress);
    });
    
    return unsubscribe;
  });
</script>

<section bind:this={sectionEl} class="tall-section">
  <div class="sticky-content">
    <!-- Content transforms driven by `progress` -->
  </div>
</section>

<style>
  .tall-section {
    min-height: 300vh; /* Creates 200vh of scroll runway */
  }
  
  .sticky-content {
    position: sticky;
    top: 0;
    height: 100vh;
  }
</style>
```

---

## Key Lenis Properties

| Property | Type | Description |
|----------|------|-------------|
| `progress` | `number` | Global scroll progress (0–1) |
| `scroll` | `number` | Current scroll position |
| `velocity` | `number` | Current scroll velocity |
| `direction` | `1 \| -1` | Scroll direction (1 = down) |
| `isScrolling` | `boolean` | Whether actively scrolling |

---

## Key Lenis Methods

| Method | Description |
|--------|-------------|
| `on('scroll', fn)` | Subscribe to scroll events |
| `off('scroll', fn)` | Unsubscribe from scroll events |
| `scrollTo(target, opts)` | Programmatic scroll |
| `stop()` | Pause scrolling |
| `start()` | Resume scrolling |
| `destroy()` | Clean up instance |

---

## Do's and Don'ts

### ✅ Do

- Use CSS `position: sticky` for pinned content
- Subscribe to `lenis.on('scroll', ...)` for smooth updates
- Drive transforms directly from scroll position (no transitions)
- Create tall sections to give scroll runway for animations
- Clean up listeners in component unmount

### ❌ Don't

- Use `position: fixed` for scroll-linked content (causes lag)
- Add CSS transitions to scroll-driven transforms (fights Lenis)
- Hijack scroll events with `preventDefault()` (breaks Lenis)
- Use `window.addEventListener('scroll', ...)` directly (bypasses Lenis smoothing)

---

## Existing Scroll-Linked Components

| Component | Location | Behavior |
|-----------|----------|----------|
| `VerticalCarousel` | `$lib/components/sections/` | Two-column sticky carousel driven by scroll progress |
| `Carousel` | `$lib/components/sections/` | Horizontal drag carousel (not scroll-linked) |

---

## References

- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Lenis Demo](https://lenis.darkroom.engineering/)
- Store location: `src/lib/stores/lenis.ts`
- Global setup: `src/routes/+layout.svelte`


