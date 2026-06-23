## Problem Statement

Arthur currently has a static "List of Lists" page that behaves like a curated directory of links stored in the codebase. That does not match the intended product: Arthur's Archive should feel like a messy but browsable personal dump of internet gold nuggets collected over years.

The current implementation also makes every new archive entry a code change. Arthur wants to add links, images, notes, tags, and favorites directly from the website without touching the repository. The archive should remain public to read, but private to write.

## Solution

Build Arthur's Archive as a public visual archive backed by the existing Neon Postgres database, with a password-protected admin dashboard for managing entries.

The public experience should feel like a personal internet scrapbook: visual, tag-driven, imperfect, and browsable. Cards should open the original URL by default, while a side sheet provides Arthur's note and metadata. Images are optional; entries without images should still look intentional through graceful text-first fallbacks.

The admin experience should be a simple dashboard under `/admin`, starting with archive management and trash. Arthur should be able to paste a URL, optionally prefill metadata from the target page, paste/upload an image to Vercel Blob, assign freeform tags using a dropdown of existing tags, mark an item as favorite, edit existing entries, and soft-delete entries with a required deletion reason. Deleted entries should move to `/admin/archive/trash` and be restorable.

## User Stories

1. As a visitor, I want to browse Arthur's Archive visually, so that I can explore what Arthur has been collecting online without reading a professional-looking directory.
2. As a visitor, I want archive items to open their original URLs by default, so that I can quickly inspect the source material.
3. As a visitor, I want to open a side sheet for an archive item, so that I can read Arthur's note without leaving the archive.
4. As a visitor, I want to filter archive items by tag, so that I can browse related finds across overlapping topics.
5. As a visitor, I want to filter or identify favorite items, so that Arthur's strongest recommendations stand out.
6. As a visitor, I want items without images to still look polished, so that the archive remains usable even when a source has no good visual asset.
7. As a visitor, I want to search archive items, so that I can find something specific by title, note, URL, or tag.
8. As a visitor, I want `/list-of-lists` to redirect to `/archive`, so that old links still work after the rebrand.
9. As Arthur, I want to log in to `/admin` with a password, so that only I can manage archive data.
10. As Arthur, I want admin authentication to use environment variables, so that I do not need a users table or registration system.
11. As Arthur, I want `/admin/archive` to list active archive items, so that I can review and manage what is currently public.
12. As Arthur, I want to add a new archive item from a URL-first form, so that dumping a new find is fast.
13. As Arthur, I want URL metadata to prefill title, description, image, and source site when available, so that adding items takes less manual typing.
14. As Arthur, I want URL metadata failures to be non-blocking, so that I can still add items from sites that block scraping or have poor metadata.
15. As Arthur, I want to manually edit all prefilled metadata, so that the final archive item reflects my taste instead of the source site's defaults.
16. As Arthur, I want to paste an image from my clipboard, so that I can add screenshots without saving files locally.
17. As Arthur, I want to upload/select an image file, so that I can attach images that are already on my machine.
18. As Arthur, I want to paste an external image URL, so that I can use hosted images without uploading them.
19. As Arthur, I want pasted and uploaded images to be stored in Vercel Blob, so that the database only stores image URLs.
20. As Arthur, I want image URLs to stay untouched when an item is moved to trash, so that restoring an item also restores its image.
21. As Arthur, I want to assign freeform tags to an item, so that the archive taxonomy can evolve naturally.
22. As Arthur, I want the tag input to show a dropdown of existing tags, so that I can reuse previous tags without enforcing a rigid category system.
23. As Arthur, I want new tags to be created automatically when I type them, so that tag management does not require a separate screen in v1.
24. As Arthur, I want duplicate tags to be normalized by slug, so that `Design`, `design`, and `design engineering` do not fragment unexpectedly.
25. As Arthur, I want no primary category field, so that items can belong to multiple overlapping topics through tags.
26. As Arthur, I want to mark any item as favorite, so that special entries can receive visual emphasis and filtering.
27. As Arthur, I want favorite to be a boolean flag, so that it remains simple and independent from tags.
28. As Arthur, I want to edit existing archive items, so that I can fix typos, improve notes, replace images, and adjust tags.
29. As Arthur, I want to delete an item only after entering a reason, so that removing something from the archive leaves an editorial record.
30. As Arthur, I want deleted items to disappear from the public archive, so that visitors only see active archive entries.
31. As Arthur, I want deleted items to disappear from the active admin archive list, so that `/admin/archive` stays focused on current entries.
32. As Arthur, I want deleted items to move to `/admin/archive/trash`, so that removals are reviewable later.
33. As Arthur, I want `/admin/archive/trash` to show each deleted item's deletion reason and deletion date, so that I can understand why it was removed.
34. As Arthur, I want to restore deleted items from trash, so that accidental or temporary removals are reversible.
35. As Arthur, I want the admin area to use a simple dashboard layout, so that future admin tools like todo or important dates can fit into the same shell.
36. As Arthur, I want `/admin/archive` and `/admin/archive/trash` to be protected, so that private editorial data and deletion reasons are not public.
37. As Arthur, I want sessions to remain active across page refreshes, so that the admin panel is practical to use.
38. As Arthur, I want a logout control, so that I can end an admin session intentionally.
39. As an implementer, I want the current static list data to remain unmigrated, so that the new database starts empty as requested.
40. As an implementer, I want the existing Neon environment variables to be reused, so that no new database project is required.

