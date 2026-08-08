import { twMerge } from 'tailwind-merge'

import type { IconProps } from '@/components/icon/Icon'

export const Ban = ({
  className,
  primary = '#171717'
}: IconProps) => {
  return (
    <svg className={twMerge('h-[16px] shrink-[0] w-[16px]', className)} viewBox="0 0 512 512">
      <circle
        cx="256"
        cy="256"
        fill="none"
        r="208"
        stroke={primary}
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        d="m108.92 108.92 294.16 294.16"
        fill="none"
        stroke={primary}
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </svg>
  )
}
