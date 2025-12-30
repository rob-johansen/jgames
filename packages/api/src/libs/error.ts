const funnyErrors = [
  'Unfortunately we have miscalculated something. Please bear with our human tendency to botch things.',
  'We regret to inform you that we are imperfect, and you are presently witnessing one of our mistakes.',
  'Our proclivity to commit errors is embarrassing. We hope you find it in yourself to eschew frustration.',
  'One of our many shortcomings is now manifest. We sincerely apologize that our app is not flawless.',
  'You are currently experiencing one of our blunders. We pray you will not be disaffected by our fallibility.',
]

export const getFunnyError = (): string => {
  return funnyErrors[Math.floor(Math.random() * funnyErrors.length)]
}
