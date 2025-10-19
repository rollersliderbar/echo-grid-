

export interface GhostSignal {
  id: string
  x: number
  y: number
  vx: number  // velocity x
  vy: number  
  color: string
  age: number
  maxAge: number
  message: string  
  captured: boolean
}



// spawn a ghost signal at random position




export const createGhostSignal = (gridSize: number): GhostSignal => {
  const messages = [
    "signal intercepted... decoding...",
    "transmission from 2124...",
    "do you hear the frequency?",
    "this echo traveled far...",
    "someone left this here long ago..."
  ]


  return {
    id: `ghost_${Date.now()}_${Math.random()}`,
    x: Math.random() * gridSize,
    y: Math.random() * gridSize,
    vx: (Math.random() - 0.5) * 0.3,  
    vy: (Math.random() - 0.5) * 0.3,
    color: '#00ffff',  
    age: 0,
    maxAge: 600,  
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
    ghost.x += ghost.vx
    ghost.y += ghost.vy


    // bounce off edges
    if (ghost.x < 0 || ghost.x > gridSize) {
      ghost.vx *= -1
      ghost.x = Math.max(0, Math.min(gridSize, ghost.x))
    }
    if (ghost.y < 0 || ghost.y > gridSize) {
      ghost.vy *= -1
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


   
    const pulse = Math.sin(ghost.age * 0.1) * 0.3 + 0.7
    const size = 6 * pulse


    ctx.globalAlpha = 0.3 * pulse
    ctx.fillStyle = ghost.color
    ctx.beginPath()
    ctx.arc(centerX, centerY, size * 2, 0, Math.PI * 2)
    ctx.fill()


    
    ctx.globalAlpha = 0.8
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX, centerY, size * 0.5, 0, Math.PI * 2)
    ctx.fill()


    // question mark indicator
    ctx.globalAlpha = 0.6
    ctx.fillStyle = ghost.color
    ctx.font = '8px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('?', centerX, centerY - 10)
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