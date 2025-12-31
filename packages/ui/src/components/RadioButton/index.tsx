import type { Ref } from 'react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Label } from '@/components/label/Label'

type RadioButtonProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
  label?: string
}

const getCheckIcon = ({
  checked,
  disabled,
}: Partial<RadioButtonProps>): string => {
  let fill = 'white';
  if (checked && disabled) fill = '%23999999';
  if (!checked && disabled) fill = '%23F7F7F7';
  if (checked && !disabled) fill = '%236a0dad';

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width='18px' fill='${fill}'%3E%3Cpath d='M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208z'/%3E%3C/svg%3E`;
};

export const RadioButton = React.forwardRef(
  (
    { className, error, label, ...props }: RadioButtonProps,
    ref: Ref<HTMLInputElement>
  ): React.JSX.Element => {
    return (
      <Label
        className={twMerge('cursor-pointer disabled:hover:text-neutral-400 flex group hover:text-phase10-card-purple items-center text-neutral-800 w-fit', className, props.checked && 'text-phase10-card-purple')}
        disabled={props.disabled}
        error={error}
      >
        <input
          {...props}
          className={twMerge('appearance-none border-[1px] border-slate-400 checked:border-phase10-card-purple cursor-pointer disabled:bg-neutral-100 disabled:border-neutral-600 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:border-[none] disabled:group-hover:shadow-[none] group-hover:shadow-[0_0_0_5px_rgba(106,13,173,0.08)] h-[24px] hover:border-brand-400 mr-[12px] outline-none rounded-full transition w-[24px]', error && 'border-error')}
          ref={ref}
          style={{ backgroundImage: `url("${getCheckIcon(props)}")`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
          type="radio"
        />
        {label}
      </Label>
    );
  }
);

RadioButton.displayName = 'RadioButton';
