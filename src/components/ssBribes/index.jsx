import { useState, useEffect, useCallback } from 'react'

import classes from './ssBribes.module.css'

import BribeCard from '../ssBribeCard'

import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'
import { EnhancedTableToolbar } from '../../pages/bribe'

export default function Bribes() {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  const [pairs, setPairs] = useState([])

  useEffect(() => {
    const stableSwapUpdated = () => {
      const pairs = stores.stableSwapStore.getStore('pairs')
      const pairsWithBribes = pairs.filter((pair) => {
        return pair && pair.gauge != null && pair.gauge.address && pair.gauge.bribes && pair.gauge.bribes.length > 0
      })
      setPairs(pairsWithBribes)
      forceUpdate()
    }

    stableSwapUpdated()

    stores.emitter.on(ACTIONS.UPDATED, stableSwapUpdated)
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, stableSwapUpdated)
    }
  }, [])

  return (
    <div className={classes.container}>
      <EnhancedTableToolbar />
      <div className={classes.bribesContainer}>
        {pairs &&
          pairs &&
          pairs.length > 0 &&
          pairs.map((pair) => {
            return pair.gauge.bribes.map((bribe, index) => {
              return <BribeCard key={index} pair={pair} bribe={bribe} />
            })
          })}
      </div>
    </div>
  )
}
