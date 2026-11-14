/** Keyboard navigation for a five-star *action* group.
 * Moving focus must never submit a rating or launch the form.
 * Enter/Space use the native button click event instead. */
export function nextRatingFocus(key: string, current: number): number | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return Math.min(current + 1, 5);
    case "ArrowLeft":
    case "ArrowDown":
      return Math.max(current - 1, 1);
    case "Home":
      return 1;
    case "End":
      return 5;
    default:
      return null;
  }
}
