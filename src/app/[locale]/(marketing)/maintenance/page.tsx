"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconCircleCheckFilled, IconTool } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MaintenanceForm } from "@/components/modules/maintenance-form";
import { useCreateMaintenance } from "@/lib/hooks/commerce";
import type { CreateMaintenanceDto } from "@/types";

export default function MaintenancePage() {
  const t = useTranslations("maintenance");
  const createMaintenance = useCreateMaintenance();
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  const onSubmit = (dto: CreateMaintenanceDto) => {
    createMaintenance.mutate(dto, {
      onSuccess: ({ data }) => setRequestNumber(data.requestNumber),
    });
  };

  if (requestNumber) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <IconCircleCheckFilled className="size-16 text-green-600" />
          <h1 className="text-2xl font-bold">{t("successTitle")}</h1>
          <p className="text-muted-foreground">{t("successSubtitle")}</p>
          <div className="rounded-lg bg-muted px-6 py-3">
            <p className="text-sm text-muted-foreground">{t("requestNumber")}</p>
            <p className="text-xl font-semibold tracking-wide">{requestNumber}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href={`/maintenance/track?request=${requestNumber}`}>
                {t("trackRequest")}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <IconTool className="size-10 text-primary" />
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="max-w-xl text-muted-foreground">{t("subtitle")}</p>
        <Link
          href="/maintenance/track"
          className="text-sm text-primary hover:underline"
        >
          {t("alreadyHaveRequest")}
        </Link>
      </div>

      <Card className="p-6">
        <MaintenanceForm
          submitting={createMaintenance.isPending}
          onSubmit={onSubmit}
        />
      </Card>
    </div>
  );
}
