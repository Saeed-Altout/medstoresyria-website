"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { MaintenanceTracker } from "@/components/modules/maintenance-tracker";
import { useTrackMaintenance } from "@/lib/hooks/commerce";

function TrackMaintenanceInner() {
  const t = useTranslations("maintenance");
  const searchParams = useSearchParams();
  const [requestNumber, setRequestNumber] = useState(
    searchParams.get("request") ?? "",
  );
  const [email, setEmail] = useState("");
  const track = useTrackMaintenance();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestNumber && email) {
      track.mutate({ requestNumber: requestNumber.trim(), email: email.trim() });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{t("trackTitle")}</h1>
      <p className="mb-6 text-muted-foreground">{t("trackSubtitle")}</p>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="request">{t("requestNumber")}</FieldLabel>
            <Input
              id="request"
              value={requestNumber}
              onChange={(e) => setRequestNumber(e.target.value)}
              placeholder="MNT-..."
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" disabled={track.isPending} className="w-full">
            {track.isPending ? <Spinner /> : t("trackButton")}
          </Button>
        </form>
      </Card>

      {track.isError && (
        <p className="mt-4 text-center text-sm text-destructive">
          {t("trackNotFound")}
        </p>
      )}

      {track.data && (
        <Card className="mt-6 p-6">
          <MaintenanceTracker request={track.data} />
        </Card>
      )}
    </div>
  );
}

export default function MaintenanceTrackPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center"><Spinner /></div>}>
      <TrackMaintenanceInner />
    </Suspense>
  );
}
