import React, {Suspense, lazy} from 'react'
import {Outlet, Navigate} from 'react-router-dom'

import ErrorBoundary from './ErrorBoundary'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import EnvAppBar from '../misc/EnvAppBar.jsx'

const style = {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

const AppShell = () => (
    <React.Fragment>
        <EnvAppBar/>
        <div style={{...style, fontFamily: 'Roboto, system-ui, sans-serif'}}>
            <Outlet/>
        </div>
    </React.Fragment>

)

export default [{
    element: <AppShell/>,
    errorElement: <ErrorBoundary/>,
    //HydrateFallback: () => <LoadingDisplay/>,
    HydrateFallback: () => {
    },
    children: [
        {
            path: '/',
            name: 'homepage',
            lazy: async () => {
                const {default: FrontPageRoute} = await import('../front/FrontPageRoute.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><FrontPageRoute/></Suspense>}
            }
        },
        {
            path: '/suggestions',
            name: 'suggestion box',
            lazy: async () => {
                const {default: SendToDiscordRoute} = await import('../sendToDiscord/SendToDiscordRoute')
                return {element: <Suspense><SendToDiscordRoute/></Suspense>}
            }
        }, {
            path: '/modbox',
            name: 'modbox',
            lazy: async () => {
                const {default: SendToDiscordRoute} = await import('../sendToDiscord/SendToDiscordRoute')
                return {element: <Suspense><SendToDiscordRoute/></Suspense>}
            }
        },
        {
            path: '/testing',
            name: 'testing (redirect)',
            element: <Navigate to='/test' replace/>
        },
        {
            path: '/test',
            name: 'test',
            lazy: async () => {
                const {default: TestRoute} = await import('../test/TestPage.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><TestRoute/></Suspense>}
            }
        },
        {
            path: '/theme',
            name: 'theme viewer',
            lazy: async () => {
                const {default: ThemeViewerRoute} = await import('../test/ThemeViewer.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><ThemeViewerRoute/></Suspense>}
            }
        },
        {
            path: '/settings',
            name: 'settings',
            lazy: async () => {
                const {default: SettingsRoute} = await import('../settings/SettingsRoute')
                return {element: <Suspense fallback={<LoadingDisplay/>}><SettingsRoute/></Suspense>}
            }
        },
        {
            path: '*',
            name: '404 not found',
            lazy: async () => {
                const {default: NotFound} = await import('./NotFound.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><NotFound/></Suspense>}
            }
        }
    ].map(route => ({...route, errorElement: <ErrorBoundary/>}))
}]