## Implementation Decisions

- Rename the public feature from "List of Lists" to "Arthur's Archive".
- Use `/archive` as the public route.
- Redirect `/list-of-lists` to `/archive`.
- Update visible navigation, homepage links, and timeline references from the old "list of lists" wording to the new archive wording where applicable.
- Keep the existing static `constants/list-of-lists.ts` data out of the new database. Do not seed the database from it.
- Use the existing Neon Postgres connection from local and deployment environment variables. Prefer the existing storage database URL variables already present in the project environment.
- Use Drizzle ORM for database schema, migrations, and queries.
- Add archive tables for items, tags, and item-tag joins.
- Archive item fields should include title, URL, optional image URL, optional note, favorite boolean, optional source/site label, optional found date, created date, updated date, deleted date, and deleted reason.
- Tags should have a display name and normalized slug.
- Item-tag joins should support many-to-many tag assignment.
- Do not add a primary category field.
- Do not add draft/published status in v1. Any non-deleted item is public.
- Soft delete should set `deletedAt` and `deletedReason`.
- Deletion reason is required when moving an item to trash.
- Restore should clear `deletedAt` and `deletedReason`.
- Do not permanently delete archive items in v1.
- Do not delete Vercel Blob assets when an item is moved to trash.
- Use Vercel Blob for pasted and uploaded images.
- Store only image URLs in Neon.
- Support external image URLs as an alternative to uploaded Blob images.
- Public archive queries must exclude soft-deleted items.
- Active admin archive queries must exclude soft-deleted items.
- Trash admin queries must include only soft-deleted items.
- Admin authentication should be single-owner and environment-variable based.
- Do not create a users table in v1.
- Use an environment variable for the dashboard password or password hash. Prefer storing a hash rather than a raw password if implementation time allows.
- Use the existing `SESSION_SECRET` for signing/encrypting admin session cookies if suitable.
- Protect all `/admin/*` routes except the login route.
- Use a simple dashboard layout for `/admin` with navigation that includes Archive and Trash.
- Public archive cards should open the original URL by default.
- Public archive cards should also expose a separate control to open a read-only side sheet with item details.
- Admin archive should expose a writable side sheet or edit panel for item editing.
- New item creation should be URL-first.
- URL metadata prefill should be implemented through a server-side action or API route that fetches the target page and parses standard metadata such as Open Graph title, description, image, and site name.
- Metadata prefill must be treated as optional. Failures should show a recoverable state and leave manual fields editable.
- Tag input should be freeform and show a dropdown of existing tags.
- Creating or editing an item should create missing tags automatically using normalized slugs.
- Favoriting should be a boolean toggle, shown in both public and admin surfaces.
- The public visual archive should avoid a professional directory feel. Prefer a browsable grid or masonry-like layout, visual variation, tag chips, favorite emphasis, and graceful text-first fallbacks.
- The admin dashboard should be utilitarian, dense, and quiet. It should prioritize fast entry and editing over decorative presentation.

## Out of Scope

- Migrating the existing `constants/list-of-lists.ts` entries into Neon.
- A users table, registration flow, OAuth login, password reset, or multi-user roles.
- Draft/published workflow. All active archive items are public.
- Permanent deletion from trash.
- Automatic cleanup of unused Vercel Blob assets.
- A separate tag management screen.
- Primary categories.
- Analytics, view counts, reactions, comments, or public submissions.
- Individual public detail pages for archive items.
- Importing bookmarks from browsers, CSV files, Raindrop, Notion, or other external systems.
- Admin sections beyond the archive and archive trash.

## Further Notes

- The project is a Next.js 16 App Router site using React 19 and Tailwind CSS v4.
- Dark mode is always enabled at the root HTML level, but some existing components use light admin/sidebar styling. The implementer should keep public archive styling consistent with the site while making the admin dashboard practical and readable.
- Existing local environment variables already include Neon storage database connection values, `DASHBOARD_PASSWORD`, and `SESSION_SECRET`.
- Vercel Blob does not appear to be configured locally yet because no `BLOB_READ_WRITE_TOKEN` variable was present in the inspected environment variable names. The implementation should expect this variable and document setup if the store is not already connected.
- The public archive should feel like a personal internet scrapbook: messy but browsable, not a polished resource directory.
- The admin panel should make adding a new item fast enough that Arthur can paste a link and save it in under a minute when metadata and image handling work normally.
