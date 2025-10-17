// signal emission + decay logic  
// burst patterns, intensity falloff, decay over time


import type { GridCell } from './gridUtils'
import { updateCellColor } from './gridUtils'


// emit a signal burst at grid position
export const emitSignalBurst = (
  grid: GridCell[][],
  gridX: number,
  gridY: number,
  radius: number,
  gridSize: number
): GridCell[][] => {
  // bounds check
  if (gridX < 0 || gridX >= gridSize || gridY < 0 || gridY >= gridSize) {
    return grid
  }

  const newGrid = grid.map(row => row.map(cell => ({...cell})))

  // radial burst pattern
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist <= radius) {
        const targetX = gridX + dx
        const targetY = gridY + dy
        
        // bounds check
        if (targetX >= 0 && targetX < gridSize && 
            targetY >= 0 && targetY < gridSize) {
          const targetCell = newGrid[targetY][targetX]
          
          // intensity falls off with distance
          const intensityBoost = 1 - (dist / radius)
          targetCell.intensity = Math.min(1, targetCell.intensity + intensityBoost)
          
          updateCellColor(targetCell)
        }
      }
    }
  }

  return newGrid
}



// decay all signals by a small amount
// makes old signals fade out over time
export const  decaySignals = (
  grid: GridCell[][],
  decayRate: number = 0.02
): GridCell[][] => {
  const newGrid = grid.map(row => 
    row.map(cell => {
      const newIntensity = Math.max(0, cell.intensity - decayRate)
      
      return {
        ...cell,
        intensity: newIntensity,
        color: newIntensity > 0 ? cell.color : '#0a0a0a'
      }
    })
  )

  // update colors for decayed cells
  newGrid.forEach(row => {
    row.forEach(cell => {
      updateCellColor(cell)
    })
  })

  return newGrid
  // NOTE: this runs every frame so keep it fast
}
