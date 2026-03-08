import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock3,
  MapPin,
  Search,
  Trash2,
  User,
  Filter,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ReportItem {
  id: number;
  type: "Problema";
  category: string | null;
  title: string;
  description: string;
  location: string;
  image_url: string | null;
  status: "Pendente" | "Em resolução" | "Resolvido" | null;
  created_at: string;
  created_by_email: string | null;
}

const problemCategories = [
  "Todos",
  "Luz fundida",
  "Porta estragada",
  "Equipamento avariado",
  "Tomada sem funcionar",
  "Água / canalização",
  "Limpeza",
  "Outro",
];

export function Reportacoes() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState<ReportItem | null>(null);

  const canManageProblems = role === "admin" || role === "dep_problemas";

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
    } else {
      setRole(null);
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

    const visible = reports.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.status || "").toLowerCase().includes(q) ||
        (item.created_by_email || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "Todos" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    return visible.sort((a, b) => {
      const aResolved = a.status === "Resolvido" ? 1 : 0;
      const bResolved = b.status === "Resolvido" ? 1 : 0;

      if (aResolved !== bResolved) {
        return aResolved - bResolved;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [reports, searchTerm, categoryFilter]);

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

    if (selectedItem?.id === item.id) {
      setSelectedItem({ ...item, status: nextStatus });
    }
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
    setSelectedItem(null);
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

      <div className="mb-6 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Pesquisar por título, descrição, localização, estado, categoria ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {problemCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
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
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant={getBadgeVariant(item.status)}>
                    {item.status || "Pendente"}
                  </Badge>
                </div>

                <CardDescription className="space-y-1">
                  <div className="text-xs">
                    <strong>Categoria:</strong> {item.category || "Sem categoria"}
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">{item.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(item.created_at).toLocaleDateString("pt-PT")}
                    </span>
                  </div>

                  <div className="text-xs">
                    <strong>Submetido por:</strong>{" "}
                    {item.created_by_email || "Desconhecido"}
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>

                {canManageProblems ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-1 gap-2">
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
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                    disabled
                  >
                    Apenas visualização
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.title}</DialogTitle>
                <DialogDescription>
                  Categoria: {selectedItem.category || "Sem categoria"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {selectedItem.image_url ? (
                  <div className="rounded-xl overflow-hidden border">
                    <ImageWithFallback
                      src={selectedItem.image_url}
                      alt={selectedItem.title}
                      className="w-full max-h-[55vh] object-cover rounded-xl"
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Badge variant={getBadgeVariant(selectedItem.status)}>
                    {selectedItem.status || "Pendente"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedItem.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedItem.created_at).toLocaleDateString("pt-PT")}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    {new Date(selectedItem.created_at).toLocaleTimeString("pt-PT")}
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedItem.created_by_email || "Desconhecido"}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>

                {canManageProblems && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedItem, "Pendente")}
                      >
                        Pendente
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedItem, "Em resolução")}
                      >
                        Em resolução
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedItem, "Resolvido")}
                      >
                        Resolvido
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDelete(selectedItem)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Apagar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}