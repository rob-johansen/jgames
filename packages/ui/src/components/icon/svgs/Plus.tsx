import { twMerge } from 'tailwind-merge'

import type { IconProps } from '@/components/icon/Icon'

export const Plus = ({ className, primary = '#ffffff' }: IconProps) => {
  className = twMerge('h-[20px] shrink-0 w-[20px]', className)
  return (
    <svg className={className} viewBox="0 0 512 512">
      <path
        d="M256 112v288M400 256H112"
        fill="none"
        stroke={primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32px"
      />
    </svg>
  )
}
