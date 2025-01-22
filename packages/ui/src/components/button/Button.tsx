import { twMerge } from 'tailwind-merge'
import type React from 'react'

import { Icon, Loading } from '@/components/icon'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: {
    element: React.JSX.Element,
    location?: 'left' | 'right'
  }
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export const Button = ({
  children,
  className,
  disabled,
  icon,
  loading,
  variant = 'primary',
  ...props
}: Props): React.JSX.Element => {
  const styles = twMerge(
    `
      active:bg-button-active
      bg-button-main
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
      text-black tracking-[1px]
      w-fit
    `,
    variant === 'secondary' &&
    `
      active:bg-blue/[0.2]
      bg-transparent
      border
      border-blue
      hover:bg-blue/[0.1]
      text-blue
    `,
    disabled &&
    `
      active:bg-[#bbbbbb]
      bg-[#bbbbbb]
      border-transparent
      cursor-not-allowed
      hover:bg-[#bbbbbb]
      text-[#eeeeee]
    `,
    loading &&
    `
      active:bg-button-active
      bg-button-active
      cursor-default
      hover:bg-button-active
    `,
    icon && icon.location === 'right' ? 'flex-row' : 'flex-row-reverse',
    className
  )

  const iconStyles = twMerge(
    disabled && 'grayscale invert-[50%] opacity-60',
    loading && 'opacity-0'
  )

  return (
    <button {...props} className={styles} disabled={disabled || loading}>
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      {icon && <span className={iconStyles}>{icon.element}</span>}
      {loading && <Icon className="absolute" source={Loading} />}
    </button>
  )
}
