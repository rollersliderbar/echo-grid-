import {useState,useEffect, useRef } from 'react'
import './App.css'

import { initGrid } from './utils/gridUtils'
import type { GridCell } from './utils/gridUtils'

import { emitSignalBurst, decaySignals} from './utils/signalUtils'
import { createRipple,updateRipples } from './utils/rippleUtils'

import type { Ripple } from './utils/rippleUtils'
import { applyNoise } from './utils/noiseUtils'

import type { SignalColor } from './utils/colorUtils'
import type { BurstPattern } from './utils/patternUtils'

import { createTrail, updateTrails,renderTrails } from './utils/trailUtils'
import type { SignalTrail } from './utils/trailUtils'

import { createGhostSignal, updateGhosts, renderGhosts, checkGhostCapture } from './utils/ghostUtils'
import type { GhostSignal } from './utils/ghostUtils'

import { storyFragments, checkStoryUnlocks, getNewlyUnlockedStory } from './utils/storyUtils'
import type { StoryFragment } from './utils/storyUtils'

import { challenges, checkPattern } from './utils/challengeUtils'
import type { Challenge } from './utils/challengeUtils'

const GRID_SIZE = 48

const CELL_SIZE = 12
const BURST_RADIUS = 3

const DECAY_RATE = 0.015
const DECAY_INTERVAL = 50

const MAX_INTENSITY = 1.0
const RIPPLE_INTERVAL = 60

const NOISE_INTERVAL = 120









