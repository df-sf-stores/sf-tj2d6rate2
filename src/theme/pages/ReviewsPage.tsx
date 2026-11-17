import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import policy from '../styles/policy.module.css'
import styles from '../styles/extra.module.css'

/** Customer reviews: an invitation to share feedback, without inventing any. */
export const ReviewsPage = () => {
  const { t } = useStorefront()
  return (
    <Layout>
      <header className={policy.band}>
        <h1 className={policy.title}>{t('pages.reviews.title')}</h1>
        <span className={policy.rule} />
        <p className={policy.bandLead}>{t('pages.reviews.lead')}</p>
      </header>
      <div className={styles.page}>
        <section className={styles.panel}>
          <span className={styles.panelIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />
            </svg>
          </span>
          <div className={styles.panelCopy}>
            <h2 className={styles.panelTitle}>{t('pages.reviews.share.title')}</h2>
            <p className={styles.panelBody}>{t('pages.reviews.share.body')}</p>
          </div>
          <div className={styles.actions}>
            <Link href="/contact/" className={styles.primary}>
              {t('pages.reviews.share.action')}
            </Link>
            <Link href="/account/orders/" className={styles.secondary}>
              {t('pages.reviews.share.orders')}
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
