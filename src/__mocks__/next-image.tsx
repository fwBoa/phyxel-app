import React from 'react'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
}

export default function Image({ src, alt, fill: _fill, priority: _p, ...rest }: ImageProps) {
  return <img src={src} alt={alt} {...rest} />
}
