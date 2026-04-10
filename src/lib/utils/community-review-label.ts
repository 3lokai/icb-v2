/** Label for homepage microcopy (parent applies uppercase). */
export function formatCommunityCoffeeReviewLabel(count: number | null): string {
  if (count === null) {
    return "Community ratings";
  }
  if (count < 1000) {
    return `${count.toLocaleString("en-IN")} community ratings`;
  }
  const k = Math.floor(count / 1000);
  return `${k}k+ community ratings`;
}
