"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin/constants";
import {
  getSessionSecret,
  isDashboardPasswordConfigured,
} from "@/lib/admin/env";
import { verifyDashboardPassword } from "@/lib/admin/password";
import { createAdminSessionToken } from "@/lib/admin/session";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  if (!isDashboardPasswordConfigured()) {
    return { error: "Dashboard password is not configured." };
  }

  const password = String(formData.get("password") ?? "");

  if (!verifyDashboardPassword(password)) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(getSessionSecret()),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    },
  );

  redirect("/admin/archive");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: ADMIN_SESSION_COOKIE,
    path: "/admin",
  });

  redirect("/admin/login");
}
