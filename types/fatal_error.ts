export default class FatalError {
  id = new Date()
  message: string

  constructor(message: string) {
    this.message = message
  }
}
