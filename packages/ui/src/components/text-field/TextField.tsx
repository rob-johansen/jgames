import { twMerge } from 'tailwind-merge'
import type { Ref } from 'react'
import React from 'react'

import { Label } from '@/components/label/Label'

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  outerClassName?: string
}

export const TextField = React.forwardRef(
  (
    { className, error, label, outerClassName, ...props }: Props, ref: Ref<HTMLInputElement>
  ): React.JSX.Element => {
    const outerStyles = twMerge(
      `
        flex
        flex-col
        focus-within:text-blue
        relative
      `,
      outerClassName
    )

    const inputStyles = twMerge(
      `
        border-[1px]
        border-gray
        cursor-text
        disabled:bg-[#aaaaaa]/[.05]
        disabled:border-[#3c3c3c]
        disabled:cursor-not-allowed
        disabled:hover:border-[#3c3c3c]
        disabled:shadow-none
        disabled:text-[#999999]
        focus:border-blue
        focus:shadow-[0_0_2px_rgba(29,155,240,1)]
        h-[44px]
        hover:border-[#5c5c5c]
        hover:shadow-[0_0_2px_rgba(124,124,124,0.5)]
        max-w-full
        outline-none
        placeholder-[#6a6a6a]
        pl-[16px]
        pr-[8px]
        py-[7px]
        rounded
        text-[1rem]
        text-black
      `,
      error && `
        border-error
        disabled:hover:border-error
        focus:border-error
        focus:shadow-[0_0_2px_rgba(215,43,13,0.3)]
        hover:border-error
        hover:shadow-[0_0_2px_rgba(215,43,13,0.3)]
      `,
      className
    )

    const errorStyles = twMerge(
      `
        h-[18px]
        mt-[2px]
        text-[0.75rem]
        text-error
        text-right
        tracking-[0.4px]
      `,
      error ? 'visible' : 'invisible'
    )

    return (
      <div className={outerStyles}>
        {typeof label === 'string' && label && (
          <Label disabled={props.disabled} error={!!error} htmlFor={props.id}>
            {label}
          </Label>
        )}
        <input {...props} className={inputStyles} ref={ref} />
        <p className={errorStyles}>{error}</p>
      </div>
    )
})

TextField.displayName = 'TextField'
