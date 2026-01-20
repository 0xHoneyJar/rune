/**
 * Sigil Toolbar - Animation Inspector
 * Pause, resume, and inspect animations on the page
 */

interface AnimationState {
  animation: Animation
  playState: AnimationPlayState
  element: Element | null
}

// Track paused animations for restoration
let pausedAnimations: AnimationState[] = []
let isPaused = false

/**
 * Get all animations on the page
 */
export function getAllAnimations(): Animation[] {
  return document.getAnimations()
}

/**
 * Pause all running animations
 */
export function pauseAllAnimations(): number {
  if (isPaused) return 0

  const animations = getAllAnimations()
  pausedAnimations = []

  let count = 0
  for (const animation of animations) {
    if (animation.playState === 'running') {
      pausedAnimations.push({
        animation,
        playState: animation.playState,
        element: animation.effect?.target ?? null,
      })
      animation.pause()
      count++
    }
  }

  isPaused = true
  console.log(`[Sigil] Paused ${count} animations`)
  return count
}

/**
 * Resume previously paused animations
 */
export function resumeAnimations(): number {
  if (!isPaused) return 0

  let count = 0
  for (const state of pausedAnimations) {
    if (state.animation.playState === 'paused') {
      state.animation.play()
      count++
    }
  }

  pausedAnimations = []
  isPaused = false
  console.log(`[Sigil] Resumed ${count} animations`)
  return count
}

/**
 * Toggle pause/resume state
 */
export function toggleAnimations(): { isPaused: boolean; count: number } {
  if (isPaused) {
    const count = resumeAnimations()
    return { isPaused: false, count }
  } else {
    const count = pauseAllAnimations()
    return { isPaused: true, count }
  }
}

/**
 * Check if animations are paused
 */
export function areAnimationsPaused(): boolean {
  return isPaused
}

/**
 * Get animation details for a specific element
 */
export function getElementAnimations(element: Element): AnimationDetails[] {
  const animations = element.getAnimations()
  return animations.map(anim => getAnimationDetails(anim))
}

/**
 * Animation details structure
 */
export interface AnimationDetails {
  name: string
  duration: number
  delay: number
  iterations: number
  direction: string
  easing: string
  playState: AnimationPlayState
  currentTime: number | null
  progress: number
}

/**
 * Extract details from an Animation object
 */
function getAnimationDetails(animation: Animation): AnimationDetails {
  const effect = animation.effect as KeyframeEffect | null
  const timing = effect?.getTiming() ?? {}

  const duration = typeof timing.duration === 'number' ? timing.duration : 0
  const currentTime = animation.currentTime ?? 0
  const progress = duration > 0 ? (currentTime / duration) % 1 : 0

  return {
    name: animation.id || 'unnamed',
    duration,
    delay: timing.delay ?? 0,
    iterations: timing.iterations ?? 1,
    direction: timing.direction ?? 'normal',
    easing: timing.easing ?? 'linear',
    playState: animation.playState,
    currentTime: animation.currentTime,
    progress,
  }
}

/**
 * Get CSS transition info for an element
 */
export interface TransitionInfo {
  property: string
  duration: string
  timingFunction: string
  delay: string
}

export function getTransitionInfo(element: Element): TransitionInfo[] {
  const computed = window.getComputedStyle(element)

  const properties = computed.transitionProperty.split(',').map(s => s.trim())
  const durations = computed.transitionDuration.split(',').map(s => s.trim())
  const timings = computed.transitionTimingFunction.split(',').map(s => s.trim())
  const delays = computed.transitionDelay.split(',').map(s => s.trim())

  // No transitions
  if (properties.length === 1 && properties[0] === 'all' && durations[0] === '0s') {
    return []
  }

  return properties.map((property, i) => ({
    property,
    duration: durations[i % durations.length],
    timingFunction: timings[i % timings.length],
    delay: delays[i % delays.length],
  }))
}

/**
 * Get animation summary for the page
 */
export interface AnimationSummary {
  total: number
  running: number
  paused: number
  finished: number
  elements: number
}

export function getAnimationSummary(): AnimationSummary {
  const animations = getAllAnimations()
  const elements = new Set<Element>()

  let running = 0
  let paused = 0
  let finished = 0

  for (const anim of animations) {
    const target = anim.effect?.target
    if (target) elements.add(target)

    switch (anim.playState) {
      case 'running':
        running++
        break
      case 'paused':
        paused++
        break
      case 'finished':
        finished++
        break
    }
  }

  return {
    total: animations.length,
    running,
    paused,
    finished,
    elements: elements.size,
  }
}

/**
 * Slow down all animations by a factor
 */
export function setPlaybackRate(rate: number): void {
  const animations = getAllAnimations()
  for (const anim of animations) {
    anim.playbackRate = rate
  }
  console.log(`[Sigil] Set playback rate to ${rate}x for ${animations.length} animations`)
}

/**
 * Reset playback rate to normal
 */
export function resetPlaybackRate(): void {
  setPlaybackRate(1)
}
