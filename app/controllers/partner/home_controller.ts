import { handleUnknownError } from '#helpers/handle_unknown_error'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

export default class PartnerHomeController {
  public async showPartnerHomeView({ inertia, response }: HttpContext) {
    try {
      return inertia.render('partner/home', {
        searchPath: router.makeUrl('partner.giftCard.show', ['']),
      })
    } catch (error) {
      logger.error(error)

      handleUnknownError(error, "Erreur lors du chargement de la page d'accueil")
      return response.redirect().toRoute('ServerError')
    }
  }
}
