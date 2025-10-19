

export interface GhostSignal {
  id: string
  x: number

  y: number
  vx: number
  vy: number  

  color: string
  age: number

  maxAge: number
  message: string  
  captured: boolean
}


export const createGhostSignal = (gridSize: number): GhostSignal => {

  const messages = [
    "signal from nowhere",
    "timestamp error: 2124",

    "frequency detected",
    "old transmission found",
    "echo from the void",

    "unauthorized broadcast",
    "signal degraded 67%",
    "origin: unknown sector",

    "looping since 2089",
    "corrupted data packet",

    "ghost in the machine",
    "temporal anomaly detected"
  ]

  const colors = ['#00ffff', '#00ff88', '#0088ff', '#ff00ff', '#ffff00']

  return {
    id: `ghost_${Date.now()}_${Math.random()}`,

    x: Math.random() * gridSize,
    y: Math.random() * gridSize,

    vx: (Math.random() - 0.5) * 0.4,  
    vy: (Math.random() - 0.5) * 0.4,

    color: colors[Math.floor(Math.random() * colors.length)],  
    age: 0,

    maxAge: 500 + Math.random() * 300,  
    message: messages[Math.floor(Math.random() * messages.length)],
    captured: false
  }
}



export const updateGhosts = (

  ghosts: GhostSignal[],
  gridSize: number
): GhostSignal[] => {

  const activeGhosts: GhostSignal[] = []


  ghosts.forEach(ghost => {
    if (ghost.captured) return  // skip captured ghosts


    ghost.age++
    
    // add slight drift variation (not perfectly smooth)
    const drift = Math.sin(ghost.age * 0.02) * 0.015
    ghost.x += ghost.vx + drift
    ghost.y += ghost.vy - drift * 0.7


    // bounce off edges with slight randomness
    if (ghost.x < 0 || ghost.x > gridSize) {
      ghost.vx *= -(0.95 + Math.random() * 0.1)
      ghost.x = Math.max(0, Math.min(gridSize, ghost.x))
    }
    if (ghost.y < 0 || ghost.y > gridSize) {
      ghost.vy *= -(0.95 + Math.random() * 0.1)
      ghost.y = Math.max(0, Math.min(gridSize, ghost.y))
    }


    // keep if still alive
    if (ghost.age < ghost.maxAge) {
      activeGhosts.push(ghost)
    }
  })


  return activeGhosts
}



// render ghosts on canvas



export const renderGhosts = (
  ctx: CanvasRenderingContext2D,
  ghosts: GhostSignal[],
  cellSize: number
) => {
  ghosts.forEach(ghost => {
    if (ghost.captured) return


    const centerX = ghost.x * cellSize
    const centerY = ghost.y * cellSize


   
    // irregular pulsing with jitter
    const pulse = Math.sin(ghost.age * 0.087) * 0.3 + 0.7
    const jitter = Math.sin(ghost.age * 0.31) * 0.08
    const size = (6 + jitter) * pulse


    ctx.globalAlpha = (0.3 + Math.random() * 0.05) * pulse
    ctx.fillStyle = ghost.color
    ctx.beginPath()
    ctx.arc(centerX, centerY, size * 2, 0, Math.PI * 2)
    ctx.fill()


    
    ctx.globalAlpha = 0.8 + Math.random() * 0.1
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX, centerY, size * 0.5, 0, Math.PI * 2)
    ctx.fill()


    // question mark with slight wobble
    const wobbleX = Math.sin(ghost.age * 0.13) * 0.5
    const wobbleY = Math.cos(ghost.age * 0.19) * 0.4
    ctx.globalAlpha = 0.6 + Math.random() * 0.15
    ctx.fillStyle = ghost.color
    ctx.font = '8px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('?', centerX + wobbleX, centerY - 10 + wobbleY)
  })


  ctx.globalAlpha = 1.0
}



// check if click is near a ghost
export const checkGhostCapture = (
  ghosts: GhostSignal[],
  clickX: number,
  clickY: number,
  cellSize: number,
  captureRadius: number = 2
): GhostSignal | null => {
  for (const ghost of ghosts) {
    if (ghost.captured) continue


    const ghostScreenX = ghost.x * cellSize
    const ghostScreenY = ghost.y * cellSize


    const dist = Math.sqrt(
      Math.pow(clickX - ghostScreenX, 2) +
      Math.pow(clickY - ghostScreenY, 2)
    )


    if (dist < captureRadius * cellSize) {
      return ghost
    }
  }


  return null
}