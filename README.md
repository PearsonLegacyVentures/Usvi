# Tranquilitas — Usvi

Dedicated destination website by Tranquilitas Spa.

Built as a static, mobile-first website for Cloudflare Pages. Production host: usvi.tranquilitasspa.com.

## Deployment

Cloudflare Pages, production branch: main, framework preset: None, build command: none, output directory: / (repository root).

## Bookings

The booking request form composes a message for the Tranquilitas WhatsApp concierge; guests must explicitly send the message in WhatsApp to submit. Email contact fallback is provided. No booking or payment is confirmed before the concierge replies.

## SEO

Pre-rendered static HTML for each service, location and article; canonical URLs, sitemap, robots.txt, and page-level structured data.

## Cloudflare Pages production

Project: usvi
Production branch: main
Custom domain: https://usvi.tranquilitasspa.com

### Booking email provider
For secure request delivery, configure production environment variables `RESEND_API_KEY` and `BOOKING_FROM_EMAIL` in this Cloudflare Pages project. The website shows an explicit WhatsApp/email fallback if the secure delivery service is unavailable; it never claims a request was delivered when it was not.

### Safety and review
All appointments are enquiries pending local provider coverage, applicable professional requirements, property access and confirmation. No payment is collected in the request form.
