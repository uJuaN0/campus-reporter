import { useEffect, useState } from "react";
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
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
      console.error(error);
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

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Não foi possível apagar o evento.");
      return;
    }

    toast.success("Evento apagado.");
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

        {role === "admin" && (
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
                  Apenas administradores podem criar eventos.
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
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ainda não há eventos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {event.image_url ? (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <CardHeader>
                <CardTitle>{event.title}</CardTitle>

                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Início: {formatDate(event.event_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock3 className="w-4 h-4" />
                    <span>
                      Fim:{" "}
                      {event.event_end_date
                        ? formatDate(event.event_end_date)
                        : "Sem fim definido"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{event.created_by_email || "Desconhecido"}</span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{event.description}</p>

                {role === "admin" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Apagar Evento
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

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-PT");
}