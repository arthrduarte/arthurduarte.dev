# Arthur's Archive Issues

## 1. Archive Foundation With Public Empty State

## What to build

Create the database-backed foundation for Arthur's Archive. The public `/archive` route should exist, read from the archive database tables, and show an intentional empty state when no items exist. The old `/list-of-lists` route should redirect to `/archive`, and visible site references should use the new archive naming.

## Acceptance criteria

- [ ] Drizzle is configured against the existing Neon database environment variables.
- [ ] Archive item, tag, and item-tag join tables exist with fields needed by the PRD.
- [ ] `/archive` renders from the database and handles an empty archive gracefully.
- [ ] `/list-of-lists` redirects to `/archive`.
- [ ] Navigation/home/timeline references use archive naming instead of "list of lists" where applicable.
- [ ] The existing static list data is not migrated or seeded into the new database.

## Blocked by

None - can start immediately

## 2. Password-Protected Admin Shell

## What to build

Add the private admin entry point for future archive management. Arthur should be able to log in with the environment-backed dashboard password, maintain a session across refreshes, access a simple dashboard layout, and log out. All admin routes except login should be protected.

## Acceptance criteria

- [ ] `/admin/login` allows Arthur to authenticate using the configured environment-backed password flow.
- [ ] Admin sessions are signed or encrypted using the configured session secret.
- [ ] `/admin/archive` and `/admin/archive/trash` cannot be accessed while logged out.
- [ ] Authenticated users can access the admin dashboard shell.
- [ ] The admin shell includes simple dashboard navigation for Archive and Trash.
- [ ] Logout clears the session and returns the user to an unauthenticated state.

## Blocked by

- 1. Archive Foundation With Public Empty State

## 3. Create Archive Items With Tags

## What to build

Build the first complete admin publishing path for active archive items. From `/admin/archive`, Arthur should be able to create a public archive item with a title, URL, note, favorite flag, and freeform tags. The tag input should show existing tags in a dropdown and automatically create missing tags.

## Acceptance criteria

- [ ] `/admin/archive` lists active archive items from the database.
- [ ] Arthur can create an archive item with title and URL.
- [ ] Note and favorite fields can be set during creation.
- [ ] Tags can be typed freely.
- [ ] Existing tags are suggested in a dropdown during tag entry.
- [ ] New tags are automatically created with normalized slugs.
- [ ] Duplicate tag names are prevented through slug normalization.
- [ ] Created items are immediately public because v1 has no draft/published status.

## Blocked by

- 2. Password-Protected Admin Shell

## 4. Public Archive Browsing

## What to build

Turn `/archive` into the public browsing experience for real archive items. Visitors should see a visual, personal archive rather than a professional directory. Cards should open the original URL by default, support a separate note side sheet, display tags and favorites, and remain polished when an item has no image.

## Acceptance criteria

- [ ] `/archive` renders active, non-deleted archive items.
- [ ] Archive cards open the original item URL by default.
- [ ] Each card exposes a separate control to open a read-only side sheet.
- [ ] The side sheet shows the item note, tags, favorite state, image when present, and visit action.
- [ ] Items without images use an intentional text-first fallback.
- [ ] Visitors can filter by tag.
- [ ] Visitors can filter or identify favorite items.
- [ ] Visitors can search by relevant item content such as title, URL, note, or tag.

## Blocked by

- 3. Create Archive Items With Tags

## 5. Edit Existing Archive Items

## What to build

Add the admin editing path for existing active archive items. Arthur should be able to open an item from `/admin/archive`, update its core fields, adjust tags, change notes, and toggle favorite status without recreating the item.

## Acceptance criteria

- [ ] Active archive items can be opened for editing from `/admin/archive`.
- [ ] Title, URL, note, favorite state, and tags can be updated.
- [ ] Existing tags can be reused during editing.
- [ ] New tags can be created during editing using the same normalization rules as creation.
- [ ] Updates are reflected on the public `/archive` page.
- [ ] Editing preserves created/deleted state correctly.

