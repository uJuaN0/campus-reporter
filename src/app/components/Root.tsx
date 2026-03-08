import { Link, Outlet, useLocation } from "react-router";
import {
  Home,
  AlertCircle,
  Package,
  Calendar,
  PlusCircle,
  Menu,
  X,
  Globe,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NotificationBell } from "./NotificationBell";

export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setRole(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar role:", error);
      setRole(null);
      return;
    }

    setRole(data?.role ?? null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const navigation =
    role === "admin"
      ? [
          { name: "Dashboard", href: "/", icon: Home },
          { name: "Hub Internacional", href: "/hub-internacional", icon: Globe },
          { name: "Problemas", href: "/reportacoes", icon: AlertCircle },
          { name: "Perdidos & Achados", href: "/achados-perdidos", icon: Package },
          { name: "Eventos", href: "/eventos", icon: Calendar },
          { name: "Reportar", href: "/reportar", icon: PlusCircle },
          { name: "Administração", href: "/administracao", icon: Shield },
        ]
      : role === "dep_problemas"
      ? [{ name: "Problemas", href: "/reportacoes", icon: AlertCircle }]
      : role === "dep_perdidos"
      ? [{ name: "Perdidos & Achados", href: "/achados-perdidos", icon: Package }]
      : role === "dep_eventos"
      ? [{ name: "Eventos", href: "/eventos", icon: Calendar }]
      : [
          { name: "Dashboard", href: "/", icon: Home },
          { name: "Hub Internacional", href: "/hub-internacional", icon: Globe },
          { name: "Problemas", href: "/reportacoes", icon: AlertCircle },
          { name: "Perdidos & Achados", href: "/achados-perdidos", icon: Package },
          { name: "Eventos", href: "/eventos", icon: Calendar },
          { name: "Reportar", href: "/reportar", icon: PlusCircle },
        ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">NC</span>
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  NOVA Connect
                </h1>
                <p className="text-xs text-gray-500 leading-tight">
                  Faculdade de Ciências e Tecnologia
                </p>
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center gap-3 min-w-0">
              <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors whitespace-nowrap text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="shrink-0">
                <NotificationBell />
              </div>

              <button
                onClick={handleLogout}
                className="shrink-0 ml-1 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-medium"
              >
                Sair
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 space-y-1">
              <div className="px-2 pb-2">
                <NotificationBell />
              </div>

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}