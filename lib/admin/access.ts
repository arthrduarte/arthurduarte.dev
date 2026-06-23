export function isPublicAdminPath(pathname: string): boolean {
  return pathname === "/admin/login";
}

export function isProtectedAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && !isPublicAdminPath(pathname);
}

export function getAdminAccessRedirect(
  pathname: string,
  isAuthenticated: boolean,
): string | null {
  if (pathname === "/admin") {
    return isAuthenticated ? "/admin/archive" : "/admin/login";
  }

  if (isPublicAdminPath(pathname) && isAuthenticated) {
    return "/admin/archive";
  }

  if (isProtectedAdminPath(pathname) && !isAuthenticated) {
    return "/admin/login";
  }

  return null;
}
