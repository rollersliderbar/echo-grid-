// FEATURE: Base Grid Canvas + Click to Emit Signals
// renders a grid of cells that will hold signal echoes
// full screen, dark, signal vibes
// NOW WITH: click anywhere to emit signal bursts 


import  { useEffect, useRef, useState } from 'react'
import './App.css'



const GRID_SIZE = 40  
const CELL_SIZE = 15
const BURST_RADIUS = 3  // how far signal spreads
// const BURST_INTENSITY = 0.9  // unused rn   

 



interface GridCell {
  x: number
  y: number
  intensity: number  
  color: string
}



function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridData, setGridData] = useState<GridCell[][]>([])
  const  [signalCount, setSignalCount]  = useState(0)


  // init grid on mount
  useEffect(() => {
    console.log("DEBUG: initializing grid chaos")
    
    const grid: GridCell[][] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      grid[row] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        grid[row][col] = {
          x: col,
          y: row,
          intensity: 0,
          color: '#0a0a0a'   
        }
      }
    }
    
    setGridData(grid)
    
  }, [])


  
  // emit signal burst at grid position
  const emitSignal = (gridX: number,  gridY: number) => {
    console.log(`DEBUG: signal emitted at ${gridX},${gridY}`)
    
    setSignalCount(prev => prev + 1)

    const newGrid = gridData.map(row => row.map(cell => ({...cell})))
    
    // burst pattern - center + radius
    for (let dy = -BURST_RADIUS; dy <= BURST_RADIUS; dy++) {
      for (let dx = -BURST_RADIUS; dx <= BURST_RADIUS; dx++) {
        const targetY = gridY + dy
        const targetX = gridX + dx
        
        // bounds check
        if (targetY < 0 || targetY >= GRID_SIZE || 
            targetX < 0 || targetX >= GRID_SIZE) continue
        
        // distance from epicenter
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist > BURST_RADIUS) continue
        
        // intensity falls off with distance
        const intensity = Math.max(0, 1 - (dist / BURST_RADIUS))
        
        newGrid[targetY][targetX].intensity = Math.min(1, 
          newGrid[targetY][targetX].intensity + intensity)
        
        // color based on intensity 
        const i = newGrid[targetY][targetX].intensity
        if (i > 0.7) {
          newGrid[targetY][targetX].color = '#00ff88'  // bright signal
        } else if (i > 0.4) {
          newGrid[targetY][targetX].color = '#00aa55'
        } else if (i > 0.1) {
          newGrid[targetY][targetX].color = '#005522'
        } else {
          newGrid[targetY][targetX].color = '#0a0a0a'  // dark
        }
      }
    }
    
    setGridData(newGrid)
    // TODO: add sound effect??
  }


  // handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // convert to grid coords
    const gridX = Math.floor(x / CELL_SIZE)
    const gridY = Math.floor(y / CELL_SIZE)
    
    if (gridX >= 0 && gridX < GRID_SIZE && 
        gridY >= 0 && gridY < GRID_SIZE) {
      emitSignal(gridX, gridY)
    }
    // FIXME: clicks near edge sometimes weird??
  }



  // render grid to canvas
  useEffect(() => {
    if (!canvasRef.current || gridData.length === 0) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return


    // clear 
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    // draw each cell
    gridData.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        ctx.fillStyle = cell.color
        ctx.fillRect(
          colIdx * CELL_SIZE, 
          rowIdx * CELL_SIZE,
          CELL_SIZE - 1,  
          CELL_SIZE - 1
        )
      })
    })


    console.log("grid painted")  
  }, [gridData])



  return (
    <div className="app-container">
      <canvas 
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="signal-canvas"
        onClick={handleCanvasClick}
      />
      
      <div className="debug-overlay">
        <p>echogrid online</p>
        <p>cells: {GRID_SIZE}x{GRID_SIZE}</p>
        <p>signals: {signalCount}</p>
      </div>
    </div>
  )
}


export default App



/*
COMMIT:
feat: add click-to-emit signal bursts

- click anywhere on grid to emit signal
- burst pattern radiates from click point
- intensity falls off with distance from epicenter  
- dynamic color gradient (dark -> bright green)
- signal counter in debug overlay
- radius of 3 cells, additive intensity

README UPDATE:
## features (so far)
- ✅ Base grid canvas (40x40 cells)
- ✅ Dark signal aesthetic  
- ✅ Click to emit signal bursts
- ✅ Radial burst pattern with falloff
- ✅ Dynamic color based on intensity
*/