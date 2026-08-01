const funnyMessages = [
  'Eh-oh ... warshaw ... it’s a garbage can ...',
  'I’m so excited ... and I can’t just hide it ...',
  'Good job ... [dad sniff] ...',
  'Baby my baby ... gimme the news ...',
  'Oh, that’s fire ...',
  'Rub it all around ...',
  'To infinity ... and beyond ...',
  'Take a vacation from your problems ...',
  'No way, Bosé ...',
  'Peace out ...',
  'My mother hadn’t had a hot meal ...',
]

export const getFunnyMessage = (): string => {
  return funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
}
