import type React from 'react'

export type IconProps = React.SVGAttributes<HTMLOrSVGElement> & {
  primary?: string
  quaternary?: string
  secondary?: string
  tertiary?: string
}

type Props = IconProps & {
  source: (props: IconProps) => React.JSX.Element
}

export const Icon = ({ source, ...props }: Props): React.JSX.Element => {
  const SourceIcon = source // JSX Element names must start with a capital letter.
  return <SourceIcon {...props} />
}
