



import type { GridCell } from './gridUtils'
import { updateCellColor } from './gridUtils'




export const emitSignalBurst = (
  grid: GridCell[][],
  gridX: number,
  gridY: number,
  radius: number,
  gridSize: number
): GridCell[][] => {

  if (gridX < 0 || gridX >= gridSize || gridY < 0 || gridY >= gridSize) {
    return grid
  }



  const newGrid = grid.map(row => row.map(cell => ({...cell})))




  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist <= radius) {
        const targetX = gridX + dx
        const targetY = gridY + dy
        

        if (targetX >= 0 && targetX < gridSize && 
            targetY >= 0 && targetY < gridSize) {
          const targetCell = newGrid[targetY][targetX]
          

          const intensityBoost = 1 - (dist / radius)
          targetCell.intensity = Math.min(1, targetCell.intensity + intensityBoost)
          
          updateCellColor(targetCell)
        }
      }
    }
  }



  return newGrid
}








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




  newGrid.forEach(row => {
    row.forEach(cell => {
      updateCellColor(cell)
    })
  })



  return newGrid
 
}