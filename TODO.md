- [x] Remove delhi-office entry from locations array in src/components/contact/VirtualTour.tsx
- [x] Delete public/images/office-delhi.jpg file
- [x] Update docs/VIRTUAL_TOUR_IMPROVEMENTS.md to remove references to office-delhi.jpg

## Phase 1: Core Content & Proof - Roadmap Implementation

### 1. Projects / Case Studies Deep Dive
- [x] Build dedicated pages per project
- [x] Include problem, approach, architecture diagram, tech stack, results / impact
- [x] Include visuals/screenshots / mockups
- [x] Create dynamic route `app/portfolio/[id]/page.tsx` for individual project case studies
- [x] Add comprehensive metadata generation for SEO (title, description, Open Graph)
- [x] Implement server-side data fetching from Supabase for project details
- [x] Map database fields to the required format for the component
- [x] Build `src/components/portfolio/CaseStudyDetail.tsx` with sections for hero, problem, solution, architecture, tech stack, results, screenshots, client testimonial
- [x] Update `src/pages/Portfolio.tsx` to remove modal functionality and add navigation links to individual project pages
- [x] Update `scripts/seed-database.ts` to include sample project data with all required fields (3 comprehensive case studies)
- [x] Note: Database seeding requires Supabase environment variables (`NEXT_PUBLIC_SUPABASE_DATABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`)

### 2. Testimonials & Client Logos
- [x] Collect real quotes + client names/logos (placeholder logos implemented)
- [x] Place them in homepage, services pages
- [x] Create `src/components/home/ClientLogos.tsx` with placeholder client logos and company information
- [x] Add ClientLogos component to Home page (below testimonials)
- [x] Add TestimonialsCarousel component to Services page
- [x] Add ClientLogos component to Services page
- [x] Update seed-database.ts to include logo fields in testimonials for future real data

## Phase 1: Core Content & Proof - Projects / Case Studies Deep Dive
- [x] Build dedicated pages per project (/portfolio/[id])
- [x] Include problem, approach, architecture diagram, tech stack, results / impact
- [x] Include visuals/screenshots / mockups
- [x] Create CaseStudyDetail component with comprehensive project information
- [x] Update portfolio page to link to individual project pages instead of modal
- [x] Remove modal functionality and use dedicated pages for better SEO and UX

## Roadmap Implementation

### Phase 1: Core Content & Proof
- [ ] Projects / Case Studies Deep Dive
  - [ ] Build dedicated pages per project
  - [ ] Include problem, approach, architecture diagram, tech stack, results / impact
  - [ ] Include visuals/screenshots / mockups
- [ ] Testimonials & Client Logos
  - [ ] Collect real quotes + client names/logos
  - [ ] Place them in homepage, services pages
- [x] Team Profiles
  - [x] Add photos, bios, roles, social links
  - [x] Increase credibility
  - [x] Enhanced team page with 8 comprehensive profiles including detailed bios and social links
  - [x] Added avatar support for Faisal Khan using existing team photo
  - [x] Implemented social media integration (LinkedIn, GitHub, Twitter, Dribbble)
  - [x] Improved team member cards with better layout and accessibility
- [x] Complete Services Pages
  - [x] For each offering, add process, deliverables, benefits, examples
  - [x] Include "Why choose us for Web Dev / AI / CRM" differentiation
  - [x] Added "Why Choose Us" section with category-specific differentiation points
  - [x] Added "Our Proven Process" section with 5-step methodology for each service category
  - [x] Enhanced service cards with comprehensive benefits, deliverables, and case studies
  - [x] Integrated testimonials and client logos sections
  - [x] Dynamic content that changes based on selected service category
- [x] Functional Lead Capture
  - [x] Build contact / demo request forms (with validation, CAPTCHA, spam protection)
  - [x] Integrate to CRM / email / lead management
  - [x] Enhanced GeneralInquiryForm with Google reCAPTCHA and honeypot spam protection
  - [x] Created DemoRequestForm with comprehensive fields (company info, scheduling, requirements)
  - [x] Built /api/leads endpoint for CRM integration with Supabase
  - [x] Added reCAPTCHA server-side verification
  - [x] Implemented dual submission (CRM + email notification)
  - [x] Added lead tracking with IP address, user agent, and source identification
- [x] Help Center / Documentation
  - [x] Create knowledge base or FAQ for clients / prospective clients
  - [x] Populate with guides, FAQ, technical documentation
  - [x] Enhanced existing FAQ system with search, categories, voting, and admin management
  - [x] Created comprehensive Documentation Center (/docs) with 6 categories and 17 articles
  - [x] Added search functionality, article categorization, and professional layout
  - [x] Included technical guides, tutorials, API references, and best practices

### Phase 2: Technical & SEO
- [ ] SEO & Metadata / Structured Data
  - [ ] Add meta titles, descriptions for all pages
  - [ ] Open Graph & Twitter card tags
  - [ ] JSON-LD schema (Organization, Breadcrumbs, WebPage, Service)
- [ ] Performance Optimization
  - [ ] Image optimization (lazy load, WebP)
  - [ ] CSS / JS minification, code splitting
  - [ ] Caching / CDN setup
  - [ ] Audit via Lighthouse / PageSpeed
- [ ] Security Hardening
  - [ ] HTTP headers (CSP, HSTS, XSS, X-Frame, etc)
  - [ ] Rate limiting, WAF (web application firewall)
  - [ ] Penetration / vulnerability tests
- [ ] Analytics & Tracking
  - [ ] Insert Google Analytics / GA4, Google Tag Manager
  - [ ] Conversion tracking (form submits, clicks)
  - [ ] Heatmaps / session recording tools (hotjar, etc)
- [ ] Responsive / Accessibility
  - [ ] Ensure mobile layouts are fully usable
  - [ ] ARIA roles, alt text, keyboard navigation
  - [ ] Color contrast checks, screen reader testing
- [ ] Custom Errors / 404 Page
  - [ ] Design branded 404 / 500 error pages
  - [ ] Provide navigation / search fallback

### Phase 3: Advanced / Growth Features
- [ ] Blog / Insights / Content Hub
  - [ ] Publish articles, whitepapers, technical insights
  - [ ] Helps SEO, positions you as thought leader
- [ ] Localization / Multi-language Versions
  - [ ] If targeting multiple geographies (India, MENA, USA, etc), create localized versions
  - [ ] Adjust content, currency, addresses
- [ ] Chat / Bot / Live Support Widget
  - [ ] Add live chat or chatbot for lead capture and support
- [ ] Dynamic Client Portal / Dashboard
  - [ ] For existing clients, a login area / portal to monitor project status, docs, support tickets
- [ ] Marketing Integrations
  - [ ] Email marketing, CRM automation (HubSpot, Salesforce, etc)
  - [ ] Retargeting scripts (Facebook Pixel, LinkedIn)
- [ ] API / Integration Showcases
  - [ ] If you build systems that integrate with external APIs (payment, ERP, etc), showcase those in services / case studies

### Quick Checklist
- [x] Audit all navigation links — ensure none are broken or lead to empty pages
- [ ] Remove / replace placeholder counters ("0+", "Loading…")
- [x] Implement form validation & spam protection
- [ ] Run performance test (Lighthouse) and address critical issues
- [ ] Run an SEO audit (crawl, missing meta tags, broken links)
- [ ] Run a security scan / vulnerability assessment
- [ ] Back up all code / CMS and ensure version control (Git)
- [ ] Write proper legal text (privacy, terms) tailored to jurisdictions
- [ ] Test on multiple devices / browsers
