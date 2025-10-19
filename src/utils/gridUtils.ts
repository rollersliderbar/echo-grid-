// FEATURE: signal trail / ghost echo history
// shows where signals were emitted with fading markers
// adds visual density + memory of activity




export interface SignalTrail {
  x: number
  y: number
  age: number
  maxAge: number
  color: string
  opacity: number
}





// spawn a trail marker at click position
export const createTrail = (
  x: number, 
  y: number,
  color: string
): SignalTrail => {
  return {
    x,
    y,
    age: 0,
    maxAge: 180,  // lives for ~3 seconds at 60fps
    color,
    opacity: 0.4
  }
}






// update all trails, fade them out
export const updateTrails = (trails: SignalTrail[]): SignalTrail[] => {
  const activeTrails: SignalTrail[] = []
  
  trails.forEach(trail => {
    trail.age++
    
    // fade out over lifetime
    const lifetimePercent = trail.age / trail.maxAge
    trail.opacity = 0.4 * (1 - lifetimePercent)
    
    // keep if still visible
    if (trail.age < trail.maxAge) {
      activeTrails.push(trail)
    }
  })
  
  return activeTrails
}






// draw trails onto canvas
export const renderTrails = (
  ctx: CanvasRenderingContext2D,
  trails: SignalTrail[],
  cellSize: number
) => {
  trails.forEach(trail => {
    // draw a small cross marker
    ctx.strokeStyle = trail.color
    ctx.globalAlpha = trail.opacity
    ctx.lineWidth = 1
    
    const centerX = trail.x * cellSize + cellSize / 2
    const centerY = trail.y * cellSize + cellSize / 2
    const size = 4
    
    // cross shape
    ctx.beginPath()
    ctx.moveTo(centerX - size, centerY)
    ctx.lineTo(centerX + size, centerY)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - size)
    ctx.lineTo(centerX, centerY + size)
    ctx.stroke()
    
    // optional: small circle in center for extra glitch
    if (trail.age % 3 === 0) {  // flickers
      ctx.beginPath()
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
      ctx.stroke()
    }
  })
  
  ctx.globalAlpha = 1.0  // reset
}