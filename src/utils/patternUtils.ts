


// different burst patterns for signals

export type BurstPattern = 'radial' | 'square' | 'cross' | 'spiral' | 'random'

export interface PatternCell {
  dx: number
  dy: number
  intensity: number
}



export const generateRadialPattern = (radius: number): PatternCell[] => {
  const cells: PatternCell[] = []

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy)



      if (dist <= radius) {
        const intensity = 1 - (dist / radius)
        cells.push({ dx, dy, intensity })
      }
    }
  }

  return cells
}


export const generateSquarePattern = (size: number): PatternCell[] => {
  const cells: PatternCell[] = []

  const half = Math.floor(size / 2)

  for (let dy = -half; dy <= half; dy++) {



    for (let dx = -half; dx <= half; dx++) {

      const distFromCenter = Math.max(Math.abs(dx), Math.abs(dy))

      const intensity = 1 - (distFromCenter / half)

      cells.push({ dx, dy, intensity })
    }
  }

  return cells
}


export const generateCrossPattern = (length: number): PatternCell[] => {
  const cells: PatternCell[] = []

  for (let i = -length; i <= length; i++) {
    const intensity = 1 - (Math.abs(i) / length)


    cells.push({ dx: i, dy: 0, intensity })


    cells.push({ dx: 0, dy: i, intensity })
  }

  return cells
}



export const generateSpiralPattern = (radius: number): PatternCell[] => {
  const cells: PatternCell[] = []

  const numPoints = radius * 12


  for (let i = 0; i < numPoints; i++) {

    const t = i / numPoints

    const angle = t * Math.PI * 6  



    const r = t * radius

    const dx = Math.round(r * Math.cos(angle))


    const dy = Math.round(r * Math.sin(angle))

    const intensity = 1 - t

    cells.push({ dx, dy, intensity })
  }

  return cells
}




export const generateRandomPattern = (radius: number, density: number = 0.4): PatternCell[] => {
  const cells: PatternCell[] = []



  for (let dy = -radius; dy <= radius; dy++) {


    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy)
      

      if (dist <= radius && Math.random() < density) {
        const intensity = (1 - (dist / radius)) * (0.5 + Math.random() * 0.5)


        cells.push({ dx, dy, intensity })
      }
    }


  }

  return cells
}


export const getPattern = (type: BurstPattern, size: number): PatternCell[] => {
  switch (type) {


    case 'radial':
      return generateRadialPattern(size)
    case 'square':

      return generateSquarePattern(size * 2)
    case 'cross':

       return generateCrossPattern(size)

    case 'spiral':
      return generateSpiralPattern(size)
    case 'random':
      return generateRandomPattern(size, 0.5)
    default:
      
      return generateRadialPattern(size)
  }
}
