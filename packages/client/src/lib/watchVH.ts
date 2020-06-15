/**
 * This function is a closure that listens to the 'resize' window event
 * and updates a css variable `var(--vh)` that records the true viewport
 * height of the page.
 *
 * On mobile browsers the value 100vh is going to behave differently than
 * the expected on desktop browsers, due to the mechanisms that hides UI
 * elements (e.g. Top bars, URL field, status bar, etc.) when scrolling
 * the viewport in these devices.
 *
 * A workaround for this issue is to record 1% of the window.innerHeight
 * as a css variable and use the css function calc to get the desired units
 * in vh. This approach allows us to access this value globally without
 * having to resort on hooks, states, or any other JavaScript method.
 *
 * Example of usage for 5vh:
 * .className {
 *   height: calc(var(--vh) * 5);
 * }
 *
 * Note that this function only updates the variable in case the 'resize'
 * event has a window.innerHeight that is greater than the recorded
 * highestVH, this is done in order to avoide shrinking content when an
 * on-screen keyboard is shown.
 */
export const watchVH = (() => {
  let highestVH = 0

  const updateVH = () => {
    // Because we might toggle the developer tools while developing, and
    // constantly switch dimensions, it's better to always allow highestVH
    // to update in non-production builds
    if (window.innerHeight > highestVH || process.env.REACT_APP_SHOW_DEV_INFO) {
      highestVH = window.innerHeight
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      )
    }
  }

  // We fire this outside the eventListener to get the initial viewport
  // height value loaded
  updateVH()

  return () => window.addEventListener(
    'resize',
    () => {
      updateVH()
    },
  )
})()
