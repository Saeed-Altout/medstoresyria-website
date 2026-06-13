"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBrands, useCategories } from "@/lib/hooks/catalog";
import type { ProductFilters } from "@/types";

interface ProductFiltersProps {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
}

export function ProductFiltersPanel({
  filters,
  onChange,
  onReset,
}: ProductFiltersProps) {
  const t = useTranslations("catalog");
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Flatten the category tree one level deep for the filter list.
  const flatCategories = (categories ?? []).flatMap((c) => [
    c,
    ...c.children,
  ]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t("filters")}</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          {t("reset")}
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["category", "brand", "condition", "price"]}
      >
        <AccordionItem value="category">
          <AccordionTrigger>{t("category")}</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.categoryId ?? ""}
              onValueChange={(v) =>
                onChange({ categoryId: v || undefined, page: 1 })
              }
              className="gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="" id="cat-all" />
                <Label htmlFor="cat-all" className="font-normal">
                  {t("allCategories")}
                </Label>
              </div>
              {flatCategories.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <RadioGroupItem value={c.id} id={`cat-${c.id}`} />
                  <Label htmlFor={`cat-${c.id}`} className="font-normal">
                    {c.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>{t("brand")}</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.brandId ?? ""}
              onValueChange={(v) =>
                onChange({ brandId: v || undefined, page: 1 })
              }
              className="gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="" id="brand-all" />
                <Label htmlFor="brand-all" className="font-normal">
                  {t("allBrands")}
                </Label>
              </div>
              {(brands ?? []).map((b) => (
                <div key={b.id} className="flex items-center gap-2">
                  <RadioGroupItem value={b.id} id={`brand-${b.id}`} />
                  <Label htmlFor={`brand-${b.id}`} className="font-normal">
                    {b.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="condition">
          <AccordionTrigger>{t("condition")}</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.condition ?? ""}
              onValueChange={(v) =>
                onChange({
                  condition: (v || undefined) as ProductFilters["condition"],
                  page: 1,
                })
              }
              className="gap-2"
            >
              {["", "new", "used"].map((c) => (
                <div key={c || "any"} className="flex items-center gap-2">
                  <RadioGroupItem value={c} id={`cond-${c || "any"}`} />
                  <Label htmlFor={`cond-${c || "any"}`} className="font-normal">
                    {c ? t(`conditions.${c}`) : t("any")}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>{t("price")}</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                placeholder={t("min")}
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  onChange({
                    priceMin: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    page: 1,
                  })
                }
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                min={0}
                placeholder={t("max")}
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  onChange({
                    priceMax: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    page: 1,
                  })
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
