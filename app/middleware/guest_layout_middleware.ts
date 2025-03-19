import { LayoutChoice } from '#types/layout_choice'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { LayoutProps } from '#types/layout_props'

export default class GuestLayout {
  public async handle({ inertia }: HttpContext, next: NextFn) {
    const props: LayoutProps = { layout: LayoutChoice.GUEST }
    // @ts-expect-error ts(2345)
    inertia.share(props)
    await next()
  }
}
