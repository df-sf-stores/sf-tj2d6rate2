import type { ReactNode } from 'react'
import { Image, Link, ThemeImage, useCollections, useListing, useProducts, useStorefront, type CollectionCard, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { HeroCarousel, type HeroSlide } from '../components/interactive/HeroCarousel'
import { Layout } from '../components/Layout'
import { ProductCard } from '../components/ProductCard'
import { cx } from '../components/cx'
import { slugOf } from '../components/slugOf'
import art from '../styles/art.module.css'
import shop from '../styles/shop.module.css'
import styles from '../styles/home.module.css'

/** The departments the theme has artwork for, matched to the store's own collections by name. */
type Department = 'mobiles' | 'cameras' | 'fashion' | 'accessories'
const departments: { key: Department; match: RegExp }[] = [
  { key: 'mobiles', match: /mobile|phone/i },
  { key: 'cameras', match: /camera|photo/i },
  { key: 'fashion', match: /fashion|apparel|cloth/i },
  { key: 'accessories', match: /accessor|gadget/i },
]
const departmentOf = (c: CollectionCard): Department | null => departments.find((d) => d.match.test(c.name) || d.match.test(c.href))?.key ?? null
const allProducts = '/collections/all/'
const bestKind: Department | 'bestseller' = 'bestseller'
const isEverything = (c: CollectionCard) => /all/i.test(slugOf(c)) && !departmentOf(c)

/** A department's tall picture for the category cards; the store's own collection picture where the theme has none. */
const CategoryPicture = ({ kind, collection }: { kind: Department | null; collection: CollectionCard }) => {
  const sizes = '(min-width: 1100px) 240px, (min-width: 640px) 30vw, 44vw'
  if (kind === 'mobiles') return <ThemeImage src="cat-mobiles.webp" alt="" ratio={0.75} sizes={sizes} className={styles.categoryImage} />
  if (kind === 'cameras') return <ThemeImage src="cat-cameras.webp" alt="" ratio={0.75} sizes={sizes} className={styles.categoryImage} />
  if (kind === 'fashion') return <ThemeImage src="cat-fashion.webp" alt="" ratio={0.75} sizes={sizes} className={styles.categoryImage} />
  if (kind === 'accessories') return <ThemeImage src="cat-accessories.webp" alt="" ratio={0.75} sizes={sizes} className={styles.categoryImage} />
  return collection.image ? <Image image={collection.image} alt="" ratio={0.75} sizes={sizes} className={styles.categoryImage} /> : null
}

/** A section's square poster beside its products. */
const Poster = ({ kind }: { kind: Department | 'bestseller' }) => {
  const sizes = '(min-width: 900px) 20vw, 100vw'
  if (kind === 'mobiles') return <ThemeImage src="poster-mobiles.webp" alt="" ratio={1} sizes={sizes} className={styles.posterImage} />
  if (kind === 'cameras') return <ThemeImage src="poster-cameras.webp" alt="" ratio={1} sizes={sizes} className={styles.posterImage} />
  if (kind === 'fashion') return <ThemeImage src="poster-fashion.webp" alt="" ratio={1} sizes={sizes} className={styles.posterImage} />
  if (kind === 'accessories') return <ThemeImage src="poster-accessories.webp" alt="" ratio={1} sizes={sizes} className={styles.posterImage} />
  return <ThemeImage src="poster-bestseller.webp" alt="" ratio={1} sizes={sizes} className={styles.posterImage} />
}

const ArrowIcon = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Benefit = ({ title, body, tone, children }: { title: string; body: string; tone: string | undefined; children: ReactNode }) => (
  <li className={styles.benefit}>
    <span className={cx(styles.benefitIcon, tone)} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <span className={styles.benefitText}>
      <h3 className={styles.benefitTitle}>{title}</h3>
      <p className={styles.benefitBody}>{body}</p>
    </span>
  </li>
)

const Heading = ({ name, collection, action }: { name: string; collection?: CollectionCard | undefined; action: string }) => (
  <div className={styles.sectionBar}>
    <h2 className={styles.sectionTitle}>{name}</h2>
    <Link href={collection?.href ?? allProducts} className={styles.viewAll}>
      {action}
      <ArrowIcon />
    </Link>
  </div>
)

/** Grey cards in the shape the products arrive in, so nothing below moves when they do. */
const Placeholder = ({ label, count }: { label: string; count: number }) => (
  <ul className={styles.products} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={styles.productCell}>
        <div className={shop.skeletonPicture} />
        <div className={shop.skeletonLine} />
      </li>
    ))}
  </ul>
)

