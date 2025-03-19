import { FileGeneratorService } from '#types/file_generator_service'
import { PaymentService } from '#types/payment_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const { StripePaymentService } = await import('#services/stripe_payment_service')
    const { CarboneFileGeneratorService } = await import('#services/carbone_file_generator_service')
    this.app.container.singleton(PaymentService, () => {
      return this.app.container.make(StripePaymentService)
    })

    this.app.container.singleton(FileGeneratorService, () => {
      return this.app.container.make(CarboneFileGeneratorService)
    })
  }
}
