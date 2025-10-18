

import {useState, useEffect, useRef } from 'react'
import './App.css'
import { initGrid } from './utils/gridUtils'
import type { GridCell } from './utils/gridUtils'
import { emitSignalBurst, decaySignals } from './utils/signalUtils'
import { createRipple, updateRipples } from './utils/rippleUtils'
import type { Ripple } from './utils/rippleUtils'


const GRID_SIZE = 32
const CELL_SIZE = 10  
const BURST_RADIUS = 3
const DECAY_RATE = 0.015  
const DECAY_INTERVAL = 50   
const MAX_INTENSITY = 1.0  
const RIPPLE_INTERVAL = 60  


function App( ) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridData, setGridData] = useState<GridCell[][]>([])
  const [signalCount, setSignalCount] = useState(0)
  const [ripples, setRipples] = useState<Ripple[]>([])


  useEffect(() => {
    const newGrid = initGrid(GRID_SIZE)
    setGridData(newGrid)
    console.log('grid initialized')
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      if (ripples.length > 0) {
        const result = updateRipples(ripples, gridData, GRID_SIZE)
        setRipples(result.ripples)
        setGridData(result.grid)
      }
    }, RIPPLE_INTERVAL)

    return () => clearInterval(interval)
  }, [ripples, gridData])



  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(prevGrid => {

        const hasSignal = prevGrid.some(row => 
          row.some(cell => cell.intensity > 0)
        )
        
        if (!hasSignal) return prevGrid  
        
        return decaySignals(prevGrid, DECAY_RATE)
      })
    }, DECAY_INTERVAL)
    return () => clearInterval(interval)






  }, [])


  const emitSignal = (clickX: number, clickY: number) => {
    const gridX = Math.floor(clickX / CELL_SIZE)
    const gridY = Math.floor(clickY / CELL_SIZE)
    console.log(`signal burst at ${gridX}, ${gridY}`)

    const newGrid = emitSignalBurst(gridData, gridX, gridY, BURST_RADIUS, GRID_SIZE)
    setGridData(newGrid)
    setSignalCount(signalCount + 1)


    const newRipple = createRipple(gridX, gridY)
    setRipples([...ripples, newRipple])
  }



  useEffect(() => {
    const canvas = canvasRef.current
    if  (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return


    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    gridData.forEach(row => {
      row.forEach(cell => {
        ctx.fillStyle = cell.color
        ctx.fillRect(
          cell.x * CELL_SIZE, 
          cell.y * CELL_SIZE, 
          CELL_SIZE - 1,  
          CELL_SIZE - 1
        )
      })
    })
  }, [gridData])

  return  (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        onClick={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (rect) {
            const clickX = e.clientX - rect.left
            const clickY = e.clientY - rect.top
            emitSignal(clickX, clickY)
          }
        }}
      />
      
      <div className="debug-overlay">
        <p>echogrid v0.3</p>
        <p>signals: {signalCount}</p>
        <p>ripples: {ripples.length}</p>
        <p style={{fontSize: '9px', opacity: 0.5}}>
          decay: {DECAY_RATE}
        </p>
      </div>
    </div>
  )
}

export default  App

