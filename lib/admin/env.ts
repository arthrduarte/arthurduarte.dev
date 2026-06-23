export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }

  return secret;
}

export function isDashboardPasswordConfigured(): boolean {
  return Boolean(
    process.env.DASHBOARD_PASSWORD ?? process.env.DASHBOARD_PASSWORD_HASH,
  );
}
