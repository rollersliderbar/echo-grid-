


import type { GridCell } from './gridUtils'
import { updateCellColor } from './gridUtils'


export interface Ripple {
  x: number
  y: number
  currentRadius: number
  maxRadius: number
  intensity: number
  age: number
}



export const createRipple = (x: number, y: number): Ripple => {
  return {
    x,
    y,
    currentRadius: 0,
    maxRadius: 8,
    intensity: 0.6,
    age: 0
  }
}




export const updateRipples = (
  ripples: Ripple[],
  grid: GridCell[][],
  gridSize: number
): { ripples: Ripple[], grid: GridCell[][] } => {
  const newGrid = grid.map(row => row.map(cell => ({...cell})))
  const activeRipples: Ripple[] = []

  ripples.forEach(ripple => {
    ripple.age++
    ripple.currentRadius += 0.4


    if (ripple.currentRadius < ripple.maxRadius) {
      activeRipples.push(ripple)


      const minR = Math.max(0, ripple.currentRadius - 0.8)
      const maxR = ripple.currentRadius

      for (let dy = -Math.ceil(maxR); dy <= Math.ceil(maxR); dy++) {
        for (let dx = -Math.ceil(maxR); dx <= Math.ceil(maxR); dx++) {
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist >= minR && dist <= maxR) {
            const targetX = ripple.x + dx
            const targetY = ripple.y + dy
            
            if (targetX >= 0 && targetX < gridSize && 
                targetY >= 0 && targetY < gridSize) {
              const cell = newGrid[targetY][targetX]


              const fadeout = 1 - (ripple.currentRadius / ripple.maxRadius)
              const boost = ripple.intensity * fadeout * 0.3
              
              cell.intensity = Math.min(1, cell.intensity + boost)
              updateCellColor(cell)
            }
          }
        }
      }
    }
  })

  return { ripples: activeRipples, grid: newGrid }
}
