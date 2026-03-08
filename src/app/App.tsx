import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { supabase } from "./lib/supabase";
import { Login } from "./components/Login";

export default function App() {
  const [session, setSession] = useState<unknown | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(session ?? null);
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return <div className="p-8">A carregar...</div>;
  }

  return (
    <>
      {session ? <RouterProvider router={router} /> : <Login />}
      <Toaster />
    </>
  );
}