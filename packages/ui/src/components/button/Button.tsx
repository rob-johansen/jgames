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
      active:opacity-80
      disabled:active:opacity-100
      disabled:hover:opacity-100
      flex
      font-bold
      gap-[8px]
      h-[36px]
      hover:opacity-90
      items-center
      justify-center
      max-w-[340px]
      px-[12px]
      py-[8px]
      relative
      rounded-[6px]
      text-[1rem]
      text-white
      tracking-[0.5px]
      w-fit
    `,
    variant === 'primary' &&
    `
      bg-gradient-to-br
      disabled:active:opacity-65
      disabled:opacity-65
      disabled:hover:opacity-65
      from-[#4568dc]
      from-[-0.27%]
      to-[#b06ab3]
      to-[134.14%]
    `,
    variant === 'secondary' &&
    `
      active:bg-[#e2dff3]/[0.875]
      bg-white
      border
      border-blue
      disabled:bg-white
      disabled:border-slate-400/[0.75]
      disabled:text-slate-400/[0.75]
      hover:bg-[#efedf8]/[0.625]
      text-[#4568dc]
    `,
    disabled &&
    `
      cursor-not-allowed
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
