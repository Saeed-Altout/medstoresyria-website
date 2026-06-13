"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CheckoutForm } from "@/components/modules/checkout-form";
import { selectCartSubtotal, useCartStore } from "@/stores/cart.store";
import { useCreateOrder } from "@/lib/hooks/commerce";
import type { CreateOrderDto } from "@/types";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const subtotal = useCartStore(selectCartSubtotal);
  const clear = useCartStore((s) => s.clear);
  const createOrder = useCreateOrder();

  // Bounce to cart once hydrated if there's nothing to check out.
  useEffect(() => {
    if (hasHydrated && items.length === 0 && !createOrder.isSuccess) {
      router.replace("/cart");
    }
  }, [hasHydrated, items.length, createOrder.isSuccess, router]);

  const onSubmit = (dto: CreateOrderDto) => {
    createOrder.mutate(dto, {
      onSuccess: ({ data }) => {
        clear();
        router.push(`/order-confirmation/${data.orderNumber}`);
      },
    });
  };

  if (!hasHydrated || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <CheckoutForm
        items={items}
        subtotal={subtotal}
        submitting={createOrder.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
