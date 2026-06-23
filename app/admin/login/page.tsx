import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { isDashboardPasswordConfigured } from "@/lib/admin/env";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/archive");
  }

  const isConfigured = isDashboardPasswordConfigured();

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-zinc-900">Admin login</h1>
          <p className="text-sm text-zinc-500">
            Sign in to manage Arthur&apos;s Archive.
          </p>
        </div>

        {isConfigured ? (
          <AdminLoginForm />
        ) : (
          <p className="text-sm text-destructive">
            Dashboard password is not configured.
          </p>
        )}
      </div>
    </div>
  );
}
