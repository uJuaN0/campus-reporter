import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { PlusCircle, Upload, AlertCircle, Package } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const problemCategories = [
  "Luz fundida",
  "Porta estragada",
  "Equipamento avariado",
  "Tomada sem funcionar",
  "Água / canalização",
  "Limpeza",
  "Outro",
];

const lostFoundCategories = [
  "Telefone",
  "Vestuário",
  "Material escolar",
  "Carteira",
  "Chaves",
  "Eletrónicos",
  "Outro",
];

export function Reportar() {
  const [tipo, setTipo] = useState("Problema");
  const [category, setCategory] = useState(problemCategories[0]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentCategories =
    tipo === "Problema" ? problemCategories : lostFoundCategories;

  function handleTypeChange(nextType: string) {
    setTipo(nextType);
    setCategory(
      nextType === "Problema" ? problemCategories[0] : lostFoundCategories[0]
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImagemBase64(result);
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo || !descricao || !localizacao || !category) {
      toast.error("Preenche título, descrição, localização e categoria.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSubmitting(false);
      toast.error("Tens de iniciar sessão para reportar.");
      return;
    }

    const payload = {
      type: tipo,
      category,
      title: titulo,
      description: descricao,
      location: localizacao,
      image_url: imagemBase64 || null,
      status: tipo === "Problema" ? "Pendente" : "Perdido",
      created_by: user.id,
      created_by_email: user.email,
    };

    const { error } = await supabase.from("reports").insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Erro ao submeter: " + error.message);
      return;
    }

    toast.success(
      tipo === "Problema"
        ? "Problema reportado com sucesso."
        : "Item de perdidos e achados criado com sucesso."
    );

    setTipo("Problema");
    setCategory(problemCategories[0]);
    setTitulo("");
    setDescricao("");
    setLocalizacao("");
    setImagemBase64("");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportar</h1>
        <p className="text-gray-600">
          Criar uma nova ocorrência do campus ou um item de perdidos e achados.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Novo reporte
          </CardTitle>
          <CardDescription>
            Escolhe o tipo de reporte e preenche os detalhes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange("Problema")}
                className={`rounded-xl border p-4 text-left transition ${
                  tipo === "Problema"
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Problema</span>
                </div>
                <p className="text-sm text-gray-600">
                  Reportar uma ocorrência, avaria ou problema no campus.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("Perdido e Achado")}
                className={`rounded-xl border p-4 text-left transition ${
                  tipo === "Perdido e Achado"
                    ? "border-amber-300 bg-amber-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold">Perdidos & Achados</span>
                </div>
                <p className="text-sm text-gray-600">
                  Registar um item perdido ou encontrado no campus.
                </p>
              </button>
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
                {currentCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                placeholder={
                  tipo === "Problema"
                    ? "Ex: Luz fundida no corredor"
                    : "Ex: Carteira preta encontrada"
                }
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização *
              </label>
              <Input
                placeholder="Ex: Biblioteca, Edifício VII, Cantina..."
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                rows={5}
                placeholder={
                  tipo === "Problema"
                    ? "Descreve o problema..."
                    : "Descreve o item perdido/encontrado..."
                }
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Imagem
              </label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            {imagemBase64 ? (
              <div className="rounded-xl overflow-hidden border">
                <ImageWithFallback
                  src={imagemBase64}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "A submeter..." : "Submeter reporte"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}