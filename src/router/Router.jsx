import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Contact from "../pages/Contact/Contact";
import ServicesPage from "../pages/Services/ServicesPage";
import AboutPage from "../pages/About/AboutPage";


const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/about",
        Component: AboutPage,
      },
      {
        path: "/services",
        Component: ServicesPage,
      },
    ],
  },
  
]);

export default router;