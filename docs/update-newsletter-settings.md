# How to update newsletter settings

1. Open [src/components/NewsletterSignup.astro](../src/components/NewsletterSignup.astro). Edit the default `title` and `description` near the top, and the visible `Subscribe` button text if needed.
2. To change accounts, replace `davidamos` in the form's `action` with your Buttondown username and update the credit's referral link. Keep the normal HTML POST form; compare it with [Buttondown's embed instructions](https://docs.buttondown.com/building-your-subscriber-base).
3. Edit [src/pages/newsletter/confirm.astro](../src/pages/newsletter/confirm.astro) and [src/pages/newsletter/thanks.astro](../src/pages/newsletter/thanks.astro) if the follow-up page copy needs changing.
4. [Preview locally](preview-locally.md). Check the homepage form, a published article's form, and both follow-up pages, then [deploy changes](deploy-changes.md).
5. In Buttondown's newsletter settings, configure the redirects below. These are Buttondown settings, not fields to add to the site's form; the [official field descriptions](https://docs.buttondown.com/api-newsletters-introduction) explain their timing.

   - `subscription_redirect_url`: `https://davidamoswrites.com/newsletter/confirm/` — after submitting the form, before email confirmation.
   - `subscription_confirmation_redirect_url`: `https://davidamoswrites.com/newsletter/thanks/` — after confirming through the email link.

6. Use an email address you control to test signup on the live site. Check the initial redirect, confirmation email, and final redirect. Opening a follow-up page directly does not confirm a subscription.
