const hitMessages = [
  'Nice hit!',
  'You hit it!',
  'Hittin’ like a pro!',
  'Nobody hits like you do!',
  'The hit meister!',
  'Hit me up!',
  'Hit city!',
  'You had to hit that!',
  'They don’t know what hit them!',
  'Hit it and quit it!',
  'Hit-o-rama!',
  'You’re in hit heaven!',
]

export const getHitMessage = (): string => {
  return hitMessages[Math.floor(Math.random() * hitMessages.length)]
}

const phaseMessages = [
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

export const getPhaseMessage = (): string => {
  return phaseMessages[Math.floor(Math.random() * phaseMessages.length)]
}
