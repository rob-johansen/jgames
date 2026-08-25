import { twMerge } from 'tailwind-merge'

import type { IconProps } from '@/components/icon/Icon'

export const Bronze = ({ className }: IconProps) => {
  return (
    <svg className={twMerge('h-[128px] shrink-[0] w-[128px]', className)} viewBox="0 0 500 500">
      <rect fill="none" height="402" width="582" y="-1" x="-1" />
      <polygon points="374,225.246 251.268,303.817 125,225.246 125,33 374,33" fillRule="evenodd" fill="#239B7B" clipRule="evenodd" />
      <polygon points="249.352,302.413 252.271,303.511 326,255.577 326,33 172,33 172,254.492" fillRule="evenodd" fill="#FFFFFF" clipRule="evenodd" />
      <polygon points="222,286.516 250.545,303.817 276,288.661 276,33 222,33" fillRule="evenodd" fill="#2CBC9B" clipRule="evenodd" />
      <polygon points="123.257,35 374,59.601 374,35" opacity="0.2" fillRule="evenodd" clipRule="evenodd" />
      <rect y="14" x="106.499987" width="285" height="21" fillRule="evenodd" fill="#ef7b3a" clipRule="evenodd" />
      <rect y="14" x="249" width="143" height="21" fillRule="evenodd" fill="#da672f" clipRule="evenodd" />
      <circle r="125.377998" fill="#ef7b3a" cy="355.639015" cx="250.849" />
      <path fill="#da672f" d="m252.313,265.859l0,180.059c49.063,-0.786 88.604,-40.778 88.604,-90.03c0,-49.25 -39.54,-89.243 -88.604,-90.029z" />
      <path fill="#bf5725" d="m169.398,360.309c0,-47.425 38.444,-85.871 85.872,-85.871c45.183,0 82.188,34.906 85.589,79.216c-1.191,-48.706 -41.019,-87.832 -90.01,-87.832c-49.743,0 -90.067,40.325 -90.067,90.066c0,48.993 39.127,88.822 87.835,90.01c-44.313,-3.399 -79.219,-40.405 -79.219,-85.589z" />
      <circle r="35.241" fill="#bf5725" cy="352.219" cx="247.179" />
      <circle r="35.242001" fill="#ef7b3a" cy="355.889" cx="251.098985" />
      <polygon points="354.318,389.658 349.01,373.508 343.701,389.658 327.549,394.968 343.701,400.277 349.01,416.427 354.318,400.277 370.469,394.968" fillRule="evenodd" fill="#FFFFFF" clipRule="evenodd" />
      <path id="svg_20" opacity="0.2" fillRule="evenodd" d="m252.188,230.52c-0.097,0 -0.185,0.003 -0.279,0.003c27.927,0.232 53.67,9.598 74.404,25.25l11.91,-7.625c-17.697,-14.594 -65.395,-17.628 -86.035,-17.628z" clipRule="evenodd" />
    </svg>
  )
}
