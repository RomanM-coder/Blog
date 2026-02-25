export const calculatePosition = (
  element: HTMLDivElement | null,
  offset: number,
  container: HTMLElement | null
): { start: number; end: number } => {
  if (!element || !container) return { start: 0, end: 0 }

  const rect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  const elementTopInContainer = rect.top - containerRect.top
  const containerScrollTop = container.scrollTop

  const absoluteTop = elementTopInContainer + containerScrollTop
  const start = absoluteTop - offset
  const end = start + rect.height

  return { start, end }
}