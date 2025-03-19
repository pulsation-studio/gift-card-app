import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { AdminProps, Resource } from '#admin/models'
import { LayoutChoice } from '#types/layout_choice'
import adminConfig from '#config/admin_config'
import { LucidModel } from '@adonisjs/lucid/types/model'

export default class AdminLayout {
  public async handle({ inertia }: HttpContext, next: NextFn) {
    const props: AdminProps = {
      layout: LayoutChoice.ADMIN,
      adminTitle: adminConfig.title,
      logoutPath: adminConfig.logoutPath,
      menuProps: adminConfig.resources.map((resource: Resource<LucidModel>) => {
        return { path: `/admin/${resource.meta.path}`, label: resource.meta.label_plural }
      }),
    }

    // @ts-expect-error ts(2345)
    inertia.share(props)

    await next()
  }
}
