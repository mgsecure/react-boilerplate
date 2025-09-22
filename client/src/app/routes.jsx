import React, {Suspense, lazy} from 'react'
import {redirect, Outlet, Navigate} from 'react-router-dom'

import ErrorBoundary from './ErrorBoundary'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'

const style = {maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}

const AppShell = () => (
    <div style={{...style, fontFamily: 'Roboto, system-ui, sans-serif'}}>
        <Outlet/>
    </div>
)

export default [{
    element: <AppShell/>,
    errorElement: <ErrorBoundary/>,
    //HydrateFallback: () => <LoadingDisplay/>,
    HydrateFallback: () => {},
    children: [
        {
            path: '/',
            lazy: async () => {
                const {default: FrontPageRoute} = await import('../front/FrontPageRoute.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><FrontPageRoute/></Suspense>}
            }
        },
        {
            path: '/suggestions',
            lazy: async () => {
                const {default: SendToDiscordRoute} = await import('../sendToDiscord/SendToDiscordRoute')
                return {element: <Suspense><SendToDiscordRoute/></Suspense>}
            }
        },{
            path: '/modbox',
            lazy: async () => {
                const {default: SendToDiscordRoute} = await import('../sendToDiscord/SendToDiscordRoute')
                return {element: <Suspense><SendToDiscordRoute/></Suspense>}
            }
        },
        {
            path: '/testing',
            element: <Navigate to='/test' replace/>
        },
        {
            path: '/test',
            lazy: async () => {
                const {default: TestRoute} = await import('../test/TestPage.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><TestRoute/></Suspense>}
            }
        },
        {
            path: '/theme',
            lazy: async () => {
                const {default: ThemeViewerRoute} = await import('../test/ThemeViewer.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><ThemeViewerRoute/></Suspense>}
            }
        },
        {
            path: '*',
            lazy: async () => {
                const {default: NotFound} = await import('./NotFound.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><NotFound/></Suspense>}
            }
        }
    ].map(route => ({...route, errorElement: <ErrorBoundary/>}))
}]

