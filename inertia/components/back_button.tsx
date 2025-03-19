import { Link } from '@inertiajs/react'
import { NavLink, Text } from '@mantine/core'
import { FaChevronLeft } from '@react-icons/all-files/fa/FaChevronLeft'

export function BackButton({ label, href }: { label: string; href: string }) {
  return (
    <NavLink
      component={Link}
      href={href}
      label={<Text fw={700}>{label}</Text>}
      leftSection={<FaChevronLeft />}
      style={{ width: 'fit-content' }}
    />
  )
}
