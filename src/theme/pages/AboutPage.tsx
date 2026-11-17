import type { ReactNode } from 'react'
import { Link, ThemeImage, useCollections, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Breadcrumb } from '../components/Breadcrumb'
import { Layout } from '../components/Layout'
import styles from '../styles/about.module.css'

const allProducts = '/collections/all/'

/** A card with a line-icon, a title and a sentence: the reasons to shop here and the commitments. */
const Feature = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.feature}>
    <span className={styles.featureIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureBody}>{body}</p>
  </li>
)

const Arrow = () => (
  <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const AboutPage = () => {
  const { store, t } = useStorefront()
  const vars = { store: store.name }
  // The departments the store really has, so "Shop our departments" never names one it doesn't.
  const { collections } = useCollections({ first: 20 })
  const departments = collections.filter((c) => c.href !== '/collections/all-products/').slice(0, 6)
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Breadcrumb />
            <p className={styles.heroEyebrow}>{t('pages.about.eyebrow', vars)}</p>
            <h1 className={styles.heroTitle}>{t('pages.about.title')}</h1>
            <p className={styles.heroLead}>{t('pages.about.lead', vars)}</p>
            <Link href={allProducts} className={styles.primary}>
              {t('pages.about.explore')}
              <Arrow />
            </Link>
          </div>
          <div className={styles.mosaic} aria-hidden="true">
            <div className={styles.tileTall}>
              <ThemeImage src="cat-cameras.webp" alt="" ratio={0.75} sizes="(min-width: 900px) 300px, 50vw" className={styles.tileImage} />
            </div>
            <div className={styles.tile}>
              <ThemeImage src="cat-mobiles.webp" alt="" ratio={0.75} sizes="(min-width: 900px) 220px, 40vw" className={styles.tileImage} />
            </div>
            <div className={styles.tile}>
              <ThemeImage src="cat-accessories.webp" alt="" ratio={0.75} sizes="(min-width: 900px) 220px, 40vw" className={styles.tileImage} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.who}>
        <div className={styles.whoCopy}>
          <p className={styles.eyebrow}>{t('pages.about.who.eyebrow')}</p>
          <h2 className={styles.heading}>{t('pages.about.who.title')}</h2>
          <span className={styles.rule} />
          <p className={styles.lead}>{t('pages.about.who.first', vars)}</p>
          <p className={styles.body}>{t('pages.about.who.second')}</p>
        </div>
        {departments.length ? (
          <nav className={styles.departments} aria-label={t('pages.about.who.shop')}>
            <p className={styles.departmentsTitle}>{t('pages.about.who.shop')}</p>
            <ul className={styles.departmentList}>
              {departments.map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className={styles.department}>
                    {c.name}
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </section>

      <section className={styles.purpose}>
        <div className={styles.purposeGrid}>
          <article className={styles.purposeCard}>
            <span className={styles.purposeIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" />
              </svg>
            </span>
            <h2 className={styles.purposeTitle}>{t('pages.about.mission.title')}</h2>
            <p className={styles.purposeBody}>{t('pages.about.mission.body')}</p>
          </article>
          <article className={styles.purposeCard}>
            <span className={styles.purposeIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <h2 className={styles.purposeTitle}>{t('pages.about.vision.title')}</h2>
            <p className={styles.purposeBody}>{t('pages.about.vision.body')}</p>
          </article>
        </div>
      </section>

      <section className={styles.why}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>{t('pages.about.why.eyebrow')}</p>
          <h2 className={styles.heading}>{t('pages.about.why.title', vars)}</h2>
          <p className={styles.body}>{t('pages.about.why.body')}</p>
        </div>
        <ul className={styles.features}>
          <Feature title={t('pages.about.why.curated.title')} body={t('pages.about.why.curated.body')}>
            <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
          </Feature>
          <Feature title={t('pages.about.why.convenient.title')} body={t('pages.about.why.convenient.body')}>
            <path d="M4 5h2l2.4 10.2a1 1 0 001 .8h8.2a1 1 0 001-.8L20 8H7M10 20h.01M17 20h.01" />
          </Feature>
          <Feature title={t('pages.about.why.secure.title')} body={t('pages.about.why.secure.body')}>
            <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6zM9 12l2 2 4-4" />
          </Feature>
          <Feature title={t('pages.about.why.support.title')} body={t('pages.about.why.support.body')}>
            <path d="M4 13a8 8 0 0116 0M4 13v4a2 2 0 002 2h1v-6H4zM20 13v4a2 2 0 01-2 2h-1v-6h3z" />
          </Feature>
          <Feature title={t('pages.about.why.variety.title')} body={t('pages.about.why.variety.body')}>
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </Feature>
          <Feature title={t('pages.about.why.assistance.title')} body={t('pages.about.why.assistance.body')}>
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z" />
          </Feature>
        </ul>
      </section>

      <section className={styles.commitment}>
        <div className={styles.commitmentInner}>
          <div className={styles.commitmentHead}>
            <p className={styles.eyebrowLight}>{t('pages.about.commitment.eyebrow')}</p>
            <h2 className={styles.headingLight}>{t('pages.about.commitment.title')}</h2>
            <p className={styles.bodyLight}>{t('pages.about.commitment.body')}</p>
          </div>
          <ul className={styles.pledges}>
            <li className={styles.pledge}>
              <h3 className={styles.pledgeTitle}>{t('pages.about.commitment.satisfaction.title')}</h3>
              <p className={styles.pledgeBody}>{t('pages.about.commitment.satisfaction.body')}</p>
            </li>
            <li className={styles.pledge}>
              <h3 className={styles.pledgeTitle}>{t('pages.about.commitment.discovery.title')}</h3>
              <p className={styles.pledgeBody}>{t('pages.about.commitment.discovery.body')}</p>
            </li>
            <li className={styles.pledge}>
              <h3 className={styles.pledgeTitle}>{t('pages.about.commitment.transparency.title')}</h3>
              <p className={styles.pledgeBody}>{t('pages.about.commitment.transparency.body')}</p>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaCopy}>
            <h2 className={styles.ctaTitle}>{t('pages.about.cta.title')}</h2>
            <p className={styles.ctaBody}>{t('pages.about.cta.body')}</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href={allProducts} className={styles.primary}>
              {t('pages.about.cta.collections')}
            </Link>
            <Link href="/contact/" className={styles.secondary}>
              {t('pages.about.cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
