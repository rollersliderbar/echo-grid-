

import {useState, useEffect, useRef } from 'react'
import './App.css'
import { initGrid } from './utils/gridUtils'
import type { GridCell } from './utils/gridUtils'
import { emitSignalBurst, decaySignals } from './utils/signalUtils'
import { createRipple, updateRipples } from './utils/rippleUtils'
import type { Ripple } from './utils/rippleUtils'
import { applyNoise } from './utils/noiseUtils'
import type { SignalColor } from './utils/colorUtils'
import type { BurstPattern } from './utils/patternUtils'
import { createTrail, updateTrails, renderTrails } from './utils/trailUtils'
import type { SignalTrail } from './utils/trailUtils'


const GRID_SIZE = 32
const CELL_SIZE = 10  
const BURST_RADIUS = 3
const DECAY_RATE = 0.015  
const DECAY_INTERVAL = 50   
const MAX_INTENSITY = 1.0  
const RIPPLE_INTERVAL = 60  
const NOISE_INTERVAL = 120  


function App( ) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridData, setGridData] = useState<GridCell[][]>([])
  const [signalCount, setSignalCount] = useState(0)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [noiseEnabled, setNoiseEnabled] = useState(true)
  const [currentColor, setCurrentColor] = useState<SignalColor>('green')
  const [currentPattern, setCurrentPattern] = useState<BurstPattern>('radial')
  const [trails, setTrails] = useState<SignalTrail[]>([])  // ghost echoes


  useEffect(() => {
    const newGrid = initGrid(GRID_SIZE)
    setGridData(newGrid)
    console.log('grid initialized')
  }, [])


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        setNoiseEnabled(prev => !prev)
        console.log(`noise ${!noiseEnabled ? 'on' : 'off'}`)
      }
      
      if (e.key === '1') {
        setCurrentColor('green')
        console.log('color: green')
      }
      if (e.key === '2') {
        setCurrentColor('red')
        console.log('color: red')
      }
      if (e.key === '3') {
        setCurrentColor('blue')
        console.log('color: blue')
      }
      if (e.key === '4') {
        setCurrentColor('cyan')
        console.log('color: cyan')
      }
      if (e.key === '5') {
        setCurrentColor('magenta')
        console.log('color: magenta')
      }
      if (e.key === '6') {
        setCurrentColor('yellow')
        console.log('color: yellow')
      }
      
      if (e.key === 'q' || e.key === 'Q') {
        setCurrentPattern('radial')
        console.log('pattern: radial')
      }
      if (e.key === 'w' || e.key === 'W') {
        setCurrentPattern('square')
        console.log('pattern: square')
      }
      if (e.key === 'e' || e.key === 'E') {
        setCurrentPattern('cross')
        console.log('pattern: cross')
      }
      if (e.key === 'r' || e.key === 'R') {
        setCurrentPattern('spiral')
        console.log('pattern: spiral')
      }
      if (e.key === 't' || e.key === 'T') {
        setCurrentPattern('random')
        console.log('pattern: random')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [noiseEnabled])
 


  useEffect(() => {
    const interval = setInterval(() => {
      if (noiseEnabled) {
        setGridData(prevGrid => applyNoise(prevGrid, GRID_SIZE))
      }
    }, NOISE_INTERVAL)

    return () => clearInterval(interval)
  }, [noiseEnabled])



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


  
  // trail updater — fades out ghost markers
  useEffect(() => {
    const interval = setInterval(() => {
      if (trails.length > 0) {
        setTrails(prevTrails => updateTrails(prevTrails))
      }
    }, 50)  // update every 50ms
    
    return () => clearInterval(interval)
  }, [trails])



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

    const newGrid = emitSignalBurst(gridData, gridX, gridY, BURST_RADIUS, GRID_SIZE, currentColor, currentPattern)
    setGridData(newGrid)
    setSignalCount(signalCount + 1)


    const newRipple = createRipple(gridX, gridY, currentColor)
    setRipples([...ripples, newRipple])
    
    
    // spawn ghost trail marker
    const newTrail = createTrail(gridX, gridY, currentColor)
    setTrails([...trails, newTrail])
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
    
    
    // render ghost trails on top
    renderTrails(ctx, trails, CELL_SIZE)
  }, [gridData, trails])

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
        <p>echogrid v0.7</p>
        <p>signals: {signalCount}</p>
        <p>ripples: {ripples.length}</p>
        <p>trails: {trails.length}</p>
        <p style={{fontSize: '10px', opacity: 0.7}}>
          color: <span style={{color: currentColor}}>{currentColor}</span>
        </p>
        <p style={{fontSize: '10px', opacity: 0.7}}>
          pattern: {currentPattern}
        </p>
        <p style={{fontSize: '9px', opacity: 0.5}}>
          [1-6] colors  [qwert] patterns
        </p>
        <p style={{fontSize: '9px', opacity: 0.5}}>
          [n] noise: {noiseEnabled ? 'on' : 'off'}
        </p>
      </div>
    </div>
  )
}

export default  App

