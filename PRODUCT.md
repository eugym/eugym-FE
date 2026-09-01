# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (landing page audience):** an individual in Nigeria choosing a gym for
themselves. They are comparing options on price, how many locations they can
actually use, and whether a real trainer is involved. They arrive on a phone as
often as a desktop.

Nine authenticated roles exist in the product (SRS §2.3):

| Role | Situation and job |
|---|---|
| Visitor | Browsing before committing. Can buy merchandise with only email + phone. |
| Regular (free) | Wants free value — AI trainer, daily tips, free outdoor events. No facility access. |
| Standard | Trains at one designated centre; books group classes. |
| Premium | Trains at any Eugym centre plus affiliate hotel gyms nationwide; has an assigned personal trainer and diet/workout plans. |
| Trainer | Onboarded by an admin. Manages an assigned schedule, premium clients, and group plans. |
| Admin | Manages users, trainers, merchandise, classes/events; assigns trainers to premium users. |
| Super Admin | Everything an admin does, plus administrator accounts and system-wide reporting. |
| Affiliate Partner | A hotel or gym partner. Logs premium member check-ins and reads monthly settlement statements. |
| Corporate Admin | An HR/wellness officer. Onboards staff in bulk, assigns them Standard or Premium, reads usage reports. |

## Product Purpose

Eugym sells fitness access in Nigeria as a tiered membership rather than a
single gym subscription. Success is a visitor choosing a paid tier and then
actually using it — booking classes, attending sessions, checking in at centres.

## Positioning

The mechanism a single-location gym cannot copy: **one membership, many
buildings.** Premium members train at any Eugym centre *and* at partner hotel
gyms nationwide, with visits tracked per partner and settled monthly. The
affiliate network and the corporate bulk package are both consequences of that
same mechanism.

Two further product facts a competitor would have to build, not claim:
- **Upgrade-only pro-rata billing** across daily → weekly → monthly → quarterly
  → bi-annual → annual cycles (SRS §2.5).
- **Admin-assigned personal trainers** for Premium, rather than self-service
  trainer browsing.

## Operating Context

- Nigeria-wide. Prices are in Naira (₦). Phone numbers are local format and
  begin with a leading zero — a `number` input silently destroys them.
- Payments run through Paystack, with a POS/bank-transfer fallback that an admin
  confirms manually. Not every member pays by card.
- Members arrive on mobile frequently; the dashboard must survive small screens.
- Corporate buyers evaluate on reporting and staff administration, not on
  training content.

## Capabilities and Constraints

Confirmed and working: authentication with role-based dashboards, subscriptions
and pro-rata upgrades, class/booking management, centres and affiliate visit
check-in, merchandise catalogue and orders, corporate staff CRUD, affiliate
settlements, admin reporting.

Not yet built (must not be implied as available):
- Workout/diet plan delivery (Premium Content)
- Trainer-authored group plans
- Corporate billing screens
- A contact-form endpoint
- Real payment capture in the store checkout

Terminology: *centre* (not "branch"), *affiliate partner* (not "franchise"),
*member* for a paying user, *visitor* for an unauthenticated browser.

## Brand Commitments

- **Green `#19b24b` remains the primary brand colour.** Confirmed by the user.
- **Real gym and training photography remains the dominant visual material** —
  not illustration, not abstract graphics. Confirmed by the user.
- The existing EUGYM FITNESS logo (gold barbell mark + wordmark) is in use at
  `public/asset/logo.png`.
- Everything else — typography, layout system, supporting palette, component
  language — is explicitly open to redesign.

## Evidence on Hand

Real, in the repository:
- Gym and training photography (`public/images/`, plus Unsplash-hosted centre
  images returned by the API).
- Five seeded centres across Lagos, Lekki, Abuja and Ikeja, one of which is an
  affiliate (Eko Hotel Gym).
- A live API with ~60 endpoints backing trainers, classes, centres, orders,
  subscriptions and reporting.

Claims currently on the site that are **not** independently verified: the
"50,000+ Nigerians" membership figure and the "Access Nigeria's Largest Fitness
Network" superlative. The user has asked to leave these values as they stand for
now. Do not invent additional figures, testimonials, partner names, press
mentions or certifications beyond what is already present.

## Product Principles

1. **Access is the product.** Every surface should make it obvious *where* a
   membership lets you train and *who* you train with. That is the differentiator.
2. **The tier ladder must be legible at a glance.** Regular → Standard → Premium
   is the core commercial decision; a visitor who cannot tell the tiers apart
   does not convert.
3. **Never claim more than the product does.** Unbuilt features are marked as
   coming, not implied as available. Unverified figures are not multiplied.
4. **Nigerian by default.** Naira, local phone formats, local cities, and
   mobile-first weighting are the baseline, not an adaptation.
5. **Roles see only their own job.** Nine roles share one shell; each should feel
   like the app was built for them, not like a general app with parts hidden.

## Accessibility & Inclusion

No formal standard has been mandated by the user. Working target is WCAG 2.1 AA
for text contrast and keyboard operability.

Known open issue: the dashboard sidebar surface (`--sidebar-surface`, `#19b24b`)
measures **2.80:1** against white label text, below the 4.5:1 AA minimum. The
user has chosen to keep the colour for now, pending a standard application
theme. Passing alternatives in the same hue if revisited: `#0f7a33` (5.45:1),
`#0b5227` (9.33:1).
