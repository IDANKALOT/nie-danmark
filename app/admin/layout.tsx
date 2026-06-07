"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  CreditCard,
  BookOpen,
  Settings,
  Globe,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Shield,
  UserCog,
  Star,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Overblik", icon: LayoutDashboard, exact: true },
  { href: "/admin/sager", label: "Sager", icon: FolderOpen, exact: false },
  { href: "/admin/kunder", label: "Kunder", icon: Users, exact: false },
  { href: "/admin/betalinger", label: "Betalinger", icon: CreditCard, exact: false },
  { href: "/admin/team", label: "Team", icon: UserCog, exact: false },
  { href: "/admin/reviews", label: "Anmeldelser", icon: Star, exact: false },
  { href: "/admin/blog", label: "Blog", icon: BookOpen, exact: false },
  { href: "/admin/indstillinger", label: "Indstillinger", icon: Settings, exact: false },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[0];
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
      style={{
        background: isActive ? "rgba(212,175,55,0.15)" : "transparent",
        color: isActive ? "#d4af37" : "rgba(255,255,255,0.65)",
        borderLeft: isActive ? "2px solid #d4af37" : "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.background =
            "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLAnchorElement).style.color =
            "rgba(255,255,255,0.9)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color =
            "rgba(255,255,255,0.65)";
        }
      }}
    >
      <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      <span>{item.label}</span>
      {isActive && (
        <ChevronRight size={14} className="ml-auto" style={{ color: "#d4af37" }} />
      )}
    </Link>
  );
}

function AdminSidebar({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  const { data: session } = useSession();

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #080e1a 0%, #0f172a 100%)",
        borderRight: "1px solid rgba(212,175,55,0.1)",
        width: 260,
      }}
    >
      {/* Logo + Admin badge */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #d4af37, #f0d060)",
              boxShadow: "0 2px 12px rgba(212,175,55,0.35)",
            }}
          >
            <Globe size={18} strokeWidth={2.2} style={{ color: "#0f172a" }} />
          </span>
          <div>
            <span className="block text-base font-bold tracking-tight text-white">
              NIE <span style={{ color: "#d4af37" }}>Danmark</span>
            </span>
            <span className="block text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Administratorpanel
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto lg:hidden text-white/50 hover:text-white transition-colors"
              aria-label="Luk menu"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {/* Admin badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)" }}
        >
          <Shield size={12} style={{ color: "#d4af37" }} />
          <span className="text-xs font-semibold" style={{ color: "#d4af37" }}>
            ADMIN ADGANG
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Admin user info at bottom */}
      <div
        className="px-3 pb-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="mt-3 flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <div
            className="flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #d4af37, #f0d060)",
              color: "#0f172a",
            }}
          >
            {getInitials(session?.user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {session?.user?.name ?? "Admin"}
            </p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
              {session?.user?.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.4)" }}
            title="Log ud"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f1f5f9" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar pathname={pathname} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300"
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <AdminSidebar pathname={pathname} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header
          className="flex lg:hidden items-center gap-4 px-4 py-3 flex-shrink-0"
          style={{
            background: "#0f172a",
            borderBottom: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.8)" }}
            aria-label="Åbn menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, #d4af37, #f0d060)",
              }}
            >
              <Globe size={14} strokeWidth={2.2} style={{ color: "#0f172a" }} />
            </span>
            <span className="text-base font-bold text-white">
              NIE <span style={{ color: "#d4af37" }}>Admin</span>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
