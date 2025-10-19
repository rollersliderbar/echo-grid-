


// color system for signals

export type SignalColor = 'green' | 'red' | 'blue' | 'cyan' | 'magenta' | 'yellow'

export const getColorRGB = (colorType: SignalColor): [number, number, number] => {
  switch (colorType) {
    case 'green':
      return [0, 255, 136]
    case 'red':
      return [255, 50, 80]
    case 'blue':
      return [50, 120, 255]
    case 'cyan':
      return [0, 255, 255]
    case 'magenta':
      return [255, 0, 255]
    case 'yellow':
      
      return [255, 255, 0]
    default:
      return [0, 255, 136] 




  }
}


export const mixColors = (
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  weight: number = 0.5
): [number, number, number] => {
  return [
    r1 * (1 - weight) + r2 * weight,
    g1 * (1 - weight) + g2 * weight,
    b1 * (1 - weight) + b2 * weight
  ]
}


export const addColors = (
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): [number, number, number] => {
  return [
    Math.min(255, r1 + r2),
    Math.min(255, g1 + g2),
    Math.min(255, b1 + b2)
  ]
}
