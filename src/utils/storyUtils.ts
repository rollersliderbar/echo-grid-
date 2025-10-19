

export interface StoryFragment {
  id: number
  title: string
  text: string
  unlocked: boolean
  requiredCaptures: number
}


export const storyFragments: StoryFragment[] = [
  {
    id: 1,
    title: "first signal",
    text: "something weird here. signal detected, origin unknown. grid pulsing with some kind of echo",
    unlocked: false,
    requiredCaptures: 1
  },
  {
    id: 2,
    title: "patterns emerging",
    text: "these arent random. signals follow old patterns, broadcasting for years maybe",
    unlocked: false,
    requiredCaptures: 3
  },
  {
    id: 3,
    title: "temporal error",
    text: "timestamp reads 2087. either broken or signals traveling through time",
    unlocked: false,
    requiredCaptures: 5
  },
  {
    id: 4,
    title: "warning detected",
    text: "decoded fragment: 'dont let them synchronize... if grids align... reality' [signal lost]",
    unlocked: false,
    requiredCaptures: 8
  },
  {
    id: 5,
    title: "acceleration",
    text: "ghost signals speeding up. more appearing every cycle. all converging to one point. 47 days",
    unlocked: false,
    requiredCaptures: 12
  },
  {
    id: 6,
    title: "final decrypt",
    text: "not observing signals. you are the signal. this grid, this moment. loop never stops. echo never ends",
    unlocked: false,
    requiredCaptures: 15
  }
]

export const checkStoryUnlocks = (captureCount: number, fragments: StoryFragment[]): StoryFragment[] => {
  return fragments.map(fragment => ({
    ...fragment,
    unlocked: fragment.unlocked || captureCount >= fragment.requiredCaptures
  }))
}


export const getNewlyUnlockedStory = (
  oldCount: number, 
  newCount: number, 
  fragments: StoryFragment[]
): StoryFragment | null => {
  for (const fragment of fragments) {
    if (!fragment.unlocked && oldCount < fragment.requiredCaptures && newCount >= fragment.requiredCaptures) {
      return fragment
    }
  }
  return null
}
