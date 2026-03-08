import { useEffect, useMemo, useState } from "react";
import {
  Package,
  MapPin,
  Calendar,
  Search,
  Plus,
  CheckCircle,
  Trash2,
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
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LostItem {
  id: number;
  title: string;
  description: string;
  location: string;
  created_at: string;
  image_url: string | null;
  status: "Perdido" | "Achado" | null;
  created_by_email: string | null;
  type: "Perdido e Achado";
}

export function AchadosPerdidos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [items, setItems] = useState<LostItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      .eq("type", "Perdido e Achado")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar itens.");
    } else {
      setItems((data ?? []) as LostItem[]);
    }

    setLoading(false);
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.created_by_email || "").toLowerCase().includes(q)
      );
    });
  }, [items, searchTerm]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageBase64(result);
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleAddItem() {
    if (!title || !location || !description) {
      toast.error("Preenche título, localização e descrição.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSubmitting(false);
      toast.error("Sessão inválida.");
      return;
    }

    const payload = {
      type: "Perdido e Achado",
      title,
      description,
      location,
      image_url: imageBase64 || null,
      status: "Perdido",
      created_by: user.id,
      created_by_email: user.email,
    };

    const { error } = await supabase.from("reports").insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Erro ao adicionar item.");
      return;
    }

    toast.success("Item adicionado com sucesso.");
    setShowAddDialog(false);
    setTitle("");
    setLocation("");
    setDescription("");
    setImageBase64("");
    await loadAll();
  }

  async function handleToggleStatus(item: LostItem, nextStatus: "Perdido" | "Achado") {
    const { error } = await supabase
      .from("reports")
      .update({ status: nextStatus })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      toast.error("Não foi possível alterar o estado.");
      return;
    }

    toast.success(`Estado alterado para ${nextStatus}.`);
    await loadAll();
  }

  async function handleDeleteItem(item: LostItem) {
    const confirmed = window.confirm(`Apagar "${item.title}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from("reports").delete().eq("id", item.id);

    if (error) {
      console.error(error);
      toast.error("Não foi possível apagar o item.");
      return;
    }

    toast.success("Item apagado.");
    await loadAll();
  }

  function getBadgeVariant(status: string | null) {
    if (status === "Achado") return "default";
    return "secondary";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achados & Perdidos</h1>
          <p className="text-gray-600">
            Itens perdidos e encontrados no campus, sincronizados com a plataforma.
          </p>
        </div>

        {role === "admin" && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Item</DialogTitle>
                <DialogDescription>
                  Criar novo item de perdidos e achados.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <Input
                    placeholder="Ex: Carteira preta"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Localização *
                  </label>
                  <Input
                    placeholder="Ex: Biblioteca - Sala de Estudo"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    placeholder="Descreve o item com detalhes..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto
                  </label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <Button onClick={handleAddItem} className="w-full" disabled={submitting}>
                  {submitting ? "A adicionar..." : "Adicionar Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Itens encontrados</h3>
                <p className="text-green-800 text-sm">
                  O admin pode registar itens e marcar quando passam de perdidos para achados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Consulta rápida</h3>
                <p className="text-blue-800 text-sm">
                  Todos os utilizadores conseguem ver os itens e o respetivo estado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Pesquisar por título, localização, descrição ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">A carregar itens...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum item encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <ImageWithFallback
                  src={
                    item.image_url ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant={getBadgeVariant(item.status)}>
                    {item.status || "Perdido"}
                  </Badge>
                </div>

                <CardDescription className="space-y-1">
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
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                {role === "admin" ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleToggleStatus(
                          item,
                          item.status === "Achado" ? "Perdido" : "Achado"
                        )
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como {item.status === "Achado" ? "Perdido" : "Achado"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Apagar
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
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