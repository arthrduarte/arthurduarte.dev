"use client";

import { useEffect, useMemo, useState } from "react";

type PasswordGateProps = {
  expectedPassword: string;
  children: React.ReactNode;
};

const ACCESS_KEY = "family_tree_access_granted";

export function PasswordGate({ expectedPassword, children }: PasswordGateProps) {
  const [hasSessionAccess, setHasSessionAccess] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isUnlocked = window.sessionStorage.getItem(ACCESS_KEY) === "true";
    setHasSessionAccess(isUnlocked);
  }, []);

  const canValidate = useMemo(() => expectedPassword.length > 0, [expectedPassword]);

  if (hasSessionAccess) {
    return <>{children}</>;
  }

  const verifyPassword = () => {
    if (!canValidate) {
      setError("Password is not configured.");
      return;
    }

    if (value === expectedPassword) {
      window.sessionStorage.setItem(ACCESS_KEY, "true");
      setHasSessionAccess(true);
      return;
    }

    setError("Incorrect password.");
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-5xl font-semibold tracking-wide">Arthur Duartes Family Tree</h1>

        {!showPrompt ? (
          <button
            type="button"
            className="mt-10 rounded-full bg-[#CE955E] px-8 py-3 text-lg font-semibold text-[#3A2E1F] transition hover:brightness-95"
            onClick={() => {
              setShowPrompt(true);
              setError(null);
            }}
          >
            Enter the Tree
          </button>
        ) : (
          <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-center gap-3">
            <input
              autoFocus
              type="password"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  verifyPassword();
                }
              }}
              className="w-full rounded-full border border-[#CE955E]/60 bg-[#FAF6ED] px-4 py-3 text-center text-lg text-[#3A2E1F] outline-none ring-[#CE955E] transition focus:ring-2"
            />
            <button
              type="button"
              className="w-full rounded-full bg-[#CE955E] px-8 py-3 text-lg font-semibold text-[#3A2E1F] transition hover:brightness-95"
              onClick={verifyPassword}
            >
              Unlock
            </button>
            {error ? <p className="text-sm text-[#8A4E24]">{error}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}