---
name: High-Velocity Campaign Studio
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system drives an enterprise-grade campaign orchestration platform, full-featured CMS, and high-converting link-in-bio engine. The aesthetic fuses precision SaaS ergonomics with high-energy direct-response performance. It must evoke technical confidence, operational clarity, and immediate commercial momentum.

The design movement combines **Modern Corporate Precision** with **Functional Glassmorphism**:
- Crisp, slate-tinted structural boundaries maintain data density and prevent visual bleed.
- Targeted translucent overlays (`backdrop-blur-md`) focus attention on high-impact preview panes, drawer sheets, and live campaign simulators.
- High-contrast visual anchors (such as intense emerald conversion drivers) ensure call-to-action paths are unmistakable against slate and off-white backdrops.
- The interface accommodates dual operational paradigms: an ultra-clean, light analytical dashboard for front-facing CMS setup, paired with a dark-slate visual cockpit for complex campaign builders and backoffice telemetry.

## Colors

The palette delivers strict role separation between navigation, telemetry, conversion triggers, and background canvases:

- **Primary (`#2563EB` / `--primary-color`):** High-saturation cobalt. Drives systematic progression: primary form submissions, active tabs, timeline nodes, and configuration milestones.
- **Secondary (`#0F172A` / `--secondary-color`):** Deep charcoal slate. Establishes visual gravity for headers, primary typography (`--text-main`), dark status chips, and master navigation framing.
- **Tertiary / Conversion Accent (`#10B981` / `--accent-color`):** High-converting emerald. Reserved strictly for direct-response actions (WhatsApp direct messaging, payment triggers, conversion-rate positive indicators, and publish actions).
- **Neutral Light (`#F8FAFC` / `--bg-surface`):** Soft, cool zinc-white base for main dashboards, settings canvases, and standard content surfaces.
- **Dark Surface (`#1E293B` / `--dark-surface`):** Industrial deep slate for live ad simulators, telemetry hubs, code snippets, and high-focus backoffice command panels.

### Semantic & Border Rules
- **Structural Lines:** Use `rgba(226, 232, 240, 0.8)` (`border-slate-200/80`) in light workspaces and `rgba(51, 65, 85, 0.8)` (`border-slate-700/80`) in dark backoffice surfaces.
- **Conversion Priority:** Never use the emerald accent for non-conversion feedback; warnings and errors remain amber (`#F59E0B`) and rose (`#EF4444`).

## Typography

The typography system pairs **Plus Jakarta Sans** for expressive, forward-looking headings with **Inter** for dense, neutral data presentation and UI controls.

- **Headlines (Plus Jakarta Sans):** Tightly tracked with negative letter spacing to project authority, speed, and modern product polish. Used across primary campaign milestones, metrics readouts, and section dividers.
- **Interface & Content (Inter):** High x-height and balanced aperture ensure numerical figures, tabular CMS rows, campaign budget inputs, and mobile link lists remain instantly legible across variable display scales.
- **Badges & Labels:** `label-sm` utilizes uppercase rendering with loose tracking (`0.05em`) to generate high-contrast metadata pills and conversion tags without consuming excessive canvas space.

## Layout & Spacing

The layout is built on an adaptable 12-column grid system configured for data-rich workflows, paired with a strict 4px/8px incremental spacing scale.

### Grid & Canvas Structure
- **Desktop (1280px+):** 12-column fluid grid, `2rem` page margins, `1.5rem` gutters. Accommodates multi-pane layouts: collapsible global navigation (240px), dynamic builder canvas, and live phone/preview simulator (380px fixed).
- **Tablet (768px – 1279px):** 8-column layout, `1.5rem` page margins, `1rem` gutters. The live preview simulator transitions into an anchored side-drawer or toggleable overlay.
- **Mobile (320px – 767px):** 4-column layout, `1rem` page margins, `0.75rem` gutters. Enforces strict zero-overflow rules (`overflow-x: clip`), single-column vertically stacked widgets, sticky bottom action trays, and swipeable KPI carousels.

### Spacing Application
- `space-xs` (4px): Micro-gaps between status dots and text labels; nested button icon offsets.
- `space-sm` (8px): Form input inner vertical padding; gap inside segmented controls and chip groups.
- `space-md` (16px): Card internal padding; gaps between interdependent form fields and metric tiles.
- `space-lg` (24px): Inter-card margins; stack separation between distinct campaign sections.
- `space-xl` (40px): Section breaks within long-scroll CMS flows and primary dashboard module divides.

