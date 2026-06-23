# Arthur's Archive Setup

This guide covers local development, deployment, and manual verification for Arthur's Archive.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Purpose |
|----------|----------|---------|
| `STORAGE_DATABASE_URL` | Yes | Neon Postgres connection for the app |
| `STORAGE_DATABASE_URL_UNPOOLED` | Recommended | Direct Neon URL for `drizzle-kit migrate` |
| `SESSION_SECRET` | Yes | Signs admin session cookies |
| `DASHBOARD_PASSWORD` | Yes* | Admin login password |
| `DASHBOARD_PASSWORD_HASH` | Yes* | Alternative to plain password (`scrypt:salt:hash`) |
| `BLOB_READ_WRITE_TOKEN` | For uploads | Vercel Blob token for pasted/uploaded images |

\* Set one of `DASHBOARD_PASSWORD` or `DASHBOARD_PASSWORD_HASH`.

External image URLs work without Blob storage. File upload and clipboard paste require `BLOB_READ_WRITE_TOKEN`.

## Database setup

```powershell
bun install
bun run db:migrate
```

If tables already exist but Drizzle's migration journal is out of sync:

```powershell
bun run db:baseline
bun run db:migrate
```

Other database commands:

- `bun run db:generate` — generate SQL from schema changes
- `bun run db:push` — push schema directly (useful for local experiments)

## Vercel Blob setup

1. Open your Vercel project → **Storage** → **Create Blob store**
2. Connect the store to this project
3. Copy `BLOB_READ_WRITE_TOKEN` into `.env.local` and Vercel project env vars
4. Redeploy after adding the token in production

Uploaded images are stored under the `archive/` prefix. Neon only stores the public URL.

## Local development

```powershell
bun run dev
```

Routes:

- Public archive: [http://localhost:3000/archive](http://localhost:3000/archive)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Admin archive: [http://localhost:3000/admin/archive](http://localhost:3000/admin/archive)
- Admin trash: [http://localhost:3000/admin/archive/trash](http://localhost:3000/admin/archive/trash)

Legacy redirect: `/list-of-lists` → `/archive`

Run tests:

```powershell
bun run test
bun run build
```

## Deployment (Vercel)

1. Set all required environment variables in the Vercel project
2. Prefer `STORAGE_DATABASE_URL_UNPOOLED` for migration scripts run in CI or locally against production
3. Connect Vercel Blob and add `BLOB_READ_WRITE_TOKEN`
4. Run migrations against production before or during deploy:

   ```powershell
   bun run db:migrate
   ```

## Manual verification checklist

Use this after setup or before considering the archive feature complete.

### Public archive (`/archive`)

- [ ] Active items render in the scrapbook grid
- [ ] Soft-deleted items do not appear
- [ ] Card click opens the original URL in a new tab
- [ ] **Note** button opens the read-only side drawer
- [ ] Side drawer shows note, tags, favorite state, image (when present), and visit link
- [ ] Items without images use the text-first fallback
- [ ] Tag filters narrow the visible items
- [ ] Favorites toggle works
- [ ] Search matches title, URL, note, or tag
- [ ] `/list-of-lists` redirects to `/archive`

### Admin auth

- [ ] `/admin/archive` redirects to login when logged out
- [ ] `/admin/archive/trash` redirects to login when logged out
- [ ] Login with `DASHBOARD_PASSWORD` succeeds
- [ ] Session persists across page refresh
- [ ] Logout returns to unauthenticated state

### Archive management

- [ ] Create item with title, URL, note, tags, and favorite
- [ ] Edit item updates public `/archive`
- [ ] Tag reuse and new tag creation work
- [ ] Soft delete requires a reason
- [ ] Deleted item leaves public and active admin lists
- [ ] Trash shows title, URL, tags, deleted date, and reason
- [ ] Restore returns item to public archive

### Metadata prefill

- [ ] Prefill populates title/description/source/image when available
- [ ] Prefilled fields remain editable
- [ ] Item can still be saved when metadata is missing
- [ ] Invalid URL shows a recoverable warning
- [ ] Blocked or failing fetch shows a recoverable warning

### Images

- [ ] External image URL saves and renders without Blob
- [ ] File upload stores in Blob and renders publicly (requires token)
- [ ] Clipboard paste stores in Blob (requires token)
- [ ] Items without images save and render cleanly
- [ ] Soft delete and restore do not change stored image URLs
