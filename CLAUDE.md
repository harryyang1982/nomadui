# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KoNomad** - A digital nomad city guide & review platform for South Korea. Benchmarked against Nomads.com (formerly Nomad List), localized for Korean cities with 50+ city data points covering living costs, internet speed, safety, coworking spaces, and community features.

The PRD (`PRD.md`) is the source of truth for all feature requirements and UI specifications. Reference screenshots (`nomads-*.jpeg`) show the Nomads.com benchmark UI.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with SSR/SSG
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Database**: PostgreSQL via Supabase (includes auth and realtime)
- **Auth**: Supabase Auth (Google, Kakao social login)
- **Maps**: Kakao Maps API
- **Weather**: Korea Meteorological Administration (기상청) public API
- **Deployment**: Vercel

## Build & Dev Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run linter
npm run start        # Start production server
```

## Architecture Notes

- **Language**: Korean (한국어) is the primary UI language. All user-facing text should be in Korean unless specified otherwise.
- **Layout**: Homepage follows a 3-column city card grid + 1-column sidebar pattern (see PRD Section 4.3 for full wireframe).
- **Responsive breakpoints**: Mobile (<640px, 1 col, no sidebar), Tablet (640-1023px, 2 col, sidebar below), Desktop (1024px+, 3 col + sidebar).
- **City cards**: Load 12 initially, then lazy-load 12 more on "더 많은 도시 보기" click.
- **Sticky elements**: Navigation bar is always sticky. Filter/sort bar becomes sticky on scroll.
- **Floating elements**: Bottom CTA bar (non-logged-in users only, dismissible), Settings toggle (currency/temperature/cost basis) at bottom-left.
- **Performance targets**: LCP < 2.5s, FID < 100ms, CLS < 0.1, initial bundle < 200KB gzipped, images in WebP with lazy loading.

## Data Models

Two core models power the homepage (see PRD Section 7 for full schemas):
- **City**: 25+ fields including scores, costs, real-time weather/AQI, tags, and review counts
- **Review**: User reviews with ratings, stay duration, pros/cons tags, and engagement counts

## Development Phases

- **Phase 1 (MVP)**: Nav, Hero, Filter bar, City card grid, Footer, Floating CTA, Responsive
- **Phase 2**: Auth, Reviews, Sidebar widgets (traveling/new members), Stats, Tags, Voting
- **Phase 3**: Social proof, Press quotes, Meetup/Chat widgets, Bottom CTA, Settings toggle, Weather API, Analytics
