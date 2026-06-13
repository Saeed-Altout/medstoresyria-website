import { IconHeartHandshake } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <IconHeartHandshake className="size-6 text-primary" />
          MedStore Syria
        </Link>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
