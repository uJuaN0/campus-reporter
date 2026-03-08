import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  Package,
  Calendar,
  PlusCircle,
  ArrowRight,
  User,
  Clock3,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type ReportItem = {
  id: number;
  type: "Problema" | "Perdido e Achado";
  title: string;
  description: string;
  location: string;
  status: string | null;
  created_at: string;
  created_by_email: string | null;
  image_url: string | null;
};

type EventItem = {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_end_date: string | null;
  created_by_email: string | null;
  image_url: string | null;
};

export function Dashboard() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      setRole(profile?.role ?? null);
    }

    const [{ data: reportsData }, { data: eventsData }] = await Promise.all([
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("event_date", { ascending: true }),
    ]);

    setReports((reportsData ?? []) as ReportItem[]);
    setEvents((eventsData ?? []) as EventItem[]);
    setLoading(false);
  }

  const problemas = useMemo(
    () => reports.filter((item) => item.type === "Problema"),
    [reports]
  );

  const perdidos = useMemo(
    () => reports.filter((item) => item.type === "Perdido e Achado"),
    [reports]
  );

  const problemasPendentes = useMemo(
    () => problemas.filter((item) => item.status === "Pendente").length,
    [problemas]
  );

  const problemasResolvidos = useMemo(
    () => problemas.filter((item) => item.status === "Resolvido").length,
    [problemas]
  );

  const proximosEventos = useMemo(() => {
    const now = new Date();
    return events.filter((event) => new Date(event.event_date) >= now).slice(0, 3);
  }, [events]);

  const ultimosReports = useMemo(() => reports.slice(0, 4), [reports]);

  const perfilTexto =
    role === "admin"
      ? "Administrador"
      : role === "dep_problemas"
      ? "Departamento de Problemas"
      : role === "dep_perdidos"
      ? "Departamento de Perdidos e Achados"
      : role === "dep_eventos"
      ? "Departamento de Eventos"
      : role === "aluno"
      ? "Aluno"
      : "Sem perfil";

  const quickActions =
    role === "dep_problemas"
      ? [
          {
            key: "dashboard-problemas",
            title: "Problemas",
            description: "Ver ocorrências do campus e estados",
            href: "/reportacoes",
            icon: AlertCircle,
            badge: `${problemas.length} total`,
            colorClasses: "bg-red-50 text-red-600",
          },
        ]
      : role === "dep_perdidos"
      ? [
          {
            key: "dashboard-perdidos",
            title: "Perdidos & Achados",
            description: "Itens perdidos e encontrados",
            href: "/achados-perdidos",
            icon: Package,
            badge: `${perdidos.length} itens`,
            colorClasses: "bg-amber-50 text-amber-600",
          },
        ]
      : role === "dep_eventos"
      ? [
          {
            key: "dashboard-eventos",
            title: "Eventos",
            description: "Acompanhar eventos do campus",
            href: "/eventos",
            icon: Calendar,
            badge: `${events.length} eventos`,
            colorClasses: "bg-blue-50 text-blue-600",
          },
        ]
      : [
          {
            key: "dashboard-problemas",
            title: "Problemas",
            description: "Ver ocorrências do campus e estados",
            href: "/reportacoes",
            icon: AlertCircle,
            badge: `${problemas.length} total`,
            colorClasses: "bg-red-50 text-red-600",
          },
          {
            key: "dashboard-perdidos",
            title: "Perdidos & Achados",
            description: "Itens perdidos e encontrados",
            href: "/achados-perdidos",
            icon: Package,
            badge: `${perdidos.length} itens`,
            colorClasses: "bg-amber-50 text-amber-600",
          },
          {
            key: "dashboard-eventos",
            title: "Eventos",
            description: "Acompanhar eventos do campus",
            href: "/eventos",
            icon: Calendar,
            badge: `${events.length} eventos`,
            colorClasses: "bg-blue-50 text-blue-600",
          },
          {
            key: "dashboard-reportar",
            title: "Reportar",
            description: "Criar novo reporte rapidamente",
            href: "/reportar",
            icon: PlusCircle,
            badge: "Novo",
            colorClasses: "bg-green-50 text-green-600",
          },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral da plataforma e atividade recente do campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Perfil: <strong>{perfilTexto}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-red-600">{problemas.length}</div>
            <div className="text-sm text-gray-600">Problemas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-amber-600">{perdidos.length}</div>
            <div className="text-sm text-gray-600">Perdidos & Achados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            <div className="text-sm text-gray-600">Eventos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-green-600">{problemasResolvidos}</div>
            <div className="text-sm text-gray-600">Problemas resolvidos</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Ações rápidas</CardTitle>
            <CardDescription>
              Atalhos para as principais áreas da plataforma.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link key={action.key} to={action.href}>
                    <div className="rounded-2xl border p-4 hover:shadow-md transition-shadow h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.colorClasses}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary">{action.badge}</Badge>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{action.description}</p>

                      <div className="flex items-center text-sm font-medium text-blue-600">
                        Abrir
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Estado atual da plataforma.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Problemas pendentes</span>
              <Badge variant="outline">{problemasPendentes}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Problemas resolvidos</span>
              <Badge variant="outline">{problemasResolvidos}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Itens perdidos/achados</span>
              <Badge variant="outline">{perdidos.length}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Eventos futuros</span>
              <Badge variant="outline">{proximosEventos.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos eventos</CardTitle>
            <CardDescription>Os eventos mais próximos no campus.</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">A carregar eventos...</p>
            ) : proximosEventos.length === 0 ? (
              <p className="text-sm text-gray-500">Não há eventos futuros.</p>
            ) : (
              <div className="space-y-4">
                {proximosEventos.map((event) => (
                  <div key={event.id} className="rounded-xl border p-4">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.event_date).toLocaleString("pt-PT")}
                    </div>
                    {event.event_end_date ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock3 className="w-4 h-4" />
                        Até {new Date(event.event_end_date).toLocaleString("pt-PT")}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Link to="/eventos">
                <Button variant="outline" className="w-full">
                  Ver todos os eventos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Últimos reports submetidos.</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">A carregar atividade...</p>
            ) : ultimosReports.length === 0 ? (
              <p className="text-sm text-gray-500">Ainda não há atividade.</p>
            ) : (
              <div className="space-y-4">
                {ultimosReports.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>

                    <div className="text-sm text-gray-600 mt-2">{item.location}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleString("pt-PT")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Link to="/reportar">
                <Button variant="outline" className="w-full">
                  Criar novo reporte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}