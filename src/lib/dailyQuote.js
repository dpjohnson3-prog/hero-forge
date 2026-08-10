// Deterministically picks one quote per day from a hero's quotes array, so
// everyone sees the same quote on a given day and it changes at midnight.
// With a single quote this just returns that quote every day; the rotation
// kicks in automatically as more quotes are added per hero.
export function getDailyQuote(quotes) {
  if (!quotes || quotes.length === 0) return null

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - startOfYear) / 86400000)

  return quotes[dayOfYear % quotes.length]
}
