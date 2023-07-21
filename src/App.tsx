import { RouterProvider } from "react-router-dom";
import { router } from "./navigation/routes";

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
