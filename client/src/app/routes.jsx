import React, {Suspense} from 'react'
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
                const {default: BeansRoute} = await import('../espressoBeans/BeansRoute.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><BeansRoute/></Suspense>}
            }
        },
        {
            path: '/espressoBeans',
            name: 'espressoBeans',
            lazy: async () => {
                const {default: BeansRoute} = await import('../espressoBeans/BeansRoute.jsx')
                return {element: <Suspense><BeansRoute/></Suspense>}
            }
        },
        {
            path: '/espressoStats',
            name: 'espressoStats',
            lazy: async () => {
                const {default: EspressoStatsRoute} = await import('../espressoStats/EspressoStatsRoute.jsx')
                return {element: <Suspense><EspressoStatsRoute/></Suspense>}
            }
        },
        {
            path: '/brews',
            name: 'brews',
            lazy: async () => {
                const {default: BrewsRoute} = await import('../brews/BrewsRoute.jsx')
                return {element: <Suspense><BrewsRoute/></Suspense>}
            }
        },
        {
            path: '/profile',
            name: 'profile',
            lazy: async () => {
                const {default: ProfileParentRoute} = await import('../profile/ProfileParentRoute.jsx')
                return {element: <Suspense><ProfileParentRoute/></Suspense>}
            },
            children: [
                {
                    path: '/profile',
                    lazy: async () => {
                        const {default: ViewProfileRoute} = await import('../profile/ViewProfileRoute.jsx')
                        return {element: <Suspense><ViewProfileRoute/></Suspense>}
                    }
                },
                ]
        },
        {
            path: '/roasters',
            name: 'roasters',
            lazy: async () => {
                const {default: RoastersRoute} = await import('../roasters/RoastersRoute.jsx')
                return {element: <Suspense><RoastersRoute/></Suspense>}
            }
        },
        {
            path: '/suggestions',
            name: 'suggestion box',
            lazy: async () => {
                const {default: SendToDiscordRoute} = await import('../sendToDiscord/SendToDiscordRoute')
                return {element: <Suspense><SendToDiscordRoute/></Suspense>}
            }
        },
        {
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
            path: '/tests',
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

