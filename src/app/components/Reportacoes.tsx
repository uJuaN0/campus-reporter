import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock3,
  MapPin,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ReportItem {
  id: number;
  type: "Problema";
  title: string;
  description: string;
  location: string;
  image_url: string | null;
  status: "Pendente" | "Em resolução" | "Resolvido" | null;
  created_at: string;
  created_by_email: string | null;
}

export function Reportacoes() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("type", "Problema")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar problemas.");
    } else {
      setReports((data ?? []) as ReportItem[]);
    }

    setLoading(false);
  }

  const filteredReports = useMemo(() => {
    const q = searchTerm.toLowerCase();

    return reports.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.status || "").toLowerCase().includes(q) ||
        (item.created_by_email || "").toLowerCase().includes(q)
      );
    });
  }, [reports, searchTerm]);

  async function handleUpdateStatus(
    item: ReportItem,
    nextStatus: "Pendente" | "Em resolução" | "Resolvido"
  ) {
    const { error } = await supabase
      .from("reports")
      .update({ status: nextStatus })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      toast.error("Não foi possível alterar o estado.");
      return;
    }

    toast.success(`Estado alterado para "${nextStatus}".`);
    await loadAll();
  }

  async function handleDelete(item: ReportItem) {
    const confirmed = window.confirm(`Apagar "${item.title}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from("reports").delete().eq("id", item.id);

    if (error) {
      console.error(error);
      toast.error("Não foi possível apagar o problema.");
      return;
    }

    toast.success("Problema apagado.");
    await loadAll();
  }

  function getBadgeVariant(status: string | null) {
    if (status === "Resolvido") return "default";
    if (status === "Em resolução") return "secondary";
    return "outline";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problemas</h1>
        <p className="text-gray-600">
          Lista de ocorrências e problemas reportados no campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-red-600">{reports.length}</div>
            <div className="text-sm text-red-900">Total de problemas</div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-amber-600">
              {reports.filter((r) => r.status === "Pendente").length}
            </div>
            <div className="text-sm text-amber-900">Pendentes</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-green-600">
              {reports.filter((r) => r.status === "Resolvido").length}
            </div>
            <div className="text-sm text-green-900">Resolvidos</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Pesquisar por título, descrição, localização, estado ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">A carregar problemas...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum problema encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url ? (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <Badge variant={getBadgeVariant(item.status)}>
                    {item.status || "Pendente"}
                  </Badge>
                </div>

                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.created_at).toLocaleDateString("pt-PT")}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock3 className="w-4 h-4" />
                    <span>{new Date(item.created_at).toLocaleTimeString("pt-PT")}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{item.created_by_email || "Desconhecido"}</span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>

                {role === "admin" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(item, "Pendente")}
                      >
                        Pendente
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(item, "Em resolução")}
                      >
                        Em resolução
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(item, "Resolvido")}
                      >
                        Resolvido
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Apagar
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Apenas visualização
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}