

export interface GridCell {
  x: number
  y: number
  intensity: number
  color: string
  r: number
  g: number
  b: number
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
        color: '#0a0a0a',
        r: 10,
        g: 10,
        b: 10
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



export const rgbToHex = (r: number, g: number, b: number): string => {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.floor(val)))
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}



export const updateCellColor = (cell: GridCell): void => {
  cell.color = rgbToHex(cell.r, cell.g, cell.b)
}
