<!--
  @component PreviewBanner
  Banner shown when preview mode is active to indicate draft content is visible.
-->
<script lang="ts">
  /**
   * @description Displayed at the bottom of the screen during preview mode.
   * Provides a visual indicator and exit link.
   */
</script>

<div class="preview-banner" role="alert" aria-live="polite">
  <span class="preview-banner__label">Preview Mode</span>
  <span class="preview-banner__description">You're viewing draft content</span>
  <a href="/api/preview/exit" class="preview-banner__exit">Exit Preview</a>
</div>

<style>
  .preview-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: var(--color-accent, hsl(340, 80%, 50%));
    color: white;
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-4, 1rem);
    font-size: var(--text-sm, 0.875rem);
  }

  .preview-banner__label {
    font-weight: 600;
  }

  .preview-banner__description {
    opacity: 0.9;
  }

  .preview-banner__exit {
    color: white;
    text-decoration: underline;
    margin-left: var(--space-4, 1rem);
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius-sm, 4px);
    transition: background var(--transition-fast, 150ms);
  }

  .preview-banner__exit:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 640px) {
    .preview-banner {
      flex-wrap: wrap;
      text-align: center;
    }

    .preview-banner__description {
      display: none;
    }
  }
</style>


