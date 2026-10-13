import { imageSrc, imageSrcSet } from '../data/products';

// One square product photo. `sizes` defaults to the grid: 2 columns on mobile, 4 on desktop.
// eager: above the fold, fetched first. secondary: extra views, fetched after everything else.
export function ProductImage({ name, alt, eager = false, secondary = false, sizes = '(min-width: 64rem) 18rem, (min-width: 40rem) 33vw, 50vw', className = '' }: {
  name: string;
  alt: string;
  eager?: boolean;
  secondary?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <img
      src={imageSrc(name)}
      srcSet={imageSrcSet(name)}
      sizes={sizes}
      width={480}
      height={480}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : secondary ? 'low' : undefined}
      decoding="async"
      className={`aspect-square w-full object-contain ${className}`}
    />
  );
}
