import React, { useEffect } from 'react'
import { Routes, Route, useRoutes } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '../../routes/index'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import Loader from '../ui/Loader/Loader'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { setUser } from '../../store/slices/UserSlice'


const AppRouter = () => {
    const auth = getAuth()
    const [user, loading] = useAuthState(auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user) dispatch(setUser({
            email: user.email,
            username: user.displayName,
            uid: user.uid,
        }))
    }, [user])

    const routes = user ? privateRoutes : publicRoutes;
    useRoutes(routes)

    if (loading) return <Loader />

    return (
        <Routes>
            {routes.map((route) =>
                <Route path={route.path} element={route.element} key={route.path} >
                    {route.children?.map(childRoute =>
                        <Route path={childRoute.path} element={childRoute.element} key={childRoute.path} />
                    )}
                </Route>
            )}
        </Routes>
    )
}

export default AppRouter