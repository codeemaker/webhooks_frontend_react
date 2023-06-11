import { Route, useRoutes, Navigate } from "react-router-dom";
import LoginForm from "../pages/login";
import RegisterForm from "../pages/register";
import Dashboard from "../pages/dashboard";
import Webhooks from "../pages/wehhooks";

const Router = function(){
  let token = localStorage.getItem("token");

  let routes = [
    { path: "/", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    { path: "/*", element: <LoginForm /> },
  ];

  if (token) {
    routes.push(
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/webhooks", element: <Webhooks /> }
    );
  }

  let element = useRoutes(routes);
  return element;
}

export default Router;
