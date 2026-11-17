import { Image, Link, Price, useStorefront, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { CardHeart } from './interactive/CardHeart'
import { cx } from './cx'
import styles from '../styles/shop.module.css'

/** The saving as a whole percent, when the product shows a higher compare-at price in the same currency. */
export const savingOf = (product: Card): number | null => {
  const { price, compareAt } = product
  if (!price || !compareAt || price.currency !== compareAt.currency) return null
  const now = Number(price.amount)
  const was = Number(compareAt.amount)
  if (!(was > now && now >= 0)) return null
  const off = Math.round(((was - now) / was) * 100)
  return off > 0 ? off : null
}

export const ProductCard = ({ product, row = false }: { product: Card; row?: boolean }) => {
  const { store, locale, t } = useStorefront()
  const saving = savingOf(product)
  return (
    <article className={cx(styles.card, row && styles.cardRow)}>
      <div className={styles.cardPicture}>
        <Link href={product.href} className={styles.cardPictureLink}>
          {product.photo ? (
            <Image image={product.photo} alt={product.photo.alt ?? product.name} ratio={1} sizes="(min-width: 1100px) 260px, (min-width: 640px) 30vw, 46vw" className={styles.cardImage} />
          ) : (
            <span className={styles.noPicture}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.6" />
                <path d="M21 16l-5-5-7 7" />
              </svg>
              {t('shop.card.noPicture')}
            </span>
          )}
        </Link>
        {saving ? (
          <span className={styles.saving}>{t('shop.card.off', { n: saving })}</span>
        ) : product.badges[0] ? (
          <span className={styles.badge}>{product.badges[0].label}</span>
        ) : null}
        {product.stock.inStock ? null : <span className={styles.soldOut}>{t('shop.card.soldOut')}</span>}
        <CardHeart productId={product.id} name={product.name} />
      </div>
      <div className={styles.cardBody}>
        <Link href={product.href} className={styles.cardLink}>
          <h3 className={styles.cardName}>{product.name}</h3>
        </Link>
        {product.price ? (
          <p className={styles.cardPrice}>
            {product.from ? <span className={styles.from}>{t('shop.card.from')}</span> : null}
            <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={styles.price} />
          </p>
        ) : null}
        <p className={product.stock.inStock ? styles.stockIn : styles.stockOut}>{product.stock.inStock ? t('shop.card.inStock') : t('shop.card.outOfStock')}</p>
        <Link href={product.href} className={styles.cardMore}>
          <svg className={styles.cardMoreIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 4h2.2l2.2 11.2a1.5 1.5 0 001.5 1.2h8.6a1.5 1.5 0 001.5-1.1L21 8H6.2" />
            <circle cx="9.5" cy="20" r="1.3" />
            <circle cx="17.5" cy="20" r="1.3" />
          </svg>
          {product.stock.inStock ? t('shop.card.view') : t('shop.card.details')}
          <span className={styles.hidden}>{product.name}</span>
        </Link>
      </div>
    </article>
  )
}

/** 'shop': the listing beside its filters, 2 to 5 across; 'list': one product to a row. */
export const ProductGrid = ({ products, wide = false, layout }: { products: readonly Card[]; wide?: boolean; layout?: 'shop' | 'list' }) => (
  <ul className={layout === 'list' ? styles.gridList : layout === 'shop' ? styles.gridShop : wide ? styles.gridWide : styles.grid}>
    {products.map((p) => (
      <li key={p.id} className={styles.cell}>
        <ProductCard product={p} row={layout === 'list'} />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.grid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={styles.cell}>
        <div className={styles.skeletonPicture} />
        <div className={styles.skeletonLine} />
      </li>
    ))}
  </ul>
)
