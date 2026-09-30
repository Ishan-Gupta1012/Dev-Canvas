// The intro preloader belongs to a fresh landing page load. Returning from the
// access gateway, from a login, or from a logout reload should land straight on
// the intro, so those routes park a one-shot skip in sessionStorage, and a
// landing page that is reached again inside the same document reuses the same
// document state instead of replaying the intro.
const SKIP_KEY = 'devcanvas:skip-intro';

let hasVisitedLanding = false;

export function skipIntroOnNextLanding() {
  try {
    sessionStorage.setItem(SKIP_KEY, '1');
  } catch {}
}

export function shouldSkipIntro() {
  let isParked = false;
  try {
    isParked = sessionStorage.getItem(SKIP_KEY) === '1';
    if (isParked) sessionStorage.removeItem(SKIP_KEY);
  } catch {}

  const isRepeatVisit = hasVisitedLanding;
  hasVisitedLanding = true;
  return isParked || isRepeatVisit;
}
