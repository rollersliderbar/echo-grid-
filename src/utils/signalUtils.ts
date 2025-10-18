import type { GridCell } from './gridUtils'
import { updateCellColor } from './gridUtils'
import type { SignalColor } from './colorUtils'
import { getColorRGB, addColors } from './colorUtils'




export const emitSignalBurst = (
  grid: GridCell[][],
  gridX: number,
  gridY: number,
  radius: number,
  gridSize: number,
  colorType: SignalColor = 'green'
): GridCell[][] => {



  if (gridX < 0 || gridX >= gridSize || gridY < 0 || gridY >= gridSize) {
    return grid
  }




  const newGrid = grid.map(row => row.map(cell => ({...cell})))
  const [baseR, baseG, baseB] = getColorRGB(colorType)





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
          
          
          const colorBoost = intensityBoost * 0.9
          const [newR, newG, newB] = addColors(
            targetCell.r, targetCell.g, targetCell.b,
            baseR * colorBoost, baseG * colorBoost, baseB * colorBoost
          )
          
          targetCell.r = newR
          targetCell.g = newG
          targetCell.b = newB
          
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
      
      const decayFactor = newIntensity > 0 ? (newIntensity / cell.intensity) : 0
      
      return {
        ...cell,
        intensity: newIntensity,
        r: cell.r * decayFactor,
        g: cell.g * decayFactor,
        b: cell.b * decayFactor,
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