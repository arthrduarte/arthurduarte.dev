# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Arthur Duarte built with Next.js 16, React 19, and Tailwind CSS v4.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS v4, Base UI components (via shadcn)
- **Styling**: CSS-in-JS with `class-variance-authority` (cva) for component variants, `tailwind-merge` for class merging

### Directory Structure
- `app/` - Next.js App Router pages (layout.tsx, page.tsx, and route directories)
- `components/` - React components
  - `components/ui/` - Reusable UI primitives (Button, Drawer, HoverCard, etc.) based on Base UI
- `constants/` - Static data (projects, list-of-lists, timeline)
- `lib/utils.ts` - Utility functions (exports `cn()` for className merging)

### Import Aliases
Use `@/*` for root-relative imports (configured in tsconfig.json).

Example: `import { Button } from "@/components/ui/button"`

### Styling Patterns
- Dark mode is always enabled (`<html className="dark">`)
- Theme uses OKLCH color space with CSS custom properties defined in `globals.css`
- Primary font: Figtree (--font-sans), Monospace: Geist Mono (--font-geist-mono)
- Components use the `cn()` utility to merge Tailwind classes

### Component Conventions
- UI components in `components/ui/` wrap Base UI primitives with styling via `cva`
- Page components are server components by default; add `"use client"` for client interactivity
