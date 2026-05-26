"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Properties",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    label: "Leads / CRM",
    href: "/admin/leads",
    icon: Users,
  },
  {
    label: "Site Visits",
    href: "/admin/site-visits",
    icon: Calendar,
  },
  {
    label: "Content",
    href: "/admin/content",
    icon: FileText,
    children: [
      { label: "Pages", href: "/admin/content/pages" },
      { label: "Blogs", href: "/admin/content/blogs" },
      { label: "Testimonials", href: "/admin/content/testimonials" },
      { label: "FAQs", href: "/admin/content/faqs" },
    ],
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Users & Roles",
    href: "/admin/users",
    icon: Settings,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export default function AdminLayout({ children, currentPath = "/admin" }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED] flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0D2F5B] flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B86A3C] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div>
              <span className="text-white font-bold text-base">Plotzify</span>
              <span className="block text-white/40 text-xs">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
            const isExpanded = expandedItem === item.label;

            return (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/60 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                              currentPath === child.href
                                ? "bg-white/15 text-white"
                                : "text-white/50 hover:bg-white/8 hover:text-white"
                            )}
                          >
                            <div className="w-1 h-1 bg-current rounded-full" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/60 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
            target="_blank"
          >
            <ChevronRight className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E2DDD6] sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors">
                <Bell className="w-4 h-4 text-[#6B7B94]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B86A3C] rounded-full" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  SA
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-[#162338]">Super Admin</p>
                  <p className="text-xs text-[#6B7B94]">admin@plotzify.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