/** A titled row: the poster, then up to four of the products, the poster's side alternating down the page. */
const Showcase = ({ name, collection, kind, items, busy, flip }: { name: string; collection?: CollectionCard | undefined; kind: Department | 'bestseller'; items: readonly Card[]; busy: boolean; flip: boolean }) => {
  const { t } = useStorefront()
  const href = collection?.href ?? allProducts
  if (!busy && !items.length) return null
  return (
    <section className={styles.section}>
      <Heading name={name} collection={collection} action={t('home.viewAll')} />
      <div className={cx(styles.showcase, flip && styles.showcaseFlip)}>
        <Link href={href} className={styles.poster}>
          <Poster kind={kind} />
          <span className={styles.hidden}>{t('home.shopTitle', { name })}</span>
        </Link>
        {busy ? (
          <Placeholder label={t('shop.listing.loading')} count={4} />
        ) : (
          <ul className={styles.products}>
            {items.slice(0, 4).map((product) => (
              <li key={product.id} className={styles.productCell}>
                <ProductCard product={product} />
              </li>
            ))}
            {items.length < 4 ? (
              <li className={cx(styles.explore, items.length === 1 && styles.exploreWide, items.length === 2 && styles.exploreHalf)}>
                <span className={styles.exploreIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" />
                  </svg>
                </span>
                <p className={styles.exploreTitle}>{t('home.explore.title', { name: collection?.name ?? name })}</p>
                <p className={styles.exploreBody}>{t('home.explore.body')}</p>
                <span className={styles.exploreActions}>
                  <Link href={href} className={styles.exploreButton}>
                    {t('home.explore.collection')}
                  </Link>
                  <Link href={allProducts} className={styles.exploreGhost}>
                    {t('home.explore.all')}
                  </Link>
                </span>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </section>
  )
}

/** One department's showcase, from the store's matching collection. */
const DepartmentShowcase = ({ collection, kind, flip }: { collection: CollectionCard; kind: Department; flip: boolean }) => {
  const { t } = useStorefront()
  const { items, status } = useListing({ collection: slugOf(collection) })
  const titles: Record<Department, string> = { mobiles: t('home.sections.mobiles'), cameras: t('home.sections.cameras'), fashion: t('home.sections.fashion'), accessories: t('home.sections.accessories') }
  return <Showcase name={titles[kind]} collection={collection} kind={kind} items={items} busy={status === 'loading'} flip={flip} />
}

export const HomePage = () => {
  const { t } = useStorefront()
  const { collections, status } = useCollections({ first: 20 })
  const featured = useProducts({ sort: 'newest', first: 8 })
  const best = useProducts({ sort: 'best-selling', first: 4 })
  const find = (kind: Department) => collections.find((c) => departmentOf(c) === kind)
  const hrefOf = (kind: Department) => find(kind)?.href ?? allProducts
  const banner = '(min-width: 1520px) 1520px, 100vw'
  const slides: HeroSlide[] = [
    { key: 'welcome', href: allProducts, label: t('home.hero.welcome'), picture: <ThemeImage src="hero-welcome.webp" alt="" ratio={1520 / 500} sizes={banner} className={styles.banner} /> },
    ...(find('mobiles') ? [{ key: 'mobiles', href: hrefOf('mobiles'), label: t('home.hero.mobiles'), picture: <ThemeImage src="hero-mobiles.webp" alt="" ratio={1520 / 500} sizes={banner} className={styles.banner} /> }] : []),
    { key: 'cameras', href: hrefOf('cameras'), label: t('home.hero.cameras'), picture: <ThemeImage src="hero-cameras.webp" alt="" ratio={1520 / 500} sizes={banner} className={styles.banner} /> },
    { key: 'fashion', href: hrefOf('fashion'), label: t('home.hero.fashion'), picture: <ThemeImage src="hero-fashion.webp" alt="" ratio={1520 / 500} sizes={banner} className={styles.banner} /> },
    { key: 'accessories', href: hrefOf('accessories'), label: t('home.hero.accessories'), picture: <ThemeImage src="hero-accessories.webp" alt="" ratio={1520 / 500} sizes={banner} className={styles.banner} /> },
  ]
  // "All products" leads the category row, then the departments in the theme's order, then any other collection.
  const ordered = [...collections].sort((a, b) => {
    const rank = (c: CollectionCard) => (isEverything(c) ? -1 : departments.findIndex((d) => d.key === departmentOf(c)) + (departmentOf(c) ? 0 : 99))
    return rank(a) - rank(b)
  })
  const shown = departments.map((d) => ({ kind: d.key, collection: find(d.key) })).filter((d): d is { kind: Department; collection: CollectionCard } => d.collection !== undefined)
  // Best sellers fall back to the newest products while the store has no sales to rank.
  const bestItems = best.products.length ? best.products : featured.products
  const bestLoading = best.status === 'loading' || (!best.products.length && featured.status === 'loading')
  return (
    <Layout>
      <h1 className={styles.hidden}>{t('home.title')}</h1>
      <HeroCarousel
        slides={slides}
        labels={{ region: t('home.hero.region'), role: t('home.hero.role'), previous: t('home.hero.previous'), next: t('home.hero.next'), pause: t('home.hero.pause'), play: t('home.hero.play'), goTo: (n) => t('home.hero.goTo', { n }) }}
      />

      <section className={styles.trust}>
        <h2 className={styles.hidden}>{t('home.trust.title')}</h2>
        <ul className={styles.trustList}>
          <Benefit title={t('home.trust.secure.title')} body={t('home.trust.secure.body')} tone={styles.toneOrange}>
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
          </Benefit>
          <Benefit title={t('home.trust.curated.title')} body={t('home.trust.curated.body')} tone={styles.toneBlue}>
            <path d="M3 4h2.2l2.2 11.2a1.5 1.5 0 001.5 1.2h8.6a1.5 1.5 0 001.5-1.1L21 8H6.2M9.5 20h.01M17.5 20h.01" />
          </Benefit>
          <Benefit title={t('home.trust.delivery.title')} body={t('home.trust.delivery.body')} tone={styles.toneNavy}>
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.6 1.6 0 100-.1M17 19a1.6 1.6 0 100-.1" />
          </Benefit>
          <Benefit title={t('home.trust.replace.title')} body={t('home.trust.replace.body')} tone={styles.tonePurple}>
            <path d="M4 12a8 8 0 0113.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 01-13.7 5.6L4 15M4 20v-5h5" />
          </Benefit>
        </ul>
      </section>

      {status === 'loading' || ordered.length ? (
        <section className={styles.section}>
          <div className={styles.sectionBar}>
            <h2 className={styles.sectionTitle}>{t('home.categories.title')}</h2>
          </div>
          <ul className={styles.categories} aria-busy={status === 'loading'}>
            {status === 'loading'
              ? [0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className={styles.categoryCell}>
                    <span className={styles.categorySkeleton} />
                  </li>
                ))
              : ordered.map((c) => (
                  <li key={c.id} className={styles.categoryCell}>
                    <Link href={c.href} className={cx(styles.category, art.art, art.stone)}>
                      <CategoryPicture kind={departmentOf(c)} collection={c} />
                      <span className={styles.categoryShade} />
                      <span className={styles.categoryText}>
                        <span className={styles.categoryName}>{c.name}</span>
                        <span className={styles.categoryMore}>
                          {t('home.categories.shop')}
                          <ArrowIcon />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.section}>
        <Heading name={t('home.featured')} action={t('home.viewAll')} />
        {featured.status === 'loading' ? (
          <Placeholder label={t('shop.listing.loading')} count={4} />
        ) : featured.products.length ? (
          <ul className={styles.featured}>
            {featured.products.map((product) => (
              <li key={product.id} className={styles.productCell}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>{t('home.featuredEmpty')}</p>
        )}
      </section>

      <Showcase name={t('home.sections.best')} kind={bestKind} items={bestItems} busy={bestLoading} flip={false} />
      {shown.map((d, index) => (
        <DepartmentShowcase key={d.collection.id} collection={d.collection} kind={d.kind} flip={index % 2 === 0} />
      ))}

      <section className={styles.why}>
        <div className={styles.whyInner}>
          <div className={styles.whyHead}>
            <p className={styles.eyebrow}>{t('home.why.eyebrow')}</p>
            <h2 className={styles.whyTitle}>{t('home.why.title')}</h2>
            <p className={styles.whyLead}>{t('home.why.lead')}</p>
          </div>
          <ul className={styles.whyGrid}>
            <li className={styles.whyCard}>
              <span className={styles.whyIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />
                </svg>
              </span>
              <h3 className={styles.whyCardTitle}>{t('home.why.brands.title')}</h3>
              <p className={styles.whyCardBody}>{t('home.why.brands.body')}</p>
            </li>
            <li className={styles.whyCard}>
              <span className={styles.whyIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.6 1.6 0 100-.1M17 19a1.6 1.6 0 100-.1" />
                </svg>
              </span>
              <h3 className={styles.whyCardTitle}>{t('home.why.delivery.title')}</h3>
              <p className={styles.whyCardBody}>{t('home.why.delivery.body')}</p>
            </li>
            <li className={styles.whyCard}>
              <span className={styles.whyIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
                </svg>
              </span>
              <h3 className={styles.whyCardTitle}>{t('home.why.secure.title')}</h3>
              <p className={styles.whyCardBody}>{t('home.why.secure.body')}</p>
            </li>
            <li className={styles.whyCard}>
              <span className={styles.whyIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 16v1a3 3 0 01-3 3h-2" />
                </svg>
              </span>
              <h3 className={styles.whyCardTitle}>{t('home.why.support.title')}</h3>
              <p className={styles.whyCardBody}>{t('home.why.support.body')}</p>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.signup}>
        <div className={styles.signupInner}>
          <div className={styles.signupCopy}>
            <h2 className={styles.signupTitle}>{t('home.signup.title')}</h2>
            <p className={styles.signupBody}>{t('home.signup.body')}</p>
          </div>
          <div className={styles.signupActions}>
            <Link href="/register/" className={styles.signupButton}>
              {t('home.signup.action')}
            </Link>
            <Link href="/collections/all/" className={styles.signupGhost}>
              {t('home.signup.browse')}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
