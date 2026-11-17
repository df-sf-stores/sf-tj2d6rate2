import { Link, useStorefront } from '@dripfunnel/storefront-core/theme'
import styles from '../styles/policy.module.css'

/** "Still have questions?": the store's own email and phone from Site settings, and the way to the contact page. */
export const HelpPanel = () => {
  const { store, t } = useStorefront()
  return (
    <section className={styles.help}>
      <div className={styles.helpCard}>
        <div className={styles.helpCopy}>
          <span className={styles.helpIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4 13a8 8 0 0116 0M4 13v4a2 2 0 002 2h1v-6H4zM20 13v4a2 2 0 01-2 2h-1v-6h3zM17 19c0 1.5-2 2.5-5 2.5" />
            </svg>
          </span>
          <h2 className={styles.helpTitle}>{t('pages.policy.help.title')}</h2>
          <p className={styles.helpBody}>{t('pages.policy.help.body')}</p>
        </div>
        <div className={styles.helpSide}>
          <dl className={styles.helpDetails}>
            {store.contactEmail ? (
              <div className={styles.helpDetail}>
                <dt className={styles.helpTerm}>{t('pages.contact.email')}</dt>
                <dd className={styles.helpValue}>{store.contactEmail}</dd>
              </div>
            ) : null}
            {store.contactPhone ? (
              <div className={styles.helpDetail}>
                <dt className={styles.helpTerm}>{t('pages.contact.phone')}</dt>
                <dd className={styles.helpValue}>{store.contactPhone}</dd>
              </div>
            ) : null}
          </dl>
          <Link href="/contact/" className={styles.helpButton}>
            {t('pages.policy.help.action')}
          </Link>
        </div>
      </div>
    </section>
  )
}
