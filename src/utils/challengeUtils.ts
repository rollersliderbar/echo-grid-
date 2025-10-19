

export interface Challenge {
  id: number
  name: string
  description: string
  targetPattern: number[][]
  colorKey: string[]
  completed: boolean
  reward: string
}


export const challenges: Challenge[] = [
  {
    id: 1,
    name: "cross signal",
    description: "make a cross pattern with green (press 1 then q for cross pattern)",
    targetPattern: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ],
    colorKey: ['green'],
    completed: false,
    reward: "nice u got rapid fire mode"
  },
  {
    id: 2,
    name: "dual resonance", 
    description: "put 2 cyan bursts in opposite corners (4 for cyan)",
    targetPattern: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1]
    ],
    colorKey: ['cyan'],
    completed: false,
    reward: "yo u got ghost signal magnet"
  },
  {
    id: 3,
    name: "chromatic spiral",
    description: "follow the spiral with different colors idk just try stuff",
    targetPattern: [
      [1, 1, 1, 1, 2],
      [1, 0, 0, 0, 2],
      [1, 0, 3, 3, 2],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1]
    ],
    colorKey: ['green', 'red', 'blue', 'cyan'],
    completed: false,
    reward: "bruh u unlocked time echo"
  }
]



// checks if grid matches challenge pattern

export const checkPattern = (
  gridData: any[][],
  challenge: Challenge,
  gridSize: number
): boolean => {
  const startX = Math.floor((gridSize - 5) / 2)
  const startY = Math.floor((gridSize - 5) / 2)

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const gridX = startX + x
      const gridY = startY + y
      
      if (gridX >= gridSize || gridY >= gridSize) continue
      
      const cell = gridData[gridY][gridX]
      const targetValue = challenge.targetPattern[y][x]
      
      if (targetValue > 0 && cell.intensity < 0.3) {
        return false
      }
      if (targetValue === 0 && cell.intensity > 0.1) {
        return false  
      }
    }
  }
  
  return true
}
