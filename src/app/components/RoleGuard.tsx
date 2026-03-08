import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { supabase } from "../lib/supabase";

type RoleGuardProps = {
  allow: string[];
  children: React.ReactNode;
};

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    setRole(data?.role ?? null);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-500">A carregar...</p>
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    if (role === "dep_problemas") {
      return <Navigate to="/reportacoes" replace state={{ from: location }} />;
    }

    if (role === "dep_perdidos") {
      return <Navigate to="/achados-perdidos" replace state={{ from: location }} />;
    }

    if (role === "dep_eventos") {
      return <Navigate to="/eventos" replace state={{ from: location }} />;
    }

    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}