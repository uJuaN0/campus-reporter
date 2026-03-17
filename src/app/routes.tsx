import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { AchadosPerdidos } from "./components/AchadosPerdidos";
import { Eventos } from "./components/Eventos";
import { Reportacoes } from "./components/Reportacoes";
import { Reportar } from "./components/Reportar";
import { Administracao } from "./components/Administracao";
import { RoleGuard } from "./components/RoleGuard";
import { HubInternacional } from "./components/HubInternacional";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: (
            <RoleGuard allow={["admin", "aluno"]}>
              <Dashboard />
            </RoleGuard>
          ),
        },
        {
          path: "hub-internacional",
          element: (
            <RoleGuard allow={["admin", "aluno"]}>
              <HubInternacional />
            </RoleGuard>
          ),
        },
        {
          path: "reportacoes",
          element: (
            <RoleGuard allow={["admin", "aluno", "dep_problemas"]}>
              <Reportacoes />
            </RoleGuard>
          ),
        },
        {
          path: "achados-perdidos",
          element: (
            <RoleGuard allow={["admin", "aluno", "dep_perdidos"]}>
              <AchadosPerdidos />
            </RoleGuard>
          ),
        },
        {
          path: "eventos",
          element: (
            <RoleGuard allow={["admin", "aluno", "dep_eventos"]}>
              <Eventos />
            </RoleGuard>
          ),
        },
        {
          path: "reportar",
          element: (
            <RoleGuard allow={["admin", "aluno"]}>
              <Reportar />
            </RoleGuard>
          ),
        },
        {
          path: "administracao",
          element: (
            <RoleGuard allow={["admin"]}>
              <Administracao />
            </RoleGuard>
          ),
        },
      ],
    },
  ],
  {
    basename: "/Nova-Connect/",
  }
);