## Blocked by

- 3. Create Archive Items With Tags

## 6. URL Metadata Prefill

## What to build

Make new item creation faster by adding URL-first metadata prefill. When Arthur pastes a URL, the app should attempt to fetch useful metadata server-side and prefill editable fields. Failures must be recoverable and should never block manual entry.

## Acceptance criteria

- [ ] Admin creation supports a URL-first prefill action.
- [ ] Metadata fetch attempts to extract title, description, Open Graph image, and source/site name when available.
- [ ] Prefilled metadata remains editable before save.
- [ ] Missing metadata does not block item creation.
- [ ] Fetch errors, invalid URLs, and blocked sites produce a recoverable admin state.

## Blocked by

- 3. Create Archive Items With Tags

## 7. Image Capture And Storage

## What to build

Add optional image support across admin and public archive surfaces. Arthur should be able to paste an image from the clipboard, upload/select a file, or paste an external image URL. Pasted and uploaded images should be stored in Vercel Blob, while Neon stores only the resulting image URL.

## Acceptance criteria

- [ ] Admin create/edit supports pasted clipboard images.
- [ ] Admin create/edit supports file upload or file selection.
- [ ] Admin create/edit supports external image URLs without upload.
- [ ] Pasted and uploaded images are stored in Vercel Blob.
- [ ] Archive items store image URLs in the database, not binary image data.
- [ ] Public archive cards and side sheets render item images when present.
- [ ] Items can still be saved and rendered without images.
- [ ] Image URLs remain untouched when item data changes.

## Blocked by

- 3. Create Archive Items With Tags

## 8. Soft Delete And Trash Restore

## What to build

Implement reversible deletion for archive items. Deleting an item from the admin archive should require Arthur to enter a reason, move the item out of active/public views, and place it in `/admin/archive/trash`. Trash should show deletion context and allow restoring items.

## Acceptance criteria

- [ ] Active archive items can be soft-deleted from admin.
- [ ] Deleting requires a non-empty deletion reason.
- [ ] Soft delete records deletion date and deletion reason.
- [ ] Deleted items are excluded from public `/archive`.
- [ ] Deleted items are excluded from active `/admin/archive`.
- [ ] Deleted items appear in `/admin/archive/trash`.
- [ ] Trash shows title, URL, tags, deleted date, and deletion reason.
- [ ] Deleted items can be restored.
- [ ] Restore clears deletion date and deletion reason.
- [ ] Blob image URLs are not removed or modified by soft delete or restore.

## Blocked by

- 5. Edit Existing Archive Items

## 9. End-To-End Polish And Setup

## What to build

Polish the complete Arthur's Archive flow after the main vertical slices are in place. Refine edge cases, check the full experience manually, document setup requirements, and make sure the public archive and admin dashboard work as a coherent product.

## Acceptance criteria

- [ ] Public archive behavior is manually checked for non-deleted rendering, deleted exclusion, card click-through, side sheet behavior, filtering, search, favorite behavior, and image/no-image states.
- [ ] Admin auth behavior is manually checked for login, protected route access, session persistence, and logout.
- [ ] Archive management behavior is manually checked for create, edit, tag assignment, favorite toggle, soft delete with required reason, and restore.
- [ ] Metadata prefill behavior is manually checked for success, missing metadata, invalid URL, and fetch failure.
- [ ] Image behavior is manually checked for uploaded/pasted Blob images, external image URLs, and no-image items.
- [ ] Redirect behavior from `/list-of-lists` to `/archive` works.
- [ ] The admin dashboard remains usable and readable with a simple dashboard layout.
- [ ] The public archive feels like a personal internet scrapbook rather than a formal resource directory.
- [ ] Any setup requirements for Vercel Blob and environment variables are documented for local and deployed usage.

## Blocked by

- 4. Public Archive Browsing
- 6. URL Metadata Prefill
- 7. Image Capture And Storage
- 8. Soft Delete And Trash Restore
