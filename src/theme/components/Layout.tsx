import type { ReactNode } from 'react'
import { ConsentBanner, Link, navigate, PoweredBy, PreviewBanner, SearchField, StoreLogo, useCart, useCollections, useMenu, useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { Menu } from './interactive/Menu'
import { NavItem } from './interactive/NavItem'
import { aboutHref, useAboutPages } from './aboutPages'
import { cx } from './cx'
import styles from '../styles/layout.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

const Chevron = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

/** The marks for the social networks the store lists in its Site settings; any other network shows its name. */
const SocialMark = ({ network }: { network: string }) => {
  if (network === 'instagram')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
      </svg>
    )
  if (network === 'facebook')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" />
      </svg>
    )
  if (network === 'whatsapp')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
      </svg>
    )
  if (network === 'youtube')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 00-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z" />
      </svg>
    )
  if (network === 'x')
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z" />
      </svg>
    )
  return <span className={styles.socialName}>{network}</span>
}

export const Layout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const about = useAboutPages()
  const menu = useMenu()
  // `first: 20` matches the home page's request, so both share one answer.
  const { collections: fetched, status } = useCollections({ first: 20 })
  const collections = status === 'ready' ? fetched : []
  const { count } = useCart()
  const { count: wished } = useWishlist()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  const place = [store.address?.city, store.address?.region, store.address?.postal].filter(Boolean).join(', ')
  return (
    <div className={styles.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <div className={styles.strip}>
        <ul className={styles.stripList}>
          <li className={styles.stripItem}>
            <svg className={styles.stripIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.6 1.6 0 100-.1M17 19a1.6 1.6 0 100-.1" />
            </svg>
            {t('common.strip.delivery')}
          </li>
          <li className={styles.stripItem}>
            <svg className={styles.stripIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 12a8 8 0 0113.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 01-13.7 5.6L4 15M4 20v-5h5" />
            </svg>
            {t('common.strip.replacement')}
          </li>
          <li className={styles.stripItem}>
            <svg className={styles.stripIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
            </svg>
            {t('common.strip.secure')}
          </li>
        </ul>
      </div>
      <div className={styles.sticky}>
        <header className={styles.header}>
          <div className={styles.bar}>
            <Link href="/" className={styles.brand}>
              <StoreLogo className={styles.logo} />
            </Link>
            <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
            <div className={styles.tools}>
              <Link href="/account/" className={styles.account}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="12" cy="8.5" r="3.8" />
                  <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
                </svg>
                <span className={styles.accountLabel}>{t('common.tools.account')}</span>
              </Link>
              <Link href="/account/wishlist/" className={styles.tool}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />
                </svg>
                <span className={styles.hidden}>{wished > 0 ? t('common.tools.wishlistCount', { count: wished }) : t('common.tools.wishlist')}</span>
                {wished > 0 ? (
                  <span className={styles.count} aria-hidden="true">
                    {wished}
                  </span>
                ) : null}
              </Link>
              <Link href="/cart/" className={styles.tool}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M3 4h2.2l2.2 11.2a1.5 1.5 0 001.5 1.2h8.6a1.5 1.5 0 001.5-1.1L21 8H6.2" />
                  <circle cx="9.5" cy="20" r="1.3" />
                  <circle cx="17.5" cy="20" r="1.3" />
                </svg>
                <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}</span>
                {count > 0 ? (
                  <span className={styles.count} aria-hidden="true">
                    {count}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>
        </header>
        <div className={styles.navBar}>
          <div className={styles.navInner}>
            <Menu label={t('common.nav.menu')}>
              <nav className={styles.nav} aria-label={t('common.nav.label')}>
                <Link href="/collections/all/" className={styles.departments}>
                  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" />
                  </svg>
                  {t('common.nav.departments')}
                </Link>
                <Link href="/" className={styles.navLink}>
                  {t('common.nav.home')}
                </Link>
                {menu.items.length ? (
                  menu.items.map((item) => <NavItem key={item.id} item={item} />)
                ) : (
                  <>
                    {collections
                      .filter((c) => c.href !== '/collections/all-products/')
                      .map((c) => (
                        <Link key={c.id} href={c.href} className={styles.navLink}>
                          {c.name}
                        </Link>
                      ))}
                    <Link href={aboutHref} className={styles.navLink}>
                      {t('common.nav.about')}
                    </Link>
                    <Link href="/contact/" className={styles.navLink}>
                      {t('common.nav.contact')}
                    </Link>
                  </>
                )}
              </nav>
            </Menu>
            <ul className={styles.chips}>
              <li>
                <Link href="/collections/all/" className={styles.chip}>
                  {t('common.nav.shopAll')}
                </Link>
              </li>
              {collections
                .filter((c) => c.href !== '/collections/all-products/')
                .map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className={styles.chip}>
                      {c.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.columns}>
          <div className={styles.about}>
            <Link href="/" className={styles.footerLogoLink}>
              <StoreLogo className={styles.footerLogo} />
            </Link>
            <p className={styles.tagline}>{store.tagline || t('common.footer.tagline')}</p>
            {store.social.length ? (
              <ul className={styles.social}>
                {store.social.map((s) => (
                  <li key={s.network}>
                    <Link href={s.url} className={cx(styles.socialLink, s.network === 'instagram' && styles.instagram, s.network === 'facebook' && styles.facebook, s.network === 'whatsapp' && styles.whatsappMark)}>
                      <SocialMark network={s.network} />
                      <span className={styles.hidden}>{t('common.footer.follow', { network: s.network })}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <nav className={styles.links} aria-label={t('common.footer.aboutHeading')}>
            <h2 className={styles.heading}>{t('common.footer.aboutHeading')}</h2>
            {about.map((page) => (
              <Link key={page.kind} href={page.href} className={styles.footerLink}>
                <Chevron />
                {page.label}
              </Link>
            ))}
          </nav>
          <nav className={styles.links} aria-label={t('common.footer.service')}>
            <h2 className={styles.heading}>{t('common.footer.service')}</h2>
            <Link href="/contact/" className={styles.footerLink}>
              <Chevron />
              {t('common.footer.contact')}
            </Link>
            <Link href="/bulk-buy/" className={styles.footerLink}>
              <Chevron />
              {t('common.footer.bulk')}
            </Link>
            <Link href="/account/" className={styles.footerLink}>
              <Chevron />
              {t('common.footer.account')}
            </Link>
            <Link href="/help/" className={styles.footerLink}>
              <Chevron />
              {t('common.footer.faq')}
            </Link>
          </nav>
          <nav className={styles.links} aria-label={t('common.footer.others')}>
            <h2 className={styles.heading}>{t('common.footer.others')}</h2>
            <Link href="/reviews/" className={styles.footerLink}>
              <Chevron />
              {t('common.footer.reviews')}
            </Link>
            <Link href="/bulk-buy/" className={styles.footerLink}>
              <Chevron />
              {t('common.footer.bulk')}
            </Link>
            {whatsapp ? (
              <Link href={whatsapp.url} className={styles.footerLink}>
                <Chevron />
                {t('common.footer.channel')}
              </Link>
            ) : null}
          </nav>
          <div className={styles.links}>
            <h2 className={styles.heading}>{t('common.footer.touch')}</h2>
            <div className={styles.contactRow}>
              <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              <div className={styles.contactText}>
                <p className={styles.contactStrong}>{store.name}</p>
                {store.address?.street ? <p className={styles.contact}>{store.address.street}</p> : null}
                {place ? <p className={styles.contact}>{place}</p> : null}
              </div>
            </div>
            {store.contactPhone ? (
              <div className={styles.contactRow}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 006.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 01-1.6 1.5C10.5 20 4 13.5 3.5 5.6A1.5 1.5 0 015 4z" />
                </svg>
                <div className={styles.contactText}>
                  <p className={styles.contactStrong}>
                    {t('common.footer.support')} {store.contactPhone}
                  </p>
                  <p className={styles.contact}>{t('common.footer.hours')}</p>
                </div>
              </div>
            ) : null}
            {store.contactEmail ? (
              <div className={styles.contactRow}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3.5 6l8.5 7 8.5-7" />
                </svg>
                <div className={styles.contactText}>
                  <p className={styles.contact}>{t('common.footer.email')}</p>
                  <p className={styles.contact}>{store.contactEmail}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.base}>
          <div className={styles.baseInner}>
            <p className={styles.copyright}>{t('common.footer.rights', { store: store.name })}</p>
            <PoweredBy brand={poweredBy} t={t} className={styles.powered} />
          </div>
        </div>
      </footer>
      {whatsapp ? (
        <Link href={whatsapp.url} className={styles.whatsapp}>
          <svg className={styles.whatsappIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3zm4.4 12.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
          <span className={styles.hidden}>{t('common.footer.whatsapp')}</span>
        </Link>
      ) : null}
      <ConsentBanner t={t} className={styles.consent} />
    </div>
  )
}
