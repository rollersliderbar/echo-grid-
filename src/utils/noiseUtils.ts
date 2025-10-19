import type { GridCell } from './gridUtils'
import { updateCellColor } from './gridUtils'

// adds random 



export const applyNoise = (
  grid: GridCell[][],



  gridSize: number,
  noiseDensity: number = 0.008,


  noiseIntensity: number = 0.15

): GridCell[][] => {
  const newGrid = grid.map(row => row.map(cell => ({...cell})))

  const cellCount = gridSize * gridSize

  const noisyCells = Math.floor(cellCount * noiseDensity)

  for (let i = 0; i < noisyCells; i++) {
    const x = Math.floor(Math.random() * gridSize)

    const y = Math.floor(Math.random() * gridSize)

    const cell = newGrid[y][x]



    // only add noise to low-intensity cells
    if (cell.intensity < 0.3) {
      const boost = Math.random() * noiseIntensity
      cell.intensity = Math.min(1, cell.intensity + boost)

      updateCellColor(cell)
    }
  }

  return newGrid

}


// generater not used atm
export const generateStaticPattern = (

  grid: GridCell[][],
  gridSize: number
): GridCell[][] => {
  const newGrid = grid.map(row => row.map(cell => ({...cell})))


  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (Math.random() < 0.05) {
        const cell = newGrid[y][x]


        if (cell.intensity < 0.2) {
          cell.intensity = Math.random() * 0.08
          updateCellColor(cell)
        }
      }

    }
  }

  return newGrid
}

