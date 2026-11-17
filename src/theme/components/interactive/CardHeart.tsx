'use client'

import { useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/shop.module.css'

const heart = 'M12 20.5l-1.3-1.2C5.9 15 3 12.3 3 9a4.4 4.4 0 014.5-4.5c1.5 0 3 .7 4.5 2.1 1.5-1.4 3-2.1 4.5-2.1A4.4 4.4 0 0121 9c0 3.3-2.9 6-7.7 10.3z'

/** The card's wishlist heart, over the picture's corner: pressed when the product is on the shopper's wishlist. */
export const CardHeart = ({ productId, name }: { productId: string; name: string }) => {
  const { t } = useStorefront()
  const wishlist = useWishlist()
  const on = wishlist.has(productId)
  return (
    <button type="button" className={cx(styles.cardHeart, on && styles.cardHeartOn)} aria-pressed={on} aria-label={t('shop.wishlist.heart', { name })} disabled={wishlist.busy || wishlist.status === 'loading'} onClick={() => void wishlist.toggle(productId, null)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={heart} fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