## Elevation & Depth

Visual depth is achieved through layered structural elevation combining tinted ambient shadows with precision edge lighting and frosted overlays.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Neutral background (`--bg-surface` or `--dark-surface`) with no shadow. Structural separation achieved strictly with `border-slate-200/80` (or `border-slate-700/80`).
- **Level 1 (Subtle Raise / Cards & Tables):** Applied to standard metric cards, list items, and configuration panels.
  - Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
  - Border: 1px solid `rgba(226, 232, 240, 0.8)`.
- **Level 2 (Interactive Floating / Dropdowns, Active Draggables):**
  - Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
  - Border: 1px solid `rgba(203, 213, 225, 0.8)`.
- **Level 3 (Command Layer / Modals, Drawer Sliders, Flyouts):**
  - Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.

### Functional Glassmorphism
Floating toolbars, sticky mobile conversion bars, and preview overlay headers utilize:
- Background: `rgba(255, 255, 255, 0.8)` (light) or `rgba(30, 41, 59, 0.8)` (dark).
- Backdrop Filter: `blur(12px)`.
- Keyline: Top and side borders use `rgba(255, 255, 255, 0.2)` on dark surfaces to produce a sharp light-catcher rim.

## Shapes

The geometric framework uses **Rounded (Value: 2)** geometry:
- **Standard Controls & Text Inputs:** `0.5rem` (8px) radius. Provides clear tactile definition without appearing overly playful or strictly industrial.
- **Cards, Preview Containers & Modals:** `1rem` (16px) radius (`rounded-lg`), creating distinct framing for ad layouts and analytics groupings.
- **Surface Canvas Modules:** `1.5rem` (24px) radius (`rounded-xl`) for top-level visual canvas blocks and live preview phone shells.
- **Pill Exception:** Status indicators, conversion tags, social platform handles, and live preview action links explicitly leverage full pill radiuses (`9999px`) to maintain high tactile clickability.

## Components

### Buttons
- **Primary CTA:** Cobalt (`--primary-color`), white text, `space-sm` vertical by `space-md` horizontal padding, `0.5rem` border radius, subtle inner border highlight (`inset 0 1px 0 rgba(255,255,255,0.2)`).
- **High-Conversion Action (WhatsApp / Live Publish):** Emerald (`--accent-color`), high-contrast dark slate (`#064E3B` or `#FFFFFF`) text, subtle pulse or elevation shift on hover.
- **Secondary / Ghost:** Transparent background, `1px solid rgba(226, 232, 240, 0.8)`, `--text-main` label. Hover shifts background to `rgba(241, 245, 249, 0.8)`.

### Form Inputs & Selectors
- Background: Pure `#FFFFFF` in standard views; `#0F172A` inside backoffice panels.
- Border: `1px solid rgba(203, 213, 225, 0.8)`. Focus shifts border to `--primary-color` with a 3px ring of `rgba(37, 99, 235, 0.15)`. Zero layout shift.
- Mobile Input Optimization: Enforced `44px` minimum tap target height, explicit `font-size: 16px` equivalent to prevent automated mobile OS zooming.

### Checkboxes & Radio Controls
- Base: 18px square (checkbox) or circle (radio), slate-300 border. Checked state transitions instantly to `--primary-color` fill with an optical white glyph.

### Cards & Module Containers
- **Light Dashboard Card:** Flat white background, `Level 1` elevation, slate border, `1rem` internal padding (`space-md`), `1rem` corner radius.
- **Dark Telemetry Card:** `#1E293B` background, subtle inner border glow (`rgba(255, 255, 255, 0.05)`), high-contrast white metrics with subdued slate-400 sublabels.

### Status Chips & Badges
- Strict color mapping: Active/Converting = Emerald background (`rgba(16, 185, 129, 0.1)`) with `#059669` text; Draft/Inactive = Slate background (`rgba(148, 163, 184, 0.1)`) with `#475569` text. Fully rounded pill architecture with `label-sm` typography.

### Specialized Campaign Components
- **Interactive Phone Frame (Link-in-Bio Preview):** Scaled container with `1.5rem` radius, ambient blur shadow (`0 25px 50px -12px rgba(15, 23, 42, 0.25)`), embedded within builder canvases to present zero-latency rendering of ad click-through pages.
- **Sticky Mobile Conversion Bar:** Docked viewport-bottom on mobile devices, glassmorphic backdrop (`backdrop-blur-md`), elevated border line, hosting the primary high-conversion CTA with zero horizontal scroll footprint.