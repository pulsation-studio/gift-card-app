import { MiddlewareProps } from '#types/middleware_props'
import { useEffect, useMemo, useState } from 'react'

const layouts = import.meta.glob('../layout/**/*.tsx')

export const LayoutHandler = ({
  children,
  layoutChoice,
  props,
}: {
  children: JSX.Element
  layoutChoice: string
  props: MiddlewareProps
}) => {
  const [LayoutChosen, setLayoutChosen] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    if (!layoutChoice || !layouts[`../layout/${layoutChoice}.tsx`]) {
      console.warn(`Layout "${layoutChoice}" not found, falling back to default.`)
      setLayoutChosen(() => ({ children }: { children: JSX.Element }) => <>{children}</>)
      return
    }

    layouts[`../layout/${layoutChoice}.tsx`]()
      .then((module) => setLayoutChosen(() => module.default))
      .catch((err) => {
        console.error(`Failed to load layout "${layoutChoice}":`, err)
        setLayoutChosen(() => ({ children }: { children: JSX.Element }) => <>{children}</>)
      })
  }, [layoutChoice])

  const RenderedLayout = useMemo(() => LayoutChosen, [LayoutChosen])

  return RenderedLayout ? (
    <RenderedLayout {...props}>{children}</RenderedLayout>
  ) : (
    <div>Loading layout...</div>
  )
}
