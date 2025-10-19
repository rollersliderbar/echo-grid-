

export interface GridCell {
  x: number
  y: number
  intensity: number
  r: number
  g: number
  b: number
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
        r: 0,
        g: 0,

        b: 0,
        color: '#0a0a0a'
      })
    }
    grid.push(row)
  }

  return grid
}



export const updateCellColor = (cell: GridCell): void => {
  const r = Math.floor(cell.r)
  const g = Math.floor(cell.g)

  const b = Math.floor(cell.b)
  cell.color = `rgb(${r}, ${g}, ${b})`
}

