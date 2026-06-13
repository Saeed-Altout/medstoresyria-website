"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  IconHeartHandshake,
  IconMenu2,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart-drawer";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { useCategories } from "@/lib/hooks/catalog";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/lib/hooks/auth";
import { useDirection } from "@/hooks/use-direction";

export function SiteHeader() {
  const t = useTranslations("nav");
  const router = useRouter();
  const { sheetSide } = useDirection();
  const { data: categories } = useCategories();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  };

  const topCategories = (categories ?? []).slice(0, 6);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("menu")}>
              <IconMenu2 className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={sheetSide} className="w-72">
            <SheetHeader>
              <SheetTitle>{t("categories")}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                {t("allProducts")}
              </Link>
              {(categories ?? []).map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/brands" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                {t("brands")}
              </Link>
              <Link href="/maintenance" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                {t("maintenance")}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <IconHeartHandshake className="size-6 text-primary" />
          <span className="hidden sm:inline">MedStore Syria</span>
        </Link>

        {/* Search */}
        <form onSubmit={onSearch} className="relative ms-auto hidden flex-1 max-w-md md:block">
          <IconSearch className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ps-9"
          />
        </form>

        {/* Actions */}
        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <LocaleSwitcher />
          <ModeToggle />
          <CartDrawer />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("account")}>
                <IconUser className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {user ? (
                <>
                  <DropdownMenuLabel className="truncate">
                    {user.first_name} {user.last_name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">{t("account")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">{t("orders")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/notifications">{t("notifications")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout.mutate();
                      router.push("/");
                    }}
                  >
                    {t("logout")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">{t("login")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">{t("register")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/track">{t("trackOrder")}</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category bar */}
      <nav className="hidden border-t lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          <Link
            href="/products"
            className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("allProducts")}
          </Link>
          {topCategories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/brands"
            className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("brands")}
          </Link>
          <Link
            href="/maintenance"
            className="ms-auto px-3 py-2.5 text-sm font-medium text-primary hover:underline"
          >
            {t("maintenance")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
