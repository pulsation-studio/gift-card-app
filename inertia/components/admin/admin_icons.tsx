const iconLibraries = {
  ...import.meta.glob<Record<string, JSX.Element>>(
    '../../../node_modules/@react-icons/all-files/md/*.esm.js'
  ),
  // Add others react-icons libs
  // Please note that this will significantly increase the import cost.
}

export async function getIcon(iconLibrary: string, iconName: string): Promise<JSX.Element> {
  const iconModulePromise =
    iconLibraries[`../../../node_modules/@react-icons/all-files/${iconLibrary}/${iconName}.esm.js`]

  const iconIsFound = iconModulePromise !== undefined
  if (iconIsFound) {
    const choosenModule = await iconModulePromise()
    const icon = choosenModule[iconName]
    return icon
  } else {
    console.error(`Error loading ${iconName} from ${iconLibrary}:`)
    return <>404</>
  }
}
