import type { GridCell } from './gridUtils'
import { updateCellColor } from './gridUtils'
import type { SignalColor } from './colorUtils'
import { getColorRGB, addColors } from './colorUtils'

// expanding ripple effect from signal bursts

export interface Ripple {
  x: number
  y: number

  currentRadius: number

  maxRadius: number

  intensity: number

  age: number
  colorType: SignalColor
}

export const createRipple = (x: number, y: number, colorType: SignalColor = 'green'): Ripple => {
  return {
    x,
    y,
    currentRadius: 0,



    maxRadius: 8,
    intensity: 0.6,
    age: 0,
    colorType
  }
}


export const updateRipples = (
  ripples: Ripple[],




  grid: GridCell[][],


  gridSize: number): { ripples: Ripple[], grid: GridCell[][] } => {



  const newGrid = grid.map(row => row.map(cell => ({...cell})))
  const activeRipples: Ripple[] = []



  ripples.forEach(ripple => {
    ripple.age++



    ripple.currentRadius += 0.4  

    if (ripple.currentRadius < ripple.maxRadius) {
      activeRipples.push(ripple)
      const minR = Math.max(0, ripple.currentRadius - 0.8)
      const maxR = ripple.currentRadius



      const [baseR, baseG, baseB] = getColorRGB(ripple.colorType)

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






              const colorBoost = boost * 0.7
              const [newR, newG, newB] = addColors(
                cell.r, cell.g, cell.b,
                baseR * colorBoost, baseG * colorBoost, baseB * colorBoost
              )

              cell.r = newR
              cell.g = newG
              
              cell.b = newB

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
