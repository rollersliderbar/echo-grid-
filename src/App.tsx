import {useState,useEffect, useRef } from 'react'
import './App.css'
import { initGrid } from './utils/gridUtils'
import type { GridCell } from './utils/gridUtils'
import { emitSignalBurst, decaySignals} from './utils/signalUtils'
import { createRipple,updateRipples } from './utils/rippleUtils'
import type { Ripple } from './utils/rippleUtils'
import { applyNoise } from './utils/noiseUtils'
import type { SignalColor } from './utils/colorUtils'
import type { BurstPattern } from './utils/patternUtils'
import { createTrail, updateTrails,renderTrails } from './utils/trailUtils'
import type { SignalTrail } from './utils/trailUtils'
import { createGhostSignal, updateGhosts, renderGhosts, checkGhostCapture } from './utils/ghostUtils'
import type { GhostSignal } from './utils/ghostUtils'

const GRID_SIZE = 32
const CELL_SIZE = 10
const BURST_RADIUS = 3
const DECAY_RATE = 0.015
const DECAY_INTERVAL = 50
const MAX_INTENSITY = 1.0
const RIPPLE_INTERVAL = 60
const NOISE_INTERVAL = 120



// const NOISE_INTERVAL = 80  








function App( ) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridData, setGridData] = useState<GridCell[][]>([])
  const [signalCount, setSignalCount] = useState(0)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [noiseEnabled, setNoiseEnabled] = useState(true)
  const [currentColor, setCurrentColor] = useState<SignalColor>('green')
  const [currentPattern, setCurrentPattern] = useState<BurstPattern>('radial')
  const [trails, setTrails] = useState<SignalTrail[]>([])
  const [ghosts, setGhosts] = useState<GhostSignal[]>([])
  // const [globalIntensity, setGlobalIntensity] = useState(1.0) 





  useEffect(() => {
    const newGrid = initGrid(GRID_SIZE)
    setGridData(newGrid)
    console.log('grid init')





    // spawn 
    
    const initialGhosts = [







      createGhostSignal(GRID_SIZE),
      createGhostSignal(GRID_SIZE)
    ]
    setGhosts(initialGhosts)
  }, [])




  useEffect(() => {




    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        setNoiseEnabled(prev => !prev)
        console.log(`noise ${!noiseEnabled ? 'on' : 'off'}`)
      }






      // color switching 





      if (e.key === '1') {
        setCurrentColor('green')
        console.log('color: green')
      }
      if (e.key === '2') {
        setCurrentColor('red')
      }
      if (e.key === '3') {
        setCurrentColor('blue')
      }
      if (e.key === '4') {
        setCurrentColor('cyan')
      }
      if (e.key === '5') {
        setCurrentColor('magenta')
      }
      if (e.key === '6') {
        setCurrentColor('yellow')
      }





      
      

      if (e.key === 'q' || e.key === 'Q') {
        setCurrentPattern('radial')
      }
      if (e.key === 'w' || e.key === 'W') {
        setCurrentPattern('square')
      }
      if (e.key === 'e' || e.key === 'E') {
        setCurrentPattern('cross')
      }
      if (e.key === 'r' || e.key === 'R') {
        setCurrentPattern('spiral')
      }
      if (e.key === 't' || e.key === 'T') {
        setCurrentPattern('random')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [noiseEnabled])



  //have to verify this layet on tho


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



  useEffect(() => {
    const interval = setInterval(() => {
      if (trails.length > 0) {
        setTrails(prevTrails => updateTrails(prevTrails))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [trails])


 
  useEffect(() => {
    const interval = setInterval(() => {
      setGhosts(prevGhosts => {
        const updated = updateGhosts(prevGhosts, GRID_SIZE)
        







        // spawn new ghost occasionally if count is low



        if (updated.length < 3 && Math.random() < 0.05) {
          updated.push(createGhostSignal(GRID_SIZE))
          console.log('>> ghost signal spawned')
        }
        
        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])



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

    // check if clicking on a ghost signal




    const capturedGhost = checkGhostCapture(ghosts, clickX, clickY, CELL_SIZE)
    if (capturedGhost) {
      console.log('>> ghost captured!')
      capturedGhost.captured = true
      setGhosts([...ghosts])
      //show decode UI
      return
    }






    const gridX = Math.floor(clickX / CELL_SIZE)
    const gridY = Math.floor(clickY / CELL_SIZE)
    console.log(`>> burst at ${gridX},${gridY}`)

    const newGrid = emitSignalBurst(gridData, gridX, gridY, BURST_RADIUS, GRID_SIZE, currentColor, currentPattern)
    setGridData(newGrid)
    setSignalCount(signalCount + 1)

    // spawn ripple 


    const newRipple = createRipple(gridX, gridY, currentColor)
    setRipples([...ripples, newRipple])

    const newTrail = createTrail(gridX, gridY, currentColor)
    setTrails([...trails, newTrail])
    
    \



  }


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return







    // clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw grid cells
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

    // draw trails on top

    renderTrails(ctx, trails, CELL_SIZE)

    // draw ghost signals


    renderGhosts(ctx, ghosts, CELL_SIZE)
  }, [gridData, trails, ghosts])










  return (
    <div className="App">
      {/* top bar */}
      <div className="top-bar">
        <h1 className="title">ECHOGRID</h1>
        <p className="subtitle">collective signal space</p>
      </div>








      {/* main grid canvas */}
      <div className="canvas-container">
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
      </div>









      {/* bottom */}




      <div className="bottom-hud">
        <div className="hud-section">
          <button 
            className="emit-btn"
            onClick={() => {





              // emit at random position
              const randX = Math.random() * GRID_SIZE * CELL_SIZE
              const randY = Math.random() * GRID_SIZE * CELL_SIZE
              emitSignal(randX, randY)
            }}
          >
            emit signal
          </button>
          




          <button 
            className="clear-btn"
            onClick={() => {
              setGridData(initGrid(GRID_SIZE))
              setRipples([])
              setTrails([])
              setSignalCount(0)
              console.log('grid cleared')
            }}
          >
            clear grid
          </button>






          
         
        </div>

        <div className="hud-stats">
          <div className="stat">
            <span className="stat-label">signals</span>
            <span className="stat-value">{signalCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">noise</span>
            <span className="stat-value">{noiseEnabled ? 'ON' : 'OFF'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">ripples</span>
            <span className="stat-value">{ripples.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">color</span>
            <span className="stat-value" style={{color: currentColor}}>{currentColor}</span>
          </div>
          <div className="stat">
            <span className="stat-label">ghosts</span>
            <span className="stat-value" style={{color: '#00ffff'}}>{ghosts.filter(g => !g.captured).length}</span>
          </div>
        </div>

        <div className="hud-controls">
          <p>[1-6] colors  [qwert] patterns  [n] noise</p>
        </div>
      </div>
    </div>
  )
}

export default App


