'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  Checkbox,
  Choices,
  Link,
  PriceRange,
  Select,
  TextField,
  navigate,
  useCollections,
  useLoadOnScroll,
  useLocation,
  useStorefront,
  type Facet,
  type Listing,
  type ProductCard as Card,
  type SortKey,
} from '@dripfunnel/storefront-core/theme'
import { GridPlaceholder, ProductGrid, savingOf } from '../ProductCard'
import { Notice } from '../Notice'
import { Retry } from './Retry'
import { cx } from '../cx'
import shop from '../../styles/shop.module.css'
import styles from '../../styles/listing.module.css'

/*
 * Core's listing filters on the server: its facets (whatever filters the store has set up, such as a brand or a
 * colour), the price range and the sort, all kept in the address. The theme adds what the cards themselves say:
 * availability, the discount worked out from the compare-at price, and Z to A. Those sit in the same address
 * (stock=, off=, order=), which core keeps whenever it changes its own part, so a refresh, the back button and a
 * new sort all keep every filter.
 */

/** Pages loaded up front, so counts, availability, discounts and Z to A cover the whole listing. */
const loadAllUpTo = 240
const offs = [10, 20, 30, 50] as const
type Off = (typeof offs)[number]
type StockChoice = 'all' | 'in' | 'out'
type SortChoice = SortKey | 'name-desc'

/** Currencies without minor units; every other one has 100 to its major unit. */
const wholeCurrencies = new Set(['JPY', 'KRW', 'VND', 'CLP', 'ISK', 'UGX', 'PYG', 'XAF', 'XOF'])
const minorPer = (currency: string) => (wholeCurrencies.has(currency) ? 1 : 100)

/** The address with some query parameters changed or removed, the others kept exactly as written; a page cursor never survives. */
const withParams = (path: string, query: URLSearchParams, changes: Record<string, string | null>) => {
  const all: Record<string, string | null> = { after: null, before: null, ...changes }
  const kept = query
    .toString()
    .split('&')
    .filter((part) => part && !Object.hasOwn(all, part.split('=')[0] ?? ''))
  for (const [name, value] of Object.entries(all)) if (value) kept.push(`${name}=${value}`)
  return kept.length ? `${path}?${kept.join('&')}` : path
}

const Chevron = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const Cross = () => (
  <svg className={styles.chipIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
)

/** A collapsible filter group, open to begin with. */
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <details open className={styles.group}>
    <summary className={styles.groupHead}>
      {title}
      <Chevron />
    </summary>
    <div className={styles.groupBody}>{children}</div>
  </details>
)

/** One of the store's own filters; a long one, such as a list of brands, gets a search box. */
const FacetGroup = ({ facet, onToggle }: { facet: Facet; onToggle: (id: string) => void }) => {
  const { t } = useStorefront()
  const [term, setTerm] = useState('')
  const needle = term.trim().toLowerCase()
  const values = needle ? facet.values.filter((v) => v.selected || v.name.toLowerCase().includes(needle)) : facet.values
  return (
    <Group title={facet.name}>
      {facet.values.length > 8 ? <TextField label={t('shop.filters.searchIn', { name: facet.name })} value={term} onChange={setTerm} className={styles.field} /> : null}
      <div className={styles.options}>
        {values.map((value) => (
          <Checkbox key={value.id} checked={value.selected} onChange={() => onToggle(value.id)} className={styles.check}>
            <span className={styles.optionName}>{value.name}</span>
            <span className={styles.optionCount}>{value.count}</span>
          </Checkbox>
        ))}
        {values.length === 0 ? <p className={styles.quiet}>{t('shop.filters.noMatch')}</p> : null}
      </div>
    </Group>
  )
}

