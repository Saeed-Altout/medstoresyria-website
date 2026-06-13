"use client";

import { Suspense, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Spinner } from "@/components/ui/spinner";
import { getMe } from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

function CallbackInner() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token") ?? searchParams.get("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Persist the token first so the request interceptor attaches it,
    // then hydrate the profile from /auth/me.
    setAuth(
      {
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: null,
        role: "customer",
        locale: "ar",
        is_active: true,
      },
      token,
    );

    getMe()
      .then((user) => {
        setAuth(user, token);
        router.replace("/account");
      })
      .catch(() => router.replace("/login"));
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Spinner className="size-8" />
      <p className="text-muted-foreground">{t("signingIn")}</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackInner />
    </Suspense>
  );
}
