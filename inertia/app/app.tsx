/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import settings from '#config/settings'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { createRoot } from 'react-dom/client'
import { LayoutHandler } from '~/helpers/layout_handler'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

const theme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: settings.global.primaryColor,
    secondary: settings.global.secondaryColor,
  },
})

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    const pages = import.meta.glob<Page>('../pages/**/*.tsx')
    const page = resolvePageComponent(`../pages/${name}.tsx`, pages)

    const pageWithLayout = page.then((resolvedPage) => {
      const layout = ({ props }) => (
        <LayoutHandler layoutChoice={props.layout} props={props}>
          <resolvedPage.default {...props} />
        </LayoutHandler>
      )
      resolvedPage.default.layout = layout
      return resolvedPage
    })

    return pageWithLayout
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <MantineProvider theme={theme}>
        <App {...props} />
      </MantineProvider>
    )
  },
})
