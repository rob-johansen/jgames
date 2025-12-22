import { twMerge } from 'tailwind-merge'

import type { IconProps } from '@/components/icon/Icon'

export const ChevronRight = ({
  className,
  primary = '#ffffff'
}: IconProps) => {
  return (
    <svg className={twMerge('h-[16px] shrink-[0] w-[16px]', className)} viewBox="0 0 512 512">
      <path
        d="M184 112l144 144-144 144"
        fill="none"
        stroke={primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
      />
    </svg>
  )
}
