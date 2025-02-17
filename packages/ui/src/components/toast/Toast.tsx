import { twMerge } from 'tailwind-merge'
import toast, { Toaster } from 'react-hot-toast'
import type React from 'react'
import type { Toast as ToastType } from 'react-hot-toast'

import { Icon, CircleCheck, CircleClose } from '@/components/icon'

type Props = {
  duration?: number
  message: string
  type: 'success' | 'error'
}

export const Toast = (): React.JSX.Element => (
  <Toaster containerStyle={{ top: '48px' }}/>
);

export const showToast = ({
  duration = 5000,
  message,
  type,
}: Props): void => {
  const error = type === 'error';

  const toastStyles = twMerge(
    `
      bg-[#258750]/10
      border
      border-[#258750]
      flex
      gap-[10px]
      h-[50px]
      items-center
      px-[24px]
      rounded-full
      shadow-[0_8px_12px_rgba(100,100,100,0.16)]
      w-fit
    `,
    error &&
    `
      bg-[#d72b0d]/10
      border-[#d72b0d]
    `
  );

  const textStyles = twMerge(
    `
      font-bold
      text-[#258750]
    `,
    error && 'text-[#d72b0d]'
  );

  toast.custom(
    (instance: ToastType) => (
      <div
        className={twMerge(
          toastStyles,
          !instance.visible && 'hidden'
        )}
      >
        <Icon source={error ? CircleClose : CircleCheck}/>
        <span className={textStyles}>
          {message}
        </span>
      </div>
    ),
    {duration}
  );
}
