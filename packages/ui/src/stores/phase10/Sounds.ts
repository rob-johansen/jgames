export class Sounds {
  card?: HTMLAudioElement

  init = () => {
    this.card = new Audio('/sounds/phase10/card.mp3')
  }

  playCard = async () => {
    if (!this.card) return

    try {
      this.card.currentTime = 0
      await this.card.play()
    } catch {
      // No-op. Oh well, the sound didn't play.
    }
  }
}
