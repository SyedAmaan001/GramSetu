# PS-02 — GramConnect

**Track 04 · Rural Innovation** — Innovators Conclave 2026, 24-hour prototype build.
Source: `ALL_PROBLEM_STATEMENTS.pdf`, page 15 (condensed here; that PDF is the source of truth).

## Objective

Develop a technology platform that helps rural residents discover, access and coordinate essential local services and information without depending on smartphones, constant internet connectivity or extensive digital literacy.

## Background

Accessing a service can cost a rural resident real time and travel: the nearest government service centre, bus timings, drinking-water points, community facilities, local skilled workers, repair services, office hours, public announcements, emergency and utility information. That information is fragmented across local offices, notice boards, phone calls, community groups and word of mouth.

The challenge grows where residents have limited connectivity or digital literacy, or no smartphone. The objective is a **digital access layer for the village** that connects residents to verified local information through simple interfaces — voice, SMS, IVR, a lightweight app or a shared community kiosk.

Constraints named explicitly: fragmented information, patchy connectivity, low digital literacy, no smartphone, unverified sources.

## The question our system must answer

> "When a resident asks in their own words — 'I need a plumber near my village' — can the system return a verified, local, actionable answer over voice or SMS?"

## Suggested approaches (not a checklist)

Voice & IVR · SMS / low-bandwidth · local-language NLU · verified directory · location-aware discovery · community kiosk mode · lightweight app · source attribution · offline-first caching · admin console.

## Expected deliverables

- Resident-facing interaction (simple voice, SMS, IVR or kiosk flow)
- Local service directory (verified people, facilities, resources)
- Request understanding (plain request → service intent)
- Location-aware discovery (nearest relevant option, with availability)
- Low-bandwidth access (voice, SMS or offline-tolerant delivery)
- Verified information (source attribution for every answer given)
- Service workflow & demo (contact or escalate, end-to-end on a real scenario)
- Community admin interface (local management of listings and notices)

## ⚠️ Trust & verification requirement

The platform must prioritise local relevance, accessibility and reliability over functioning as a generic information portal. **Every answer should be traceable to a verified source, and the system must say so when it does not know.**

## Expected outcome

A rural digital-access platform that reduces the time and effort required for residents to discover local services and essential information.

## Evaluation criteria (100 marks total)

**Round One — Ideation & Prototype (50):** Problem Understanding & Relevance (10) · Innovation & Originality (10) · Technical Feasibility & Approach (10) · Prototype & Progress Demonstrated (10) · Impact & Scalability Potential (5) · Presentation & Clarity of Pitch (5).

**Round Two — Final Build & Defence (50):** Functionality & Working Demo (15) · Technical Depth & Code Quality (10) · UI/UX & Usability (5) · Completeness vs. Proposed Scope (5) · Viability & Deployment Readiness (5) · Q&A Handling & Team Contribution (5) · Final Presentation & Demo Delivery (5).

**Where marks are lost (Track 04 specific):** a demo that doesn't run live · scope promised in R1, not delivered in R2 · only one team member able to answer questions · no answer to connectivity or cost constraints · a prototype that only works on a desk.
