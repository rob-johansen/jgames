import { twMerge } from 'tailwind-merge'
import type React from 'react'

import { Icon, CircleExclamation } from '@/components/icon'

type Props = React.HTMLProps<HTMLDivElement>

export const Error = ({ className, children, ...props }: Props) => {
  return (
    <div className={twMerge('flex gap-x-[8px] items-center min-h-[18px]', className)} {...props}>
      <Icon className="size-[16px]" source={CircleExclamation} />
      <span className="text-[0.75rem] text-error tracking-[0.4px]">
        {children}
      </span>
    </div>
  )
}
