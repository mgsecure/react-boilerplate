import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import routes from './routes'

function AppRoutes() {
    const router = createBrowserRouter(routes)

    return <RouterProvider router={router}/>
}

export default AppRoutes
