import { twMerge } from 'tailwind-merge'

import type { IconProps } from '@/components/icon/Icon'

export const Silver = ({ className }: IconProps) => {
  return (
    <svg className={twMerge('h-[128px] shrink-[0] w-[128px]', className)} viewBox="0 0 500 500">
      <polygon clipRule="evenodd" fill="#4983C1" fillRule="evenodd" points="372,229.246 249.268,307.816 123,229.246 123,37 372,37" />
      <polygon clipRule="evenodd" fill="#FFFFFF" fillRule="evenodd" points="245,305.416 250.192,307.511 324,259.975 324,37 170,37 170,258.492" />
      <polygon clipRule="evenodd" fill="#E55C3C" fillRule="evenodd" points="220,290.516 248.545,307.816 274,292.661 274,37 220,37" />
      <polygon clipRule="evenodd" fillRule="evenodd" opacity="0.2" points="120.941,39 372,62.602 372,39"/>
      <rect clipRule="evenodd" fill="#E0E1E2" fillRule="evenodd" height="21" width="285" x="105" y="18"/>
      <rect clipRule="evenodd" fill="#CACCCE" fillRule="evenodd" height="21" width="143" x="247" y="18"/>
      <polygon clipRule="evenodd" fillRule="evenodd" opacity="0.2" points="247.185,205.719 335.411,252.67 248,308.661"/>
      <polygon clipRule="evenodd" fill="#E0E1E2" fillRule="evenodd" points="247.184,436.863 156.287,484.65 173.648,383.438 100.111,311.756 201.737,296.988 247.592,204.9 292.632,296.988 394.258,311.756 320.721,383.438 338.082,484.65"/>
      <polygon clipRule="evenodd" fill="#BFBFC1" fillRule="evenodd" points="248,345 247.592,205 292.632,296.988"/>
      <polygon clipRule="evenodd" fill="#CACCCE" fillRule="evenodd" points="394.258,311.756 248,345 320.721,383.438"/>
      <polygon clipRule="evenodd" fill="#CACCCE" fillRule="evenodd" points="338.082,484.718 248,345 248,437"/>
      <polygon clipRule="evenodd" fill="#CACCCE" fillRule="evenodd" points="100.111,311.756 248,345 173.648,383.438"/>
      <polygon clipRule="evenodd" fill="#BFBFC1" fillRule="evenodd" points="156.287,484.65 248,345 248,437"/>
      <circle cx="244.551" cy="347.958" fill="#AFB5BA" r="40.551"/>
      <circle cx="247.775" cy="351.181" fill="#E0E1E2" r="40.552"/>
      <circle cx="247.416" cy="350.821" fill="#CACCCE" r="19.479"/>
      <polygon clipRule="evenodd" fill="#FFFFFF" fillRule="evenodd" points="314.397,428.703 309.154,412.757 303.912,428.703 287.963,433.947 303.912,439.189 309.154,455.137 314.397,439.189 330.346,433.947"/>
      <polygon clipRule="evenodd" fill="#FFFFFF" fillRule="evenodd" points="269.018,430.6 272.43,420.223 282.806,416.812 272.43,413.4 269.018,403.023 265.605,413.4 255.229,416.812 265.605,420.223"/>
    </svg>
  )
}
