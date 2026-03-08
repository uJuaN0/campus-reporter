import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { AchadosPerdidos } from "./components/AchadosPerdidos";
import { Eventos } from "./components/Eventos";
import { Reportacoes } from "./components/Reportacoes";
import { Reportar } from "./components/Reportar";
import { Administracao } from "./components/Administracao";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "reportacoes", element: <Reportacoes /> },
        { path: "achados-perdidos", element: <AchadosPerdidos /> },
        { path: "eventos", element: <Eventos /> },
        { path: "reportar", element: <Reportar /> },
        { path: "administracao", element: <Administracao /> },
      ],
    },
  ],
  {
    basename: "/campus-reporter/",
  }
);