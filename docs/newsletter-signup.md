# NewsletterSignup

[Source](../src/components/NewsletterSignup.astro). A newsletter signup form
connected to David Amos's Buttondown account. It appears on the homepage and
below published blog posts. Unlisted draft previews omit it.

```astro
---
import NewsletterSignup from '../components/NewsletterSignup.astro';
---

<NewsletterSignup />
```

Adjust the import path for the file's location.

| Prop | Required | Default or purpose |
| --- | --- | --- |
| `id` | No | `newsletter-signup`; prefix for the heading and email field IDs. Use a different value for each instance if a page has more than one form. |
| `title` | No | `Subscribe`; section heading. |
| `description` | No | `Get weekly updates from my blog delivered straight to your inbox.` |

The form inherits the site's fonts and theme colors. It uses the shared
handwritten divider and the heading ink color for the Subscribe button.
It places the email field
beside the Subscribe button when space allows and stacks them on narrow screens.
The email field has a visible label, email autofill, and native browser validation.

Submission uses a standard HTML POST to Buttondown. Buttondown handles the next
step, including any verification or errors. The form needs no API key or client
JavaScript. To connect a different account, update the form action and referral
link in the component.

## Signup redirect pages

After deploying the site, configure these two URLs in Buttondown:

| Buttondown field | URL | When readers see it |
| --- | --- | --- |
| `subscription_redirect_url` | `https://davidamoswrites.com/newsletter/confirm/` | After submitting the signup form; asks them to check their inbox. |
| `subscription_confirmation_redirect_url` | `https://davidamoswrites.com/newsletter/thanks/` | After clicking the confirmation link in their email; thanks them for subscribing. |

These are static landing pages. Buttondown handles email confirmation and
subscription status. Visiting either URL directly does not change a subscription.
The form does not set the redirect destinations; configure them in Buttondown.

Both pages use the site layout and handwritten dividers. They include `noindex`
metadata and are excluded from the sitemap.
