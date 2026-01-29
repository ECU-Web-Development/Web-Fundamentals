
# Tailwind CSS Survival Guide

This is a practical, “get stuff done” reference for Tailwind CSS.

## 0) Mental model (what Tailwind is)

- Tailwind is **utility-first CSS**: you compose styles by stacking small class names.
- You usually **don’t write much custom CSS**; you reuse patterns/components.
- When using Tailwind via a build step, unused classes are removed (tree-shaken).

## 1) Fast setup (3 common paths)

### A) CDN (quick demos only)

Good for learning/throwaway prototypes. Not recommended for production apps.

```html
<script src="https://cdn.tailwindcss.com"></script>
```

### B) Tailwind CLI (simple projects)

```bash
npm install -D tailwindcss
npx tailwindcss init
```

Create an input CSS file (e.g. `src/input.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Build:

```bash
npx tailwindcss -i ./src/input.css -o ./public/output.css --watch
```

### C) Frameworks (Vite/Next/etc.)

Use the framework’s Tailwind guide. The key idea is the same: Tailwind scans your
template files and emits only the classes you used.

## 2) The config file (what actually matters)

`tailwind.config.js` controls scanning + theme extensions.

Minimal example:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./public/**/*.html",
		"./src/**/*.{html,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

If styles “don’t work”, 80% of the time it’s a bad `content` glob.

## 3) Reading Tailwind classes (core vocabulary)

### Spacing

- Padding: `p-4`, `px-6`, `py-2`, `pt-8`
- Margin: `m-4`, `mx-auto`, `mb-3`
- Gaps: `gap-4`, `gap-x-6`, `gap-y-2`

### Layout

- Display: `block`, `inline-block`, `flex`, `grid`, `hidden`
- Sizing: `w-full`, `max-w-md`, `h-12`, `min-h-screen`
- Centering:
	- block: `mx-auto` (needs a width/max-width)
	- flex: `flex items-center justify-center`

### Typography

- Size/weight: `text-sm`, `text-lg`, `font-semibold`
- Color: `text-slate-700`, `text-white`
- Alignment/leading: `text-center`, `leading-relaxed`, `tracking-tight`

### Color & backgrounds

- Background: `bg-white`, `bg-slate-900`, `bg-blue-600`
- Gradients: `bg-gradient-to-r from-indigo-500 to-pink-500`

### Borders & radius

- Border: `border`, `border-slate-200`, `border-2`
- Radius: `rounded`, `rounded-lg`, `rounded-full`

### Effects

- Shadow: `shadow`, `shadow-lg`
- Opacity: `opacity-50`
- Blur: `blur`, `backdrop-blur`

## 4) Responsive design (mobile-first)

Prefix a class with a breakpoint:

- `sm:` (≥ 640px)
- `md:` (≥ 768px)
- `lg:` (≥ 1024px)
- `xl:` (≥ 1280px)

Example:

```html
<div class="p-4 md:p-8 lg:p-12">...</div>
```

Rule of thumb: write the mobile layout first, then add `sm:`/`md:` overrides.

## 5) States: hover, focus, active, disabled

Examples:

```html
<button class="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed">
	Save
</button>
```

Useful state modifiers:

- `hover:` `focus:` `active:`
- `disabled:`
- `focus-visible:`
- `group-hover:` (see “Group” below)

### Group & peer (power moves)

“Group” lets children respond to parent hover/focus.

```html
<a class="group block rounded-lg p-4 hover:bg-slate-50" href="#">
	<div class="font-semibold group-hover:text-blue-600">Title</div>
	<div class="text-slate-600">Description</div>
</a>
```

“Peer” lets siblings respond to an input state.

```html
<label class="block">
	<input class="peer" type="checkbox" />
	<span class="ml-2 text-slate-600 peer-checked:text-green-600">Enabled</span>
</label>
```

## 6) Flexbox + Grid recipes

### Common flex patterns

- Row, center vertically: `flex items-center`
- Center both axes: `flex items-center justify-center`
- Space between: `flex items-center justify-between`
- Wrap chips: `flex flex-wrap gap-2`

### Common grid patterns

- Simple grid: `grid grid-cols-1 md:grid-cols-3 gap-6`
- Card layout: `grid auto-rows-fr` (when you want equal-ish heights)

## 7) Making it look good fast (a starter “card”)

```html
<div class="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
	<h2 class="text-lg font-semibold text-slate-900">Card title</h2>
	<p class="mt-2 text-slate-600">Short supporting copy goes here.</p>
	<div class="mt-4 flex gap-3">
		<button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Primary</button>
		<button class="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50">Secondary</button>
	</div>
</div>
```

## 8) The 80/20 of good UI

- Use consistent spacing: prefer `4, 6, 8, 12` style scales.
- Use fewer colors: 1 brand color + neutrals.
- Use `max-w-*` for readable text (`max-w-prose` is great).
- Use `text-slate-*` for neutrals instead of pure gray.
- Prefer `rounded-lg`, `shadow-sm`, `border-slate-200` for modern defaults.

## 9) “Arbitrary values” (escape hatch)

If you need a one-off value:

- `w-[37rem]`
- `grid-cols-[200px_1fr]`
- `bg-[#0f172a]`
- `top-[calc(50%-1rem)]`

Use sparingly. If you keep repeating an arbitrary value, consider a theme token.

## 10) Dark mode

Tailwind supports media-based or class-based dark mode.

Class-based is common:

```js
// tailwind.config.js
module.exports = {
	darkMode: "class",
	content: ["./public/**/*.html"],
	theme: { extend: {} },
	plugins: [],
};
```

Then in HTML:

```html
<html class="dark">
	<body class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">...</body>
</html>
```

## 11) Custom CSS (when you actually want it)

Use custom CSS for:

- complex animations
- third-party widgets
- truly shared components where class strings get unwieldy

Prefer Tailwind’s `@layer` so your styles play nicely:

```css
@layer components {
	.btn {
		@apply inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium;
	}
	.btn-primary {
		@apply bg-blue-600 text-white hover:bg-blue-700;
	}
}
```

## 12) Organizing markup (avoid “class soup”)

Pick one:

- Extract a reusable component (React/Vue/etc.)
- Use `@apply` + a small set of component classes
- Use formatting + ordering conventions

Two practical tips:

- Put layout classes first: `flex ...`, `grid ...`, `w-*`, `p-*`
- Put color/typography near the end: `text-*`, `bg-*`, `border-*`

## 13) Debugging checklist

- The CSS file is actually loaded (check DevTools Network).
- Your `content` globs include the files where classes appear.
- You restarted the build watcher after changing config.
- You’re not generating class names dynamically (e.g. `"bg-" + color`).
	- Tailwind can’t see those at build time; use an explicit list or a mapping.
- If using CDN, don’t expect advanced build-time features.

## 14) Handy “cheat sheet” snippets

### Container-ish layout

```html
<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">...</div>
```

### Nice page background

```html
<body class="min-h-screen bg-slate-50 text-slate-900">...</body>
```

### Form input baseline

```html
<input class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" />
```

## 15) Next steps

- Learn the docs search flow: https://tailwindcss.com/docs
- Add Tailwind to one of the demos in this repo (CLI or framework)
- Build a small component set: buttons, inputs, cards, alerts

