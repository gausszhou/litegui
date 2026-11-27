# Component source layout

A component keeps its interaction logic and its component-specific styles in the
same folder:

```
components/
  Button.ts
  Button.scss
  Checkbox.ts
  Checkbox.scss
  ...
```

Rules:

- `PascalCase.ts` is the implementation; `PascalCase.scss` is the base style for
  that component. Both files should change together.
- Shared shell / cross-component styles stay in `../styles/`:
  - `theme.scss` — design tokens (Blender Dark/Light)
  - `blender.scss` — default Blender theme overrides
  - `layout.scss` — app shell, Panel/Dialog docking shell
  - `style.scss` — legacy global look & feel helpers
  - `normalize.scss`, `scrollbar.scss`, `file-list.scss`
- `styles/index.scss` is the single stylesheet entry used by Vite, docs and
  elements. It imports component SCSS from here plus the shared styles above.
- Panel/Dialog base shell styles live next to their TS files; the Blender visual
  overrides remain in `../styles/blender.scss`.
