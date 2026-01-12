import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FeedIcon from '@mui/icons-material/Feed'
import ConstructionIcon from '@mui/icons-material/Construction'
import CoffeeIcon from '@mui/icons-material/Coffee'
import RedditIcon from '@mui/icons-material/Reddit'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import TableChartIcon from '@mui/icons-material/TableChart'
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast'

export default [
    {
        title: 'Home',
        icon: <HomeIcon fontSize='small'/>,
        path: '/',
    },
    {
        title: 'My Gear',
        icon: <ConstructionIcon fontSize='small'/>,
        path: '/equipment',
    },
    {
        title: 'My Coffees',
        icon: <FreeBreakfastIcon fontSize='small'/>,
        path: '/coffees',
    },
    {
        title: 'All Brews',
        icon: <CoffeeIcon fontSize='small'/>,
        path: '/brews',
    },
    {
        title: 'Popular Roasters',
        icon: <FeedIcon fontSize='small'/>,
        path: '/roasters',
    },
    {
        title: 'Espresso Bean Database',
        icon: <TableChartIcon fontSize='small'/>,
        path: '/espressoBeans',
        params: {
            search: undefined,
            id: undefined,
            name: undefined
        }
    },
    {
        title: 'Stats & Charts',
        icon: <InsertChartOutlinedIcon fontSize='small'/>,
        path: '/espressoStats',
    },
    {
        title: 'Add A Roaster',
        icon: <AddCircleOutlineIcon fontSize='small'/>,
        path: '/info',
        disabled: true,
    },
    {
        title: 'Glossary',
        icon: <MenuBookIcon fontSize='small'/>,
        path: '/glossary',
        disabled: true,
    },
    {
        title: 'About Coffee Tracker',
        icon: <InfoOutlinedIcon fontSize='small'/>,
        path: '/about',
        disabled: true,
    },
    {
        title: 'Visit r/Espresso',
        icon: <RedditIcon fontSize='small'/>,
        path: 'https://www.reddit.com/r/espresso/',
    },
    {
        title: 'Visit r/Pourover',
        icon: <RedditIcon fontSize='small'/>,
        path: 'https://www.reddit.com/r/pourover/',
    },
]
