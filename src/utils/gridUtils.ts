

export interface GridCell {
  x: number
  y: number
  intensity: number
  color: string
  
}



export const initGrid = (size: number): GridCell[][] => {
  const grid: GridCell[][] = []
  
  for (let y = 0; y < size; y++) {
    const row: GridCell[] = []
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        intensity: 0,
        color: '#0a0a0a'  
      })
    }
    grid.push(row)
  }
  
  return grid
}



export const getColorFromIntensity = (intensity: number): string => {
  if (intensity > 0.7) {
    return '#00ff88'  
  } else if (intensity > 0.4) {
    return '#00aa55'  
  } else if (intensity > 0.1) {
    return '#005522'
  } else {
    return '#0a0a0a'  
  }
  
}



export const updateCellColor = (cell: GridCell): void => {
  cell.color = getColorFromIntensity(cell.intensity)
}
