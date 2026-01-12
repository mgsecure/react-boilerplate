import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext'
import BeanEntry from './BeanEntry.jsx'
import FilterContext from '../context/FilterContext'
import ExportButton from './ExportButton.jsx'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import FilterDisplayAdvanced from '../filters/FilterDisplayAdvanced.jsx'

function BeanEntries() {
    const {filters, filterCount} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries, expandAll, loading} = useContext(DataContext)

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const footerBefore = (
        <div style={{margin:'30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries}/>
        </div>
    )

    return (
        <div style={{margin: 8, paddingBottom: 32, width: '100%', maxWidth: 800}}>

            {filterCount > 0 &&
                <div style={{marginBottom: 10}}>
                    <FilterDisplayAdvanced/>
                </div>
            }

            { loading && <LoadingDisplay/>}

            {visibleEntries.map(entry =>
                <BeanEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded || !!expandAll}
                />
            )}

            <Footer before={footerBefore}/>

        </div>
    )
}

export default BeanEntries
