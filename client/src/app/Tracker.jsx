import React, {useContext} from 'react'
import querystring from 'query-string'
import AppContext from './AppContext'

function Tracker({feature, ...extraParams}) {
    const {admin} = useContext(AppContext) //eslint-disable-line

    // disable for rafl testing/reporting
    if (import.meta.env.DEV || admin) return null

    const randomStuff = (Math.random()).toString(36).substring(2, 10)
    const file = files[feature] || 'bean.gif'
    const ref = document.referrer || 'none'
    const page = window.location.href.replace(/.*\/#\/(\w+)\?*.*/,'$1')
    const query = querystring.stringify({trk: feature, r: randomStuff, w: screen.width, ref, page, ...extraParams})
    const url = `https://beans.mgsecure.com/i/${file}?${query}`

    // <Tracker feature='search' search={search}/>
    // <Tracker feature='lock' id={entry.id} search={search}/>

    return <img alt='lpu' src={url} width={0} height={0}/>
}

const files = {
    locks: 'bean.gif',
}

export default React.memo(Tracker)
