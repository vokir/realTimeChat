import { Navigate, RouteObject } from "react-router-dom";
import Chat from '../pages/ChatPage/ChatPage'
import Login from '../pages/LoginPage/LoginPage'
import Register from "../pages/RegisterPage/RegisterPage";

export const publicRoutes: RouteObject[] = [
    {
        path: '*',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]

export const privateRoutes: RouteObject[] = [
    {
        path: '*',
        element: <Navigate to="/chat" replace />
    },
    {
        path: "/chat",
        element: <Chat />
    }
];

