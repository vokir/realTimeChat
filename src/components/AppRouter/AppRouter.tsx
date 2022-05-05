import React from 'react'
import { Routes, Route, useRoutes } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '../../routes/index'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import Loader from '../ui/Loader/Loader'


const AppRouter = () => {
    const auth = getAuth()
    const [user, loading] = useAuthState(auth)


    const routes = user ? privateRoutes : publicRoutes;
    useRoutes(routes)

    if (loading) return <Loader />

    return (
        <Routes>
            {routes.map((route) => <Route path={route.path} element={route.element} key={route.path} />)}
        </Routes>
    )
}

export default AppRouter