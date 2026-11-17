import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Layout } from '../components/Layout'
import policy from '../styles/policy.module.css'
import styles from '../styles/extra.module.css'

/** Bulk and business orders: how it works, and the store's own contact details from Site settings. */
export const BulkBuyPage = () => {
  const { store, t } = useStorefront()
  return (
    <Layout>
      <header className={policy.band}>
        <h1 className={policy.title}>{t('pages.bulk.title')}</h1>
        <span className={policy.rule} />
        <p className={policy.bandLead}>{t('pages.bulk.lead')}</p>
      </header>
      <div className={styles.page}>
        <ol className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepNumber} aria-hidden="true" />
            <h2 className={styles.stepTitle}>{t('pages.bulk.share.title')}</h2>
            <p className={styles.stepBody}>{t('pages.bulk.share.body')}</p>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber} aria-hidden="true" />
            <h2 className={styles.stepTitle}>{t('pages.bulk.quote.title')}</h2>
            <p className={styles.stepBody}>{t('pages.bulk.quote.body')}</p>
          </li>
          <li className={styles.step}>
            <span className={styles.stepNumber} aria-hidden="true" />
            <h2 className={styles.stepTitle}>{t('pages.bulk.deliver.title')}</h2>
            <p className={styles.stepBody}>{t('pages.bulk.deliver.body')}</p>
          </li>
        </ol>
        <section className={styles.panel}>
          <div className={styles.panelCopy}>
            <h2 className={styles.panelTitle}>{t('pages.bulk.reach.title')}</h2>
            <p className={styles.panelBody}>{t('pages.bulk.reach.body')}</p>
          </div>
          <dl className={styles.details}>
            {store.contactPhone ? (
              <div className={styles.detail}>
                <dt className={styles.term}>{t('pages.contact.phone')}</dt>
                <dd className={styles.value}>{store.contactPhone}</dd>
              </div>
            ) : null}
            {store.contactEmail ? (
              <div className={styles.detail}>
                <dt className={styles.term}>{t('pages.contact.email')}</dt>
                <dd className={styles.value}>{store.contactEmail}</dd>
              </div>
            ) : null}
          </dl>
          <div className={styles.actions}>
            <Link href="/contact/" className={styles.primary}>
              {t('pages.bulk.reach.action')}
            </Link>
            <Link href="/collections/all/" className={styles.secondary}>
              {t('pages.bulk.reach.browse')}
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
