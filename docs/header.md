# Header

[Source](../src/components/Header.astro). Shared site navigation and theme toggle.
[BaseLayout](base-layout.md) includes it automatically.

```astro
---
import Header from '../components/Header.astro';
---

<Header />
```

There are no props or slots. The brand links home. Navigation contains Home,
Philosophy, Blog, and Commonbook. Large screens use horizontal links; smaller
screens use a dropdown. The two navigation lists are separate in the source,
so update both when changing links.

The checkbox theme controller selects DaisyUI's `dracula` dark theme. When
unchecked, the base layout's `bumblebee` light theme applies. The inline script
stores and restores the checkbox state under the localStorage key
`themeToggleChecked`. Sun and moon icons come from `astro-icon` and the site's
`src/icons/ui/` directory. The component does not expose a theme prop.