function App( ) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [gridData, setGridData] = useState<GridCell[][]>([])
  const [signalCount, setSignalCount] = useState(0)

  const [ripples, setRipples] = useState<Ripple[]>([])
  const [noiseEnabled, setNoiseEnabled] = useState(true)

  const [currentColor, setCurrentColor] = useState<SignalColor>('green')
  const [currentPattern, setCurrentPattern] = useState<BurstPattern>('radial')

  const [trails, setTrails] = useState<SignalTrail[]>([])
  const [ghosts, setGhosts] = useState<GhostSignal[]>([])

  const [capturedGhost, setCapturedGhost] = useState<GhostSignal | null>(null)
  const [decodeStep, setDecodeStep] = useState(0)

  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialStep, setTutorialStep] = useState(0)

  const [captureCount, setCaptureCount] = useState(0)
  const [storyList, setStoryList] = useState<StoryFragment[]>(storyFragments)

  const [newStory, setNewStory] = useState<StoryFragment | null>(null)
  const [showStoryModal, setShowStoryModal] = useState(false)

  const [challengeList, setChallengeList] = useState<Challenge[]>(challenges)
  const [showChallenges, setShowChallenges] = useState(false)

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)

  useEffect(() => {

    const newGrid = initGrid(GRID_SIZE)
    setGridData(newGrid)

    console.log('grid init')

    const initialGhosts = [



      createGhostSignal(GRID_SIZE),
      createGhostSignal(GRID_SIZE)
    ]
    setGhosts(initialGhosts)
  }, [])



  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        setNoiseEnabled(prev => !prev)
        console.log(`noise ${!noiseEnabled ? 'on' : 'off'}`)
      }

      if (e.key === '1') {
        setCurrentColor('green')
        console.log('color: green')
      }
      if (e.key === '2') {
        setCurrentColor('red')
      }
      if (e.key === '3') {
        setCurrentColor('blue')
      }
      if (e.key === '4') {
        setCurrentColor('cyan')
      }
      if (e.key === '5') {
        setCurrentColor('magenta')
      }
      if (e.key === '6') {
        setCurrentColor('yellow')
      }





      
      

      if (e.key === 'q' || e.key === 'Q') {
        setCurrentPattern('radial')
      }
      if (e.key === 'w' || e.key === 'W') {
        setCurrentPattern('square')
      }
      if (e.key === 'e' || e.key === 'E') {
        setCurrentPattern('cross')
      }
      if (e.key === 'r' || e.key === 'R') {
        setCurrentPattern('spiral')
      }
      if (e.key === 't' || e.key === 'T') {
        setCurrentPattern('random')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [noiseEnabled])



  //have to verify this layet on tho


  useEffect(() => {
    const interval = setInterval(() => {


      if (noiseEnabled) {
        setGridData(prevGrid => applyNoise(prevGrid, GRID_SIZE))
      }
    }, NOISE_INTERVAL)

    return () => clearInterval(interval)
  }, [noiseEnabled])


  useEffect(() => {






    const interval = setInterval(() => {
      if (ripples.length > 0) {
        const result = updateRipples(ripples, gridData, GRID_SIZE)
        setRipples(result.ripples)
        setGridData(result.grid)
      }
    }, RIPPLE_INTERVAL)

    return () => clearInterval(interval)
  }, [ripples, gridData])



  useEffect(() => {
    const interval = setInterval(() => {
      if (trails.length > 0) {
        setTrails(prevTrails => updateTrails(prevTrails))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [trails])


 
  useEffect(() => {
    const interval = setInterval(() => {
      setGhosts(prevGhosts => {
        const updated = updateGhosts(prevGhosts, GRID_SIZE)
        







        // spawn new ghost occasionally if count is low



        if (updated.length < 3 && Math.random() < 0.05) {
          updated.push(createGhostSignal(GRID_SIZE))
          console.log('>> ghost signal spawned')
        }
        
        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])



  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(prevGrid => {
        const hasSignal = prevGrid.some(row =>
          row.some(cell => cell.intensity > 0)
        )

        if (!hasSignal) return prevGrid  // nothing to decay

        return decaySignals(prevGrid, DECAY_RATE)
      })
    }, DECAY_INTERVAL)
    return () => clearInterval(interval)
  }, [])


  // check for challenge completion
  // runs every 500ms which might be too much but works fine
  useEffect(() => {
    if (!activeChallenge || activeChallenge.completed) return
    
    const interval = setInterval(() => {
      const isComplete = checkPattern(gridData, activeChallenge, GRID_SIZE)
      
      if (isComplete) {
        console.log(`>> challenge completed: ${activeChallenge.name}`)
        setChallengeList(prev => prev.map(c => 
          c.id === activeChallenge.id ? {...c, completed: true} : c
        ))
        setActiveChallenge(null)
        
        // TODO: make a nicer notification than alert
        alert(`Pattern decoded! ${activeChallenge.reward}`)
      }
    }, 500)
    
    return () => clearInterval(interval)
  }, [activeChallenge, gridData])


  const emitSignal = (clickX: number, clickY: number) => {
    const capturedGhost = checkGhostCapture(ghosts, clickX, clickY, CELL_SIZE)
    if (capturedGhost) {
      console.log('>> ghost captured!')
      capturedGhost.captured = true
      setGhosts([...ghosts])
      setCapturedGhost(capturedGhost)
      setDecodeStep(1)
      
      const newCount = captureCount + 1
      setCaptureCount(newCount)
      const updatedStories = checkStoryUnlocks(newCount, storyList)
      const unlockedStory = getNewlyUnlockedStory(captureCount, newCount, updatedStories)
      setStoryList(updatedStories)
      
      if (unlockedStory) {
        setNewStory(unlockedStory)
        console.log(`>> story unlocked: ${unlockedStory.title}`)
      }
      
      return
    }






    const gridX = Math.floor(clickX / CELL_SIZE)
    const gridY = Math.floor(clickY / CELL_SIZE)
    console.log(`>> burst at ${gridX},${gridY}`)

    const newGrid = emitSignalBurst(gridData, gridX, gridY, BURST_RADIUS, GRID_SIZE, currentColor, currentPattern)
    setGridData(newGrid)
    setSignalCount(signalCount + 1)

    const newRipple = createRipple(gridX, gridY, currentColor)
    setRipples([...ripples, newRipple])

    const newTrail = createTrail(gridX, gridY, currentColor)
    setTrails([...trails, newTrail])
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    gridData.forEach(row => {
      row.forEach(cell => {
        ctx.fillStyle = cell.color
        ctx.fillRect(
          cell.x * CELL_SIZE,
          cell.y * CELL_SIZE,
          CELL_SIZE - 1,
          CELL_SIZE - 1
        )
      })
    })

    // draw trails on top

    renderTrails(ctx, trails, CELL_SIZE)

    // draw ghost signals


    renderGhosts(ctx, ghosts, CELL_SIZE)
  }, [gridData, trails, ghosts])










  return (
    <div className="App">
      {/* top bar */}
      <div className="top-bar">
        <h1 className="title">ECHOGRID</h1>
        <p className="subtitle">collective signal space</p>
      </div>








      {/* main grid canvas */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect()
            if (rect) {
              const clickX = e.clientX - rect.left
              const clickY = e.clientY - rect.top
              emitSignal(clickX, clickY)
            }
          }}
        />
      </div>









      {/* bottom */}




      <div className="bottom-hud">
        <div className="hud-section">
          <button 
            className="emit-btn"
            onClick={() => {





              // emit at random position
              const randX = Math.random() * GRID_SIZE * CELL_SIZE
              const randY = Math.random() * GRID_SIZE * CELL_SIZE
              emitSignal(randX, randY)
            }}
          >
            emit signal
          </button>
          




          <button 
            className="clear-btn"
            onClick={() => {
              setGridData(initGrid(GRID_SIZE))
              setRipples([])
              setTrails([])
              setSignalCount(0)
              console.log('grid cleared')
            }}
          >
            clear grid
          </button>


          <button 
            className="story-btn"
            onClick={() => setShowStoryModal(true)}
          >
            transmissions [{storyList.filter(s => s.unlocked).length}/{storyList.length}]
          </button>


          <button 
            className="challenge-btn"
            onClick={() => setShowChallenges(!showChallenges)}
          >
            patterns
          </button>


          <button 
            className="help-btn"
            onClick={() => {
              setShowTutorial(true)
              setTutorialStep(0)
            }}
          >
            ?
          </button>






          
         
        </div>

        <div className="hud-stats">
          <div className="stat">
            <span className="stat-label">signals</span>
            <span className="stat-value">{signalCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">noise</span>
            <span className="stat-value">{noiseEnabled ? 'ON' : 'OFF'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">ripples</span>
            <span className="stat-value">{ripples.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">color</span>
            <span className="stat-value" style={{color: currentColor}}>{currentColor}</span>
          </div>
          <div className="stat">
            <span className="stat-label">ghosts</span>
            <span className="stat-value" style={{color: '#00ffff'}}>{ghosts.filter(g => !g.captured).length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">captured</span>
            <span className="stat-value" style={{color: '#ff00ff'}}>{captureCount}</span>
          </div>
        </div>

        <div className="hud-controls">
          <p>[1-6] colors  [qwert] patterns  [n] noise</p>
        </div>
      </div>


      {/* tutorial overlay */}
      {showTutorial && (
        <div className="decode-overlay">
          <div className="decode-box tutorial-box">
            {tutorialStep === 0 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">👋</span>
                  <h2>welcome to echogrid</h2>
                </div>
                <p className="decode-msg">yo so this is basically a signal grid thing</p>
                <p className="decode-msg">u click around and make signals, they fade and interact</p>
                <p className="decode-msg">theres also ghost signals floating around (the cyan ? things)</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn"
                    onClick={() => setTutorialStep(1)}
                  >
                    ok cool
                  </button>
                </div>
              </>
            )}

            {tutorialStep === 1 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">🎨</span>
                  <h2>colors and patterns</h2>
                </div>
                <p className="decode-msg">press 1-6 to change colors (green red blue cyan magenta yellow)</p>
                <p className="decode-msg">press q w e r t for different burst patterns</p>
                <p className="decode-msg">press n to toggle noise (makes it look more alive)</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn"
                    onClick={() => setTutorialStep(2)}
                  >
                    got it
                  </button>
                </div>
              </>
            )}

            {tutorialStep === 2 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">👻</span>
                  <h2>ghost signals</h2>
                </div>
                <p className="decode-msg">click on the cyan ? orbs to capture ghost signals</p>
                <p className="decode-msg">they have messages in them that lead to... something</p>
                <p className="decode-msg">capture signals to unlock story fragments</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn"
                    onClick={() => setTutorialStep(3)}
                  >
                    interesting
                  </button>
                </div>
              </>
            )}

            {tutorialStep === 3 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">🎯</span>
                  <h2>challenges</h2>
                </div>
                <p className="decode-msg">click patterns button to see challenges</p>
                <p className="decode-msg">try to recreate the patterns shown</p>
                <p className="decode-msg">clear grid button helps reset everything</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn"
                    onClick={() => setShowTutorial(false)}
                  >
                    ok lets go
                  </button>
                  <button 
                    className="decode-btn cancel-btn"
                    onClick={() => {
                      setShowTutorial(false)
                      setTutorialStep(0)
                    }}
                  >
                    skip tutorial
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* decode UI overlay */}
      {capturedGhost && decodeStep > 0 && (
        <div className="decode-overlay">
          <div className="decode-box">
            {decodeStep === 1 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">⚠</span>
                  <h2>wait signal intercepted</h2>
                </div>
                <p className="decode-msg">yo encrypted transmission detected</p>
                <p className="decode-msg">origin: idk somewhere??</p>
                <p className="decode-msg">timestamp: like {Math.floor(Math.random() * 100)} years ago maybe</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn"
                    onClick={() => setDecodeStep(2)}
                  >
                    try to decode
                  </button>
                  <button 
                    className="decode-btn cancel-btn"
                    onClick={() => {
                      setCapturedGhost(null)
                      setDecodeStep(0)
                    }}
                  >
                    nah ignore it
                  </button>
                </div>
              </>
            )}

            {decodeStep === 2 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">📡</span>
                  <h2>decoding...</h2>
                </div>
                <p className="decode-msg glitch">{capturedGhost.message}</p>
                <p className="decode-msg">signal strength: {Math.floor(Math.random() * 40 + 60)}%</p>
                <p className="decode-msg warning">⚠ bruh this message was left {Math.floor(Math.random() * 150 + 50)} years ago</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn"
                    onClick={() => setDecodeStep(3)}
                  >
                    keep going
                  </button>
                  <button 
                    className="decode-btn cancel-btn"
                    onClick={() => {
                      setCapturedGhost(null)
                      setDecodeStep(0)
                    }}
                  >
                    nvm stop
                  </button>
                </div>
              </>
            )}

            {decodeStep === 3 && (
              <>
                <div className="decode-header">
                  <span className="decode-icon">🔓</span>
                  <h2>wait hold up</h2>
                </div>
                <p className="decode-msg warning">r u sure about this??</p>
                <p className="decode-msg">this transmission has some ancient data or smth</p>
                <p className="decode-msg">once u decode it u cant unhear it bro</p>
                
                <div className="decode-actions">
                  <button 
                    className="decode-btn danger-btn"
                    onClick={() => {
                      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
                      setCapturedGhost(null)
                      setDecodeStep(0)
                    }}
                  >
                    yea show me
                  </button>
                  <button 
                    className="decode-btn cancel-btn"
                    onClick={() => {
                      setCapturedGhost(null)
                      setDecodeStep(0)
                    }}
                  >
                    nevermind
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* story unlock notification */}
      {newStory && (
        <div className="story-notification">
          <div className="notification-content">
            <div className="notif-icon">📡</div>
            <div>
              <div className="notif-title">TRANSMISSION DECODED</div>
              <div className="notif-subtitle">{newStory.title}</div>
            </div>
            <button 
              className="notif-close"
              onClick={() => {
                setNewStory(null)
                setShowStoryModal(true)
              }}
            >
              view
            </button>
          </div>
        </div>
      )}


      {/* story modal */}
      {showStoryModal && (
        <div className="decode-overlay" onClick={() => setShowStoryModal(false)}>
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            <div className="story-header">
              <h2>⟨ TRANSMISSIONS ⟩</h2>
              <button className="close-x" onClick={() => setShowStoryModal(false)}>×</button>
            </div>
            
            <div className="story-list">
              {storyList.map(story => (
                <div key={story.id} className={`story-item ${story.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="story-item-header">
                    <span className="story-number">{story.id}</span>
                    <span className="story-title">{story.unlocked ? story.title : '???'}</span>
                    <span className="story-requirement">
                      {story.unlocked ? '✓' : `${story.requiredCaptures} captures`}
                    </span>
                  </div>
                  {story.unlocked && (
                    <div className="story-text">{story.text}</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="story-footer">
              <p>capture ghost signals to unlock transmissions from the void</p>
            </div>
          </div>
        </div>
      )}


      {/* challenge panel */}
      {showChallenges && (
        <div className="challenge-panel">
          <div className="challenge-header">
            <h3>PATTERN CHALLENGES</h3>
            <button onClick={() => setShowChallenges(false)}>×</button>
          </div>
          
          <div className="challenge-list">
            {challengeList.map(challenge => (
              <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : ''}`}>
                <div className="challenge-info">
                  <div className="challenge-name">{challenge.name}</div>
                  <div className="challenge-desc">{challenge.description}</div>
                  {challenge.completed && (
                    <div className="challenge-reward">✓ {challenge.reward}</div>
                  )}
                </div>
                <button 
                  className="challenge-try-btn"
                  onClick={() => {
                    setActiveChallenge(challenge)
                    setGridData(initGrid(GRID_SIZE))
                    setShowChallenges(false)
                    console.log(`>> challenge started: ${challenge.name}`)
                  }}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? 'done' : 'try'}
                </button>
              </div>
            ))}
          </div>
          
          {activeChallenge && !activeChallenge.completed && (
            <div className="active-challenge-banner">
              <span>active: {activeChallenge.name}</span>
              <button onClick={() => setActiveChallenge(null)}>cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App


