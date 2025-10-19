// ghost trail markers that fade out over time
// shows where user clicked

 export interface SignalTrail {
  x: number
  y: number
  age: number
  maxAge: number
  color: string
  opacity: number
}


export const createTrail = (
  x: number,
  y: number,
  color: string
): SignalTrail => {
  return {
    x,
    y,
    age: 0,
    maxAge: 180,  // ~3sec at 60fps
    color,
    opacity: 0.4
  }
}


export const updateTrails = (trails: SignalTrail[]): SignalTrail[] => {
  const activeTrails: SignalTrail[] = []

  trails.forEach(trail => {
    trail.age++

    const lifetimePercent = trail.age / trail.maxAge
    trail.opacity = 0.4 * (1 - lifetimePercent)

    if (trail.age < trail.maxAge) {
      activeTrails.push(trail)
    }
  })

  return activeTrails
}



export const renderTrails = (
  ctx: CanvasRenderingContext2D,
  trails: SignalTrail[],
  cellSize: number
) => {
  trails.forEach(trail => {
    ctx.strokeStyle = trail.color
    ctx.globalAlpha = trail.opacity
    ctx.lineWidth = 1

    const centerX = trail.x * cellSize + cellSize / 2
    const centerY = trail.y * cellSize + cellSize / 2
    const size = 4

    // cross marker
    ctx.beginPath()
    ctx.moveTo(centerX - size, centerY)
    ctx.lineTo(centerX + size, centerY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY - size)
    ctx.lineTo(centerX, centerY + size)
    ctx.stroke()

    // flicker circle
    if (trail.age % 3 === 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
      ctx.stroke()
    }
  })

  ctx.globalAlpha = 1.0
}

