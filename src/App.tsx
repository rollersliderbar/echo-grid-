// FEATURE: Base Grid Canvas 
// renders a grid of cells that will hold signal echoes
// full screen, dark, signal vibes


import  { useEffect, useRef, useState } from 'react'
import './App.css'



const GRID_SIZE = 40  // cells per row/col
const CELL_SIZE = 15   // px



interface GridCell {
  x: number
  y: number
  intensity: number  // 0-1, for signal strength
  color: string
}



function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridData, setGridData] = useState<GridCell[][]>([])
  


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
          color: '#0a0a0a'   // default dark
        }
      }
    }
    
    setGridData(grid)
    // TODO: maybe randomize some initial noise??
  }, [])



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
          CELL_SIZE - 1,  // -1 for grid lines effect
          CELL_SIZE - 1
        )
      })
    })


    console.log("grid painted")  // idk just checking
  }, [gridData])



  return (
    <div className="app-container">
      <canvas 
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="signal-canvas"
      />
      
      <div className="debug-overlay">
        <p>echogrid online</p>
        <p>cells: {GRID_SIZE}x{GRID_SIZE}</p>
      </div>
    </div>
  )
}


export default App



/*
COMMIT:
feat: add base grid canvas rendering


- initialized vite + react + typescript project
- created main App component with canvas ref
- grid of 40x40 cells, 15px each
- dark signal aesthetic, minimal render loop
- debug overlay for sanity


README:
## EchoGrid
Real-time multiplayer signal experiment. Send echoes into a shared grid.


Setup:
npm install
npm run dev
*/