import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  Package,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Clock3,
  ArrowRight,
  Sparkles,
  User,
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

    const [{ data: reportsData, error: reportsError }, { data: eventsData, error: eventsError }] =
      await Promise.all([
        supabase.from("reports").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("event_date", { ascending: true }),
      ]);

    if (!reportsError) {
      setReports((reportsData ?? []) as ReportItem[]);
    }

    if (!eventsError) {
      setEvents((eventsData ?? []) as EventItem[]);
    }

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

  const itemsAchados = useMemo(
    () => perdidos.filter((item) => item.status === "Achado").length,
    [perdidos]
  );

  const proximosEventos = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.event_date) >= now)
      .slice(0, 3);
  }, [events]);

  const ultimosReports = useMemo(() => reports.slice(0, 4), [reports]);

  const quickActions = [
    {
      title: "Problemas",
      description: "Ver ocorrências do campus e estados",
      href: "/reportacoes",
      icon: AlertCircle,
      badge: `${problemas.length} total`,
      colorClasses: "bg-red-50 text-red-600",
    },
    {
      title: "Perdidos & Achados",
      description: "Itens perdidos e encontrados",
      href: "/achados-perdidos",
      icon: Package,
      badge: `${perdidos.length} itens`,
      colorClasses: "bg-amber-50 text-amber-600",
    },
    {
      title: "Eventos",
      description: "Acompanhar eventos do campus",
      href: "/eventos",
      icon: Calendar,
      badge: `${events.length} eventos`,
      colorClasses: "bg-blue-50 text-blue-600",
    },
    {
      title: "Reportar",
      description: "Criar novo reporte rapidamente",
      href: "/reportacoes",
      icon: PlusCircle,
      badge: "Novo",
      colorClasses: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard NOVA Connect</h2>
            <p className="text-blue-100 mb-4 max-w-2xl">
              Plataforma central para gestão do campus: problemas, perdidos e achados,
              eventos e acompanhamento de atividade académica.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/15">
                Perfil: {role === "admin" ? "Admin" : role === "user" ? "Utilizador" : "Sem role"}
              </Badge>
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/15">
                {loading ? "A carregar dados..." : `${reports.length} reports + ${events.length} eventos`}
              </Badge>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 min-w-56">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Resumo rápido</span>
              </div>
              <div className="text-4xl font-bold">{problemasPendentes}</div>
              <p className="text-sm text-blue-100 mt-1">problemas pendentes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{problemas.length}</div>
            <div className="text-sm text-gray-600">Problemas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{problemasResolvidos}</div>
            <div className="text-sm text-gray-600">Resolvidos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-600">{perdidos.length}</div>
            <div className="text-sm text-gray-600">Perdidos & Achados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            <div className="text-sm text-gray-600">Eventos</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ações rápidas</h3>
          <p className="text-gray-600">Atalhos para as áreas principais da plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} to={item.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${item.colorClasses}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary">{item.badge}</Badge>
                    </div>

                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Próximos eventos</CardTitle>
            <CardDescription>Eventos do campus com data futura</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {proximosEventos.length === 0 ? (
              <p className="text-sm text-gray-500">Sem eventos futuros de momento.</p>
            ) : (
              proximosEventos.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Início: {formatDate(event.event_date)}</span>
                      </div>

                      {event.event_end_date ? (
                        <div className="flex items-center gap-2">
                          <Clock3 className="w-3.5 h-3.5" />
                          <span>Fim: {formatDate(event.event_end_date)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <Badge variant="secondary">Evento</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Últimos reports criados na plataforma</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {ultimosReports.length === 0 ? (
              <p className="text-sm text-gray-500">Sem reports recentes.</p>
            ) : (
              ultimosReports.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      {item.status ? <Badge variant="outline">{item.status}</Badge> : null}
                    </div>

                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      <div>{item.location}</div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span>{item.created_by_email || "Desconhecido"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Continuar exploração</h3>
              <p className="text-sm text-gray-600">
                Acede rapidamente às áreas mais importantes do vosso projeto.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/reportacoes">
                <Button variant="outline">
                  Ver reports
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/achados-perdidos">
                <Button variant="outline">
                  Ver perdidos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/chat">
                <Button>
                  Ver eventos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT");
}