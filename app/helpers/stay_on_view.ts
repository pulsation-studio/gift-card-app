import { HttpContext } from '@adonisjs/core/http'

export function stayOnView(ctx: HttpContext) {
  return ctx.response.redirect(ctx.request.url(true))
}
