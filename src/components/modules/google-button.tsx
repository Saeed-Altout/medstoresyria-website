"use client";

import { useTranslations } from "next-intl";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { googleAuthUrl } from "@/lib/api/auth.api";

export function GoogleButton() {
  const t = useTranslations("auth");

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        window.location.href = googleAuthUrl();
      }}
    >
      <IconBrandGoogleFilled className="size-4" />
      {t("continueWithGoogle")}
    </Button>
  );
}