/** Minimum and maximum in whole units, applied together; the slider above sets the same range. */
const PriceInputs = ({ listing, currency }: { listing: Listing; currency: string }) => {
  const { t } = useStorefront()
  const per = minorPer(currency)
  const shown = (minor: string | null) => (minor === null ? '' : String(Math.round(Number(minor) / per)))
  const [min, setMin] = useState(shown(listing.priceRange.min))
  const [max, setMax] = useState(shown(listing.priceRange.max))
  const [wrong, setWrong] = useState(false)
  const read = (text: string) => {
    const clean = text.replace(/[^\d]/g, '')
    return clean ? Number(clean) : null
  }
  const apply = () => {
    const low = read(min)
    const high = read(max)
    if (low !== null && high !== null && low > high) return setWrong(true)
    setWrong(false)
    listing.setPriceRange({ min: low === null ? null : String(low * per), max: high === null ? null : String(high * per) })
  }
  const priced = listing.priceRange.min !== null || listing.priceRange.max !== null
  return (
    <div className={styles.priceInputs}>
      <div className={styles.priceFields}>
        <TextField label={t('shop.filters.min')} value={min} onChange={setMin} inputMode="numeric" maxLength={9} className={styles.field} />
        <TextField label={t('shop.filters.max')} value={max} onChange={setMax} inputMode="numeric" maxLength={9} className={styles.field} />
      </div>
      {wrong ? (
        <p className={styles.error} role="alert">
          {t('shop.filters.priceInvalid')}
        </p>
      ) : null}
      <div className={styles.priceActions}>
        <button type="button" className={styles.apply} onClick={apply}>
          {t('shop.filters.apply')}
        </button>
        {priced ? (
          <button type="button" className={styles.textButton} onClick={() => listing.setPriceRange({ min: null, max: null })}>
            {t('shop.filters.clearPrice')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

/** The collections as categories, each its own listing; only on a collection page, never in search results. */
const Categories = () => {
  const { t } = useStorefront()
  const { path } = useLocation()
  const { collections } = useCollections({ first: 20 })
  const links = [{ id: 'all', href: '/collections/all/', name: t('shop.filters.allProducts') }, ...collections.filter((c) => c.href !== '/collections/all-products/')]
  const here = (href: string) => path === href || `${path}/` === href || (href === '/collections/all/' && path.startsWith('/collections/all-products'))
  return (
    <Group title={t('shop.filters.category')}>
      <ul className={styles.categories}>
        {links.map((c) => (
          <li key={c.id}>
            <Link href={c.href} className={cx(styles.category, here(c.href) && styles.categoryCurrent)}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </Group>
  )
}

/** A collection's or a search's products: the filter sidebar (a drawer on phones), the toolbar, chips and the grid. */
export const ShopListing = ({ listing, browse }: { listing: Listing; browse: boolean }) => {
  const { store, t, locale } = useStorefront()
  const { path, query } = useLocation()
  const [open, setOpen] = useState(false)
  const offLabel = (o: Off) => (o === 10 ? t('shop.filters.off10') : o === 20 ? t('shop.filters.off20') : o === 30 ? t('shop.filters.off30') : t('shop.filters.off50'))
  const go = (changes: Record<string, string | null>) => navigate(withParams(path, query, changes))

  const stockParam = query.get('stock')
  const stock: StockChoice = stockParam === 'in' || stockParam === 'out' ? stockParam : 'all'
  const off: Off | null = offs.find((o) => String(o) === query.get('off')) ?? null
  const reversed = listing.sort === 'name' && query.get('order') === 'za'
  const list = query.get('view') === 'list'

  // Every page up to the cap, one after another, so the counts and the theme's own filters see the whole listing.
  const { status, hasMore, loadingMore, moreFailed, items, fetchMore } = listing
  useEffect(() => {
    if (status === 'ready' && hasMore && !loadingMore && !moreFailed && items.length < loadAllUpTo) fetchMore()
  }, [status, hasMore, loadingMore, moreFailed, items.length, fetchMore])
  const complete = !hasMore

  const stockFits = (p: Card) => stock === 'all' || (stock === 'in') === p.stock.inStock
  const offFits = (p: Card) => off === null || (savingOf(p) ?? 0) >= off
  const matching = items.filter((p) => stockFits(p) && offFits(p))
  const products = reversed ? [...matching].reverse() : matching

  const forStock = items.filter(offFits)
  const inStock = forStock.filter((p) => p.stock.inStock).length
  const forOff = items.filter(stockFits)
  const discounted = items.some((p) => savingOf(p) !== null)

  const priced = listing.priceRange.min !== null || listing.priceRange.max !== null
  const active = listing.selected.length + Number(priced) + Number(stock !== 'all') + Number(off !== null)
  const per = minorPer(store.currency)
  const money = (minor: string) => Math.round(Number(minor) / per).toLocaleString(locale)
  const { min, max } = listing.priceRange
  const priceChip = min !== null && max !== null ? t('shop.filters.priceBetween', { min: money(min), max: money(max) }) : min !== null ? t('shop.filters.priceFrom', { min: money(min) }) : max !== null ? t('shop.filters.priceUpTo', { max: money(max) }) : ''

  const sortLabels: Record<SortChoice, string> = {
    featured: t('shop.listing.sorts.featured'),
    newest: t('shop.listing.sorts.newest'),
    'price-low': t('shop.listing.sorts.priceLow'),
    'price-high': t('shop.listing.sorts.priceHigh'),
    name: t('shop.listing.sorts.name'),
    'name-desc': t('shop.listing.sorts.nameDesc'),
  }
  const sortChoices: SortChoice[] = [...listing.sorts, 'name-desc']
  const sortValue: SortChoice = reversed ? 'name-desc' : listing.sort
  const setSort = (choice: SortChoice) => go({ sort: choice === 'featured' ? null : choice === 'name-desc' ? 'name' : choice, order: choice === 'name-desc' ? 'za' : null })
  const clearAll = () => go({ filter: null, price: null, stock: null, off: null })

  const ready = status === 'ready'
  const countText = complete ? t('shop.filters.count', { count: products.length }) : t('shop.filters.countMore', { count: products.length })
  const hasFilters = listing.facets.length > 0 || listing.priceBounds !== null || items.length > 0

  return (
    <div className={styles.listing}>
      {open ? <button type="button" className={styles.backdrop} aria-label={t('shop.filters.close')} tabIndex={-1} onClick={() => setOpen(false)} /> : null}
      {hasFilters || browse ? (
        <aside
          id="shop-filters"
          className={cx(styles.sidebar, open && styles.sidebarOpen)}
          aria-label={t('shop.filters.title')}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
        >
          <div className={styles.drawerHead}>
            <p className={styles.drawerTitle}>{t('shop.filters.title')}</p>
            <button type="button" className={styles.close} onClick={() => setOpen(false)}>
              <Cross />
              <span className={shop.hidden}>{t('shop.filters.close')}</span>
            </button>
          </div>
          <div className={styles.sideHead}>
            <p className={styles.sideTitle}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              {t('shop.filters.title')}
            </p>
            {active ? (
              <button type="button" className={styles.textButton} onClick={clearAll}>
                {t('shop.filters.clearAll')}
              </button>
            ) : null}
          </div>
          <div className={styles.groups}>
            {browse ? <Categories /> : null}
            {listing.priceBounds ? (
              <Group title={t('shop.filters.price')}>
                <PriceRange
                  bounds={listing.priceBounds}
                  value={listing.priceRange}
                  onChange={listing.setPriceRange}
                  label={t('shop.filters.price')}
                  className={shop.priceRange}
                  parts={{ track: shop.priceTrack, rail: shop.priceRail, fill: shop.priceFill, tick: shop.priceTick, thumb: shop.priceThumb, ends: styles.priceEnds, select: shop.priceSelect, to: shop.priceTo }}
                />
                <PriceInputs key={`${min}-${max}`} listing={listing} currency={store.currency} />
              </Group>
            ) : null}
            {listing.facets.map((facet) => (
              <FacetGroup key={facet.id} facet={facet} onToggle={listing.toggle} />
            ))}
            {items.length ? (
              <Group title={t('shop.filters.availability')}>
                <Choices
                  legend={t('shop.filters.availability')}
                  value={stock}
                  options={[
                    { value: 'all', content: <span className={styles.optionName}>{t('shop.filters.anyStock')}</span> },
                    {
                      value: 'in',
                      content: (
                        <>
                          <span className={styles.optionName}>{t('shop.filters.inStock')}</span>
                          <span className={styles.optionCount}>{inStock}</span>
                        </>
                      ),
                    },
                    {
                      value: 'out',
                      content: (
                        <>
                          <span className={styles.optionName}>{t('shop.filters.outOfStock')}</span>
                          <span className={styles.optionCount}>{forStock.length - inStock}</span>
                        </>
                      ),
                    },
                  ]}
                  onChange={(v) => go({ stock: v === 'all' ? null : v })}
                  className={styles.choices}
                  optionClassName={styles.choice}
                  chosenClassName={cx(styles.choice, styles.choiceOn)}
                />
              </Group>
            ) : null}
            {discounted ? (
              <Group title={t('shop.filters.discount')}>
                <Choices
                  legend={t('shop.filters.discount')}
                  value={off === null ? 'any' : String(off)}
                  options={[
                    { value: 'any', content: <span className={styles.optionName}>{t('shop.filters.anyDiscount')}</span> },
                    ...offs.map((o) => ({
                      value: String(o),
                      content: (
                        <>
                          <span className={styles.optionName}>{offLabel(o)}</span>
                          <span className={styles.optionCount}>{forOff.filter((p) => (savingOf(p) ?? 0) >= o).length}</span>
                        </>
                      ),
                    })),
                  ]}
                  onChange={(v) => go({ off: v === 'any' ? null : v })}
                  className={styles.choices}
                  optionClassName={styles.choice}
                  chosenClassName={cx(styles.choice, styles.choiceOn)}
                />
              </Group>
            ) : null}
          </div>
          <div className={styles.drawerFoot}>
            <button type="button" className={styles.drawerClear} onClick={clearAll} disabled={!active}>
              {t('shop.filters.clearAll')}
            </button>
            <button type="button" className={styles.drawerApply} onClick={() => setOpen(false)}>
              {t('shop.filters.show', { count: products.length })}
            </button>
          </div>
        </aside>
      ) : null}

      <div className={styles.results}>
        <h2 className={shop.hidden}>{t('shop.listing.heading')}</h2>
        <div className={styles.toolbar}>
          <div className={styles.summary}>
            <p className={styles.count} role="status">
              {ready ? countText : t('shop.listing.loading')}
            </p>
            {active ? <span className={styles.activeCount}>{t('shop.filters.active', { count: active })}</span> : null}
          </div>
          <div className={styles.tools}>
            <button type="button" className={styles.filterButton} aria-expanded={open} aria-controls="shop-filters" onClick={() => setOpen(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              {t('shop.filters.title')}
              {active ? <span className={styles.badge}>{active}</span> : null}
            </button>
            <Select label={t('shop.listing.sort')} value={sortValue} options={sortChoices.map((s) => ({ value: s, label: sortLabels[s] }))} onChange={setSort} className={styles.sort} />
            <div className={styles.views} role="group" aria-label={t('shop.filters.view')}>
              <button type="button" className={cx(styles.view, !list && styles.viewOn)} aria-pressed={!list} onClick={() => go({ view: null })}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                </svg>
                <span className={shop.hidden}>{t('shop.filters.grid')}</span>
              </button>
              <button type="button" className={cx(styles.view, list && styles.viewOn)} aria-pressed={list} onClick={() => go({ view: 'list' })}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 5h4v4H4zM11 7h9M4 15h4v4H4zM11 17h9" />
                </svg>
                <span className={shop.hidden}>{t('shop.filters.list')}</span>
              </button>
            </div>
          </div>
        </div>

        {active ? (
          <div className={styles.chips}>
            {listing.selected.map((s) => (
              <button key={s.id} type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: s.name })} onClick={() => listing.toggle(s.id)}>
                {s.name}
                <Cross />
              </button>
            ))}
            {priced ? (
              <button type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: priceChip })} onClick={() => listing.setPriceRange({ min: null, max: null })}>
                {priceChip}
                <Cross />
              </button>
            ) : null}
            {stock !== 'all' ? (
              <button type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: stock === 'in' ? t('shop.filters.inStock') : t('shop.filters.outOfStock') })} onClick={() => go({ stock: null })}>
                {stock === 'in' ? t('shop.filters.inStock') : t('shop.filters.outOfStock')}
                <Cross />
              </button>
            ) : null}
            {off !== null ? (
              <button type="button" className={styles.chip} aria-label={t('shop.listing.remove', { name: offLabel(off) })} onClick={() => go({ off: null })}>
                {offLabel(off)}
                <Cross />
              </button>
            ) : null}
            <button type="button" className={styles.clearAll} onClick={clearAll}>
              {t('shop.filters.clearAll')}
            </button>
          </div>
        ) : null}

        {status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={8} /> : null}
        {status === 'error' ? (
          <Notice title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={listing.retry} />
          </Notice>
        ) : null}
        {ready && products.length === 0 ? (
          active ? (
            <Notice title={t('shop.listing.empty')} lead={t('shop.listing.emptyLead')}>
              <Retry label={t('shop.filters.clearAll')} onRetry={clearAll} />
            </Notice>
          ) : complete ? (
            <Notice title={t('shop.collection.empty')} lead={t('shop.collection.emptyLead')}>
              <Link href="/collections/all/" className={shop.secondary}>
                {t('shop.collection.browse')}
              </Link>
            </Notice>
          ) : null
        ) : null}
        {ready ? <ProductGrid products={products} layout={list ? 'list' : 'shop'} /> : null}
        <MoreOnScroll listing={listing} />
      </div>
    </div>
  )
}

/** Past the pages loaded up front, the next loads as the end of the grid nears the screen; a page that didn't load offers a retry. */
export const MoreOnScroll = ({ listing }: { listing: Listing }) => {
  const { t } = useStorefront()
  const end = useLoadOnScroll(listing)
  return (
    <div ref={end} className={shop.more}>
      {listing.loadingMore ? (
        <p className={shop.muted} role="status">
          {t('shop.listing.loadingMore')}
        </p>
      ) : null}
      {listing.moreFailed ? (
        <>
          <p className={shop.muted} role="alert">
            {t('shop.listing.moreFailed')}
          </p>
          <button type="button" className={shop.secondary} onClick={listing.fetchMore}>
            {t('shop.listing.retry')}
          </button>
        </>
      ) : null}
    </div>
  )
}
