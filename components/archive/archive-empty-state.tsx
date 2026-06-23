export function ArchiveEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">Nothing here yet.</p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
        Arthur&apos;s Archive is empty for now. Finds will show up here once
        they&apos;re added.
      </p>
    </div>
  );
}
