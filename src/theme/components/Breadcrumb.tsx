import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { aboutHref } from './aboutPages'
import styles from '../styles/policy.module.css'

const Separator = () => (
  <svg className={styles.crumbSeparator} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

/** Home / About Us / the current page; on the About Us page itself, Home / About Us. */
export const Breadcrumb = ({ current }: { current?: string }) => {
  const { t } = useStorefront()
  return (
    <nav className={styles.crumbs} aria-label={t('pages.policy.breadcrumb')}>
      <ol className={styles.crumbList}>
        <li className={styles.crumb}>
          <Link href="/" className={styles.crumbLink}>
            {t('common.nav.home')}
          </Link>
        </li>
        <li className={styles.crumb}>
          <Separator />
          {current ? (
            <Link href={aboutHref} className={styles.crumbLink}>
              {t('common.footer.aboutHeading')}
            </Link>
          ) : (
            <span className={styles.crumbCurrent} aria-current="page">
              {t('common.footer.aboutHeading')}
            </span>
          )}
        </li>
        {current ? (
          <li className={styles.crumb}>
            <Separator />
            <span className={styles.crumbCurrent} aria-current="page">
              {current}
            </span>
          </li>
        ) : null}
      </ol>
    </nav>
  )
}
