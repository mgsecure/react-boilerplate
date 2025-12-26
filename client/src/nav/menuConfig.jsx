import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FeedIcon from '@mui/icons-material/Feed'
import BuildIcon from '@mui/icons-material/Build'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import ConstructionIcon from '@mui/icons-material/Construction'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption'
import CampaignIcon from '@mui/icons-material/Campaign'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TurnSharpRightIcon from '@mui/icons-material/TurnSharpRight'
import CoffeeIcon from '@mui/icons-material/Coffee'
import RedditIcon from '@mui/icons-material/Reddit'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const {VITE_RAFL_STATE: raflState} = import.meta.env

export default [
    {
        title: 'Espresso Bean Database',
        icon: <CoffeeIcon fontSize='small'/>,
        path: '/espressoBeans',
        params: {
            search: undefined,
            id: undefined,
            name: undefined
        }
    },
    {
        title: 'Add A Bean',
        icon: <AddCircleOutlineIcon fontSize='small'/>,
        path: '/info',
        disabled: true,
    },
    {
        title: 'Roaster Database',
        icon: <FeedIcon fontSize='small'/>,
        path: '/rafl',
        disabled: true,
    },
    {
        title: 'Stats & Charts',
        icon: <InsertChartOutlinedIcon fontSize='small'/>,
        path: '/safelocks',
        disabled: true,
    },
    {
        title: 'Glossary',
        icon: <MenuBookIcon fontSize='small'/>,
        path: '/glossary',
        disabled: true,
    },
    {
        title: 'About the Database',
        icon: <InfoOutlinedIcon fontSize='small'/>,
        path: '/about',
        disabled: true,
    },
    {
        title: 'Visit r/espresso',
        icon: <RedditIcon fontSize='small'/>,
        path: 'https://www.reddit.com/r/espresso/',
    },
]
