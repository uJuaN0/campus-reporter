import { useEffect, useState } from "react";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface ProfileItem {
  id: string;
  email: string | null;
  role: string | null;
}

const roleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "dep_problemas", label: "Dep. Problemas" },
  { value: "dep_perdidos", label: "Dep. Perdidos e Achados" },
  { value: "dep_eventos", label: "Dep. Eventos" },
  { value: "aluno", label: "Aluno" },
];

export function Administracao() {
  const [myRole, setMyRole] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("aluno");
  const [creatingUser, setCreatingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setMyUserId(user.id);

      const { data: myProfile, error: myProfileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (myProfileError) {
        console.error(myProfileError);
        toast.error("Erro ao carregar o teu perfil.");
        return;
      }

      setMyRole(myProfile?.role ?? null);

      const { data: profileRows, error } = await supabase
        .from("profiles")
        .select("id, email, role")
        .order("email", { ascending: true });

      if (error) {
        console.error(error);
        toast.error("Erro ao carregar utilizadores.");
        return;
      }

      setProfiles((profileRows ?? []) as ProfileItem[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro inesperado ao carregar utilizadores.");
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(profileId: string, newRole: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", profileId);

      if (error) {
        console.error(error);
        toast.error("Não foi possível atualizar o role.");
        return;
      }

      toast.success("Role atualizado.");
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar role:", error);
      toast.error("Erro ao atualizar role.");
    }
  }

  async function createUser() {
    if (!email || !password || !role) {
      toast.error("Preenche email, password e role.");
      return;
    }

    setCreatingUser(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error("Sessão inválida. Faz login novamente.");
        return;
      }

      const response = await fetch(
        "https://ebejbuhdngrjbkvfldfh.supabase.co/functions/v1/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro da função:", data);
        toast.error(data.error || "Erro ao criar utilizador.");
        return;
      }

      toast.success("Utilizador criado com sucesso.");
      setEmail("");
      setPassword("");
      setRole("aluno");
      await loadData();
    } catch (error) {
      console.error("Erro ao criar utilizador:", error);
      toast.error("Erro ao contactar a função.");
    } finally {
      setCreatingUser(false);
    }
  }

  async function deleteUser(profile: ProfileItem) {
    if (!profile.id) return;

    if (profile.id === myUserId) {
      toast.error("Não podes apagar a tua própria conta.");
      return;
    }

    const confirmed = window.confirm(
      `Tens a certeza que queres apagar o utilizador "${profile.email || profile.id}"?`
    );

    if (!confirmed) return;

    setDeletingUserId(profile.id);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error("Sessão inválida. Faz login novamente.");
        return;
      }

      const response = await fetch(
        "https://ebejbuhdngrjbkvfldfh.supabase.co/functions/v1/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            userId: profile.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro da função:", data);
        toast.error(data.error || "Erro ao apagar utilizador.");
        return;
      }

      toast.success("Utilizador apagado com sucesso.");
      await loadData();
    } catch (error) {
      console.error("Erro ao apagar utilizador:", error);
      toast.error("Erro ao contactar a função.");
    } finally {
      setDeletingUserId(null);
    }
  }

  if (myRole !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">Sem acesso a esta área.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administração</h1>
        <p className="text-gray-600">
          Gestão de utilizadores e permissões da plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Adicionar utilizador
          </CardTitle>
          <CardDescription>
            Cria utilizadores diretamente pela aplicação.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roleOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <Button onClick={createUser} disabled={creatingUser}>
            {creatingUser ? "A criar..." : "Criar utilizador"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Roles dos utilizadores
          </CardTitle>
          <CardDescription>
            Administrador, departamentos e aluno.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-gray-500">A carregar utilizadores...</p>
          ) : profiles.length === 0 ? (
            <p className="text-gray-500">Sem utilizadores.</p>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 break-all">
                      {profile.email || "Sem email"}
                    </div>
                    <div className="text-sm text-gray-500 break-all">
                      ID: {profile.id}
                    </div>
                  </div>

                  <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 lg:items-center">
                    <div className="w-full sm:w-80">
                      <select
                        value={profile.role || "aluno"}
                        onChange={(e) => updateRole(profile.id, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roleOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => deleteUser(profile)}
                      disabled={deletingUserId === profile.id || profile.id === myUserId}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deletingUserId === profile.id ? "A apagar..." : "Apagar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}