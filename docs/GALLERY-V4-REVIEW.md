# Gallery refinement review

## Visual review

The existing black/gold palette, typography, service photography and copy remain. Home's two service rows now move independently and can be dragged. Hovering a card holds only its row; headings and gaps do not freeze the section. Keyboard focus, manual pause, offscreen state and reduced-motion preferences remain respected.

Shared video testimonials now use tall portrait cards with gradient attribution overlays and compact watch/expand actions. They appear on Home, Results and the existing Program testimonial placement. Quotes and roles absent from the source records remain omitted, and preview-only publication restrictions remain intact. With only three eligible records, wide screens can show all three; arrows are disabled when there is nothing further to scroll.

Bathrobe's six verified conversations use wide video cards with titles below the image, continuous desktop movement, dragging and arrow controls. About retains its prior layout. Silent previews and gallery motion have separate pause controls. Full videos open in a keyboard-accessible dialog; source links remain available without JavaScript.

Reviewed screenshots are in comparison-v4/before and comparison-v4/after. They cover the three affected sections at 320, 390, 768, 1024 and 1440 pixels, plus actual Chrome 200% zoom. Poster captures use reduced motion for stable comparisons. A separate live-preview capture documents the moving conversation row. The layout is closer to the references in card proportions, imagery and overlay placement, while retaining Loren's branding.

## Technical validation

- Astro type check: no errors, warnings or hints.
- Existing unit/regression suite: 22 passing tests.
- Node and Vercel builds completed successfully.
- Migration verification: 41 routes and 1,524 internal references, no failures.
- Gallery browser suite: responsive layouts, scoped accessibility checks, independent movement/hover, drag suppression, dialog and focus recovery, and no-JavaScript links.
- Preview-state checks: muted playback, maximum three concurrent previews, pause, dialog interruption, offscreen stopping and reduced-motion fallback.
- Actual 200% Chrome zoom: all three affected sections have no horizontal document overflow.
- Live YouTube dialog playback confirmed advancing with audio unmuted after explicit selection. Silent YouTube previews also played in the live browser.

Detailed machine-readable results: gallery-v4-qa.json, gallery-v4-media-qa.json and gallery-v4-live-playback.json. Browser/provider autoplay restrictions can still select the designed poster fallback. No testimonial publication permissions or form-provider configuration changed in this update.
