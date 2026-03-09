import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logoImg from "../../assets/logo.png";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error("Erro no login: " + error.message);
      return;
    }

    toast.success("Login efetuado com sucesso.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-3 shadow-sm">
            <img src={logoImg} alt="NOVA Connect" className="w-10 h-auto" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">NOVA Connect</h1>
          <p className="text-slate-600 text-sm mt-1">Plataforma de Colaboração</p>
        </div>

        <Card className="shadow-lg border border-slate-200">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-xl font-semibold">Bem-vindo</CardTitle>
            <CardDescription>Entre com as suas credenciais</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="utilizador@campus.fct.unl.pt"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Palavra-passe</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "A entrar..." : "Entrar"}
              </Button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-6">
              FCT • Universidade NOVA de Lisboa
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="w-full max-w-4xl mt-8 pb-6 text-center space-y-3">
        <div className="text-xs text-slate-600">
          <p className="font-semibold">Faculdade de Ciências e Tecnologia</p>
          <p>Universidade NOVA de Lisboa</p>
          <p className="mt-1 text-slate-500">Campus de Caparica • 2829-516 Caparica • Portugal</p>
        </div>
        
        <div className="pt-3 border-t border-slate-300/50">
          <p className="text-xs text-slate-500">
            Desenvolvido na <span className="font-semibold text-slate-700">Innovation Week Hackathon</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Grupo <span className="font-semibold">"Di Fora"</span> • Juan Lima, Djeison Santos e Lenine Santos
          </p>
        </div>
      </footer>
    </div>
  );
}