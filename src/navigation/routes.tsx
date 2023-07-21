import { createBrowserRouter } from "react-router-dom";
import { MainView } from "../views/Main.view";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainView />,
  },
]);
