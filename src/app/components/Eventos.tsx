import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock3, Plus, Trash2, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

interface EventItem {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_end_date: string | null;
  image_url: string | null;
  created_by_email: string | null;
}

export function Eventos() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canManageEvents = role === "admin" || role === "dep_eventos";

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
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar eventos.");
    } else {
      setEvents((data ?? []) as EventItem[]);
    }

    setLoading(false);
  }

  const orderedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
  }, [events]);

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

  async function handleCreateEvent() {
    if (!title || !description || !eventDate || !eventEndDate) {
      toast.error("Preenche todos os campos obrigatórios.");
      return;
    }

    if (new Date(eventEndDate) < new Date(eventDate)) {
      toast.error("A data de fim não pode ser anterior à data de início.");
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
      title,
      description,
      event_date: eventDate,
      event_end_date: eventEndDate,
      image_url: imageBase64 || null,
      created_by: user.id,
      created_by_email: user.email,
    };

    const { error } = await supabase.from("events").insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error("Erro ao criar evento:", error);
      toast.error("Erro ao criar evento: " + error.message);
      return;
    }

    toast.success("Evento criado com sucesso.");
    setOpen(false);
    setTitle("");
    setDescription("");
    setEventDate("");
    setEventEndDate("");
    setImageBase64("");
    await loadAll();
  }

  async function handleDeleteEvent(id: number) {
    const confirmed = window.confirm("Tens a certeza que queres apagar este evento?");
    if (!confirmed) return;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Erro ao apagar evento:", error);
      toast.error("Não foi possível apagar o evento: " + error.message);
      return;
    }

    toast.success("Evento apagado.");
    setSelectedEvent(null);
    await loadAll();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
          <p className="text-gray-600">
            Eventos do campus visíveis para todos os utilizadores.
          </p>
        </div>

        {canManageEvents && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Criar Evento</DialogTitle>
                <DialogDescription>
                  Apenas administradores e o departamento de eventos podem criar eventos.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <Input
                    placeholder="Ex: Workshop de IA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    placeholder="Descreve o evento..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Início do evento *
                  </label>
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fim do evento *
                  </label>
                  <Input
                    type="datetime-local"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem
                  </label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <Button
                  onClick={handleCreateEvent}
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "A criar..." : "Criar Evento"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">A carregar eventos...</p>
      ) : orderedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ainda não há eventos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              {event.image_url ? (
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>

                <CardDescription className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Início: {formatDate(event.event_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Clock3 className="w-3.5 h-3.5" />
                    <span>
                      Fim:{" "}
                      {event.event_end_date
                        ? formatDate(event.event_end_date)
                        : "Sem fim definido"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <User className="w-3.5 h-3.5" />
                    <span>{event.created_by_email || "Desconhecido"}</span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {event.description}
                </p>

                {canManageEvents && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Apagar Evento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Informação detalhada do evento
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {selectedEvent.image_url ? (
                  <div className="rounded-xl overflow-hidden border">
                    <ImageWithFallback
                      src={selectedEvent.image_url}
                      alt={selectedEvent.title}
                      className="w-full max-h-[55vh] object-cover rounded-xl"
                    />
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Início: {formatDate(selectedEvent.event_date)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    Fim:{" "}
                    {selectedEvent.event_end_date
                      ? formatDate(selectedEvent.event_end_date)
                      : "Sem fim definido"}
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <User className="w-4 h-4" />
                    {selectedEvent.created_by_email || "Desconhecido"}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>

                {canManageEvents && (
                  <div className="border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Apagar Evento
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

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT");
}