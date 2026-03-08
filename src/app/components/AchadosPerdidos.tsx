import { useEffect, useMemo, useState } from "react";
import {
  Package,
  MapPin,
  Calendar,
  Search,
  Plus,
  CheckCircle,
  Trash2,
  Filter,
  Clock3,
  User,
  MessageCircle,
  Bell,
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
  category: string | null;
  description: string;
  location: string;
  created_at: string;
  image_url: string | null;
  status: "Perdido" | "Achado" | null;
  created_by_email: string | null;
  type: "Perdido e Achado";
}

interface CommentItem {
  id: number;
  report_id: number;
  content: string;
  created_at: string;
  created_by_email: string | null;
}

const lostFoundCategories = [
  "Todos",
  "Telefone",
  "Vestuário",
  "Material escolar",
  "Carteira",
  "Chaves",
  "Eletrónicos",
  "Outro",
];

export function AchadosPerdidos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [items, setItems] = useState<LostItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  const [commentsByReport, setCommentsByReport] = useState<Record<number, CommentItem[]>>({});
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Telefone");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);

  const canManageLostFound = role === "admin" || role === "dep_perdidos";

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setMyUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      setRole(profile?.role ?? null);

      const { data: subs } = await supabase
        .from("notification_subscriptions")
        .select("report_id")
        .eq("user_id", user.id);

      setSubscriptions((subs ?? []).map((s) => s.report_id));
    } else {
      setRole(null);
      setMyUserId(null);
      setSubscriptions([]);
    }

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("type", "Perdido e Achado")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar itens.");
      setLoading(false);
      return;
    }

    const reports = (data ?? []) as LostItem[];
    setItems(reports);

    if (reports.length > 0) {
      const reportIds = reports.map((item) => item.id);

      const { data: commentsData, error: commentsError } = await supabase
        .from("report_comments")
        .select("*")
        .in("report_id", reportIds)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error(commentsError);
        toast.error("Erro ao carregar comentários.");
      } else {
        const grouped: Record<number, CommentItem[]> = {};
        for (const comment of (commentsData ?? []) as CommentItem[]) {
          if (!grouped[comment.report_id]) grouped[comment.report_id] = [];
          grouped[comment.report_id].push(comment);
        }
        setCommentsByReport(grouped);
      }
    } else {
      setCommentsByReport({});
    }

    setLoading(false);
  }

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase();

    const visible = items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.created_by_email || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "Todos" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    return visible.sort((a, b) => {
      const aResolved = a.status === "Achado" ? 1 : 0;
      const bResolved = b.status === "Achado" ? 1 : 0;

      if (aResolved !== bResolved) {
        return aResolved - bResolved;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [items, searchTerm, categoryFilter]);

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
    if (!title || !location || !description || !category) {
      toast.error("Preenche título, localização, descrição e categoria.");
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
      category,
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
    setCategory("Telefone");
    setLocation("");
    setDescription("");
    setImageBase64("");
    await loadAll();
  }

  async function toggleNotification(item: LostItem) {
    if (!myUserId) {
      toast.error("Precisas de iniciar sessão.");
      return;
    }

    const isSubscribed = subscriptions.includes(item.id);

    if (isSubscribed) {
      const { error } = await supabase
        .from("notification_subscriptions")
        .delete()
        .eq("user_id", myUserId)
        .eq("report_id", item.id);

      if (error) {
        console.error(error);
        toast.error("Não foi possível desativar notificações.");
        return;
      }

      setSubscriptions((prev) => prev.filter((id) => id !== item.id));
      toast.success("Notificações desativadas.");
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("notification_subscriptions").insert([
        {
          user_id: myUserId,
          user_email: user?.email ?? null,
          report_id: item.id,
          report_type: item.type,
        },
      ]);

      if (error) {
        console.error(error);
        toast.error("Não foi possível ativar notificações.");
        return;
      }

      setSubscriptions((prev) => [...prev, item.id]);
      toast.success("Notificações ativadas.");
    }
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

    const { data: subs } = await supabase
      .from("notification_subscriptions")
      .select("user_id")
      .eq("report_id", item.id);

    if (subs && subs.length > 0) {
      await supabase.from("notifications").insert(
        subs.map((sub) => ({
          user_id: sub.user_id,
          title: "Estado de item atualizado",
          message: `O item "${item.title}" mudou para "${nextStatus}".`,
          report_id: item.id,
          report_type: item.type,
        }))
      );
    }

    toast.success(`Estado alterado para ${nextStatus}.`);
    await loadAll();

    if (selectedItem?.id === item.id) {
      setSelectedItem({ ...item, status: nextStatus });
    }
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
    setSelectedItem(null);
    await loadAll();
  }

  async function handleAddComment() {
    if (!selectedItem) return;

    if (!commentText.trim()) {
      toast.error("Escreve um comentário.");
      return;
    }

    setSubmittingComment(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSubmittingComment(false);
      toast.error("Sessão inválida.");
      return;
    }

    const payload = {
      report_id: selectedItem.id,
      content: commentText.trim(),
      created_by: user.id,
      created_by_email: user.email,
    };

    const { error } = await supabase.from("report_comments").insert([payload]);

    setSubmittingComment(false);

    if (error) {
      console.error(error);
      toast.error("Não foi possível adicionar comentário.");
      return;
    }

    toast.success("Comentário adicionado.");
    setCommentText("");
    await loadAll();
  }

  function getBadgeVariant(status: string | null) {
    if (status === "Achado") return "default";
    return "secondary";
  }

  const selectedComments = selectedItem ? commentsByReport[selectedItem.id] || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achados & Perdidos</h1>
          <p className="text-gray-600">
            Itens perdidos e encontrados no campus, sincronizados com a plataforma.
          </p>
        </div>

        {canManageLostFound && (
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
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {lostFoundCategories
                      .filter((item) => item !== "Todos")
                      .map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
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

      <div className="mb-6 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Pesquisar por título, localização, descrição ou email..."
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
            {lostFoundCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
          {filteredItems.map((item) => {
            const commentCount = commentsByReport[item.id]?.length || 0;
            const subscribed = subscriptions.includes(item.id);

            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
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

                    <div className="flex items-center gap-1 text-xs">
                      <MessageCircle className="w-3 h-3" />
                      <span>{commentCount} comentário{commentCount === 1 ? "" : "s"}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toggleNotification(item)}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {subscribed ? "Desativar notificações" : "Ativar notificações"}
                    </Button>

                    {canManageLostFound ? (
                      <>
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
                      </>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Apenas visualização
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                    {selectedItem.status || "Perdido"}
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

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toggleNotification(selectedItem)}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {subscriptions.includes(selectedItem.id)
                    ? "Desativar notificações"
                    : "Ativar notificações"}
                </Button>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">
                      Comentários ({selectedComments.length})
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {selectedComments.length === 0 ? (
                      <p className="text-sm text-gray-500">Ainda não há comentários.</p>
                    ) : (
                      selectedComments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border bg-gray-50 p-3">
                          <div className="text-sm font-medium text-gray-900">
                            {comment.created_by_email || "Desconhecido"}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {new Date(comment.created_at).toLocaleString("pt-PT")}
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      rows={3}
                      placeholder="Escreve um comentário..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={submittingComment}
                      className="w-full"
                    >
                      {submittingComment ? "A comentar..." : "Adicionar comentário"}
                    </Button>
                  </div>
                </div>

                {canManageLostFound && (
                  <div className="space-y-3 border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        handleToggleStatus(
                          selectedItem,
                          selectedItem.status === "Achado" ? "Perdido" : "Achado"
                        )
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como {selectedItem.status === "Achado" ? "Perdido" : "Achado"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDeleteItem(selectedItem)}
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