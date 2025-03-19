import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export class CodeGeneratorService {
  // Pour avoir un increment qui conserve "en cache" le dernier increment,
  // il faut le stocker hors de l'app dans un redis par exemple
  // car si l'app redémare l'increment risque d'être remis a 0 de manière involontaire
  private static generateNumber(id: number) {
    const datePart = DateTime.now().year

    const uniquePartMinLength = 6
    const uniqueIdentifier = id.toString()
    const uniquePart =
      uniqueIdentifier.length < uniquePartMinLength
        ? uniqueIdentifier.padStart(uniquePartMinLength, '0')
        : uniqueIdentifier

    return `${datePart}-${uniquePart}`
  }

  public static generateOrderNumber(id: number) {
    return this.generateNumber(id)
  }

  public static generateTransactionNumber(id: number) {
    return this.generateNumber(id)
  }

  public static generateCardNumber(id: number) {
    const now = new Date()
    const dateMMDD = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const hashPart = crypto
      .createHash('md5')
      .update(id.toString())
      .digest('hex')
      .substring(0, 4)
      .toUpperCase()
    return `${dateMMDD}${hashPart}`
  }

  public static generateFourDigitCode() {
    return Math.floor(1000 + Math.random() * 9000)
  }
}
