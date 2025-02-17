import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type React from 'react'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & {
  icon?: {
    element: React.JSX.Element,
    location?: 'left' | 'right'
  }
  variant?: 'primary' | 'secondary'
}

export const ButtonLink = ({
  children,
  className,
  icon,
  variant = 'primary',
  ...props
}: Props): React.JSX.Element => {
  const styles = twMerge(
    `
      active:bg-button-active
      flex
      font-bold
      gap-[8px]
      h-[36px]
      hover:bg-button-hover
      items-center
      justify-center
      max-w-[340px]
      px-[12px]
      py-[8px]
      relative
      rounded-[6px]
      text-[1rem]
      text-white
      tracking-[1px]
      w-fit
    `,
    variant === 'secondary' &&
    `
      active:bg-[#01add8]/[0.275]
      bg-[#01add8]/[0.375]
      hover:bg-[#01add8]/[0.325]
    `,
    icon && icon.location === 'right' ? 'flex-row' : 'flex-row-reverse',
    className
  )

  return (
    <Link {...props} className={styles}>
      {children}
      {icon && <>{icon.element}</>}
    </Link>
  )
}
