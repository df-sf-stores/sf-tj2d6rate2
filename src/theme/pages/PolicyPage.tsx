import { Link, useLocation, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Breadcrumb } from '../components/Breadcrumb'
import { HelpPanel } from '../components/HelpPanel'
import { Layout } from '../components/Layout'
import { useAboutPages } from '../components/aboutPages'
import { cx } from '../components/cx'
import styles from '../styles/policy.module.css'

const kinds = ['terms', 'privacy', 'shipping', 'returns', 'billing', 'cancellation', 'legal'] as const
type Kind = (typeof kinds)[number]

const numbered = /^\d+\.\s/
const card = /^\+ ([^:]+):\s*(.+)$/

/**
 * One block of a policy's text from content. Blocks are split by a blank line:
 * '- ' lines form a list, 'n. ' lines a numbered list, '+ Title: text' lines a row of cards,
 * a block starting '> ' is a highlighted notice, and anything else a paragraph.
 */
const Block = ({ block }: { block: string }) => {
  const lines = block.split('\n')
  if (lines.every((l) => l.startsWith('- '))) return <ul className={styles.list}>{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>
  if (lines.every((l) => numbered.test(l))) return <ol className={styles.steps}>{lines.map((l, j) => <li key={j} className={styles.stepItem}>{l.replace(numbered, '')}</li>)}</ol>
  if (lines.every((l) => card.test(l)))
    return (
      <ul className={styles.cards}>
        {lines.map((l, j) => {
          const [, name, text] = l.match(card) ?? []
          return (
            <li key={j} className={styles.card}>
              <h3 className={styles.cardTitle}>{name}</h3>
              <p className={styles.cardBody}>{text}</p>
            </li>
          )
        })}
      </ul>
    )
  if (block.startsWith('> '))
    return (
      <aside className={styles.notice}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
        <p className={styles.noticeText}>{block.slice(2)}</p>
      </aside>
    )
  return <p className={styles.paragraph}>{block}</p>
}

/** A policy's text cut into its opening blocks and its '## ' sections, each a heading and its blocks. */
const sectionsOf = (text: string) => {
  const intro: string[] = []
  const sections: { title: string; blocks: string[] }[] = []
  for (const block of text.split('\n\n')) {
    if (block.startsWith('## ')) sections.push({ title: block.slice(3), blocks: [] })
    else (sections.at(-1)?.blocks ?? intro).push(block)
  }
  return { intro, sections }
}

export const PolicyPage = () => {
  const { store, t } = useStorefront()
  const { path } = useLocation()
  const about = useAboutPages()
  const kind = kinds.find((k) => path === `/policies/${k}/` || path === `/policies/${k}`)
  const vars = { store: store.name }
  const pages: Record<Kind, { title: string; lead: string; body: string }> = {
    terms: { title: t('policies.terms.title'), lead: t('policies.terms.lead'), body: t('policies.terms.body', vars) },
    privacy: { title: t('policies.privacy.title'), lead: t('policies.privacy.lead'), body: t('policies.privacy.body', vars) },
    shipping: { title: t('policies.shipping.title'), lead: t('policies.shipping.lead'), body: t('policies.shipping.body', vars) },
    returns: { title: t('policies.returns.title'), lead: t('policies.returns.lead'), body: t('policies.returns.body', vars) },
    billing: { title: t('policies.billing.title'), lead: t('policies.billing.lead'), body: t('policies.billing.body', vars) },
    cancellation: { title: t('policies.cancellation.title'), lead: t('policies.cancellation.lead'), body: t('policies.cancellation.body', vars) },
    legal: { title: t('pages.policy.legal'), lead: t('pages.policy.lead'), body: '' },
  }
  const page = kind ? pages[kind] : null
  const title = page ? page.title : t('pages.policy.title')
  const { intro, sections } = sectionsOf(page?.body ?? '')
  return (
    <Layout>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Breadcrumb current={title} />
          <h1 className={styles.heroTitle}>{title}</h1>
          <span className={styles.rule} />
          <p className={styles.heroLead}>{page ? page.lead : t('pages.policy.lead')}</p>
        </div>
      </header>
      <div className={styles.layout}>
        <aside className={styles.side}>
          {sections.length ? (
            <nav className={styles.toc} aria-label={t('pages.policy.onPage')}>
              <p className={styles.sideTitle}>{t('pages.policy.onPage')}</p>
              <ol className={styles.tocList}>
                {sections.map((s, i) => (
                  <li key={i} className={styles.tocItem}>
                    <Link href={`#section-${i + 1}`} className={styles.tocLink}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <nav className={styles.related} aria-label={t('pages.policy.related')}>
            <p className={styles.sideTitle}>{t('pages.policy.related')}</p>
            <ul className={styles.relatedList}>
              {about.map((entry) => (
                <li key={entry.kind}>
                  <Link href={entry.href} className={cx(styles.relatedLink, entry.kind === kind && styles.relatedCurrent)}>
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className={styles.content}>
          {intro.length ? (
            <div className={styles.intro}>
              {intro.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          ) : null}
          {sections.map((s, i) => (
            <section key={i} id={`section-${i + 1}`} className={styles.section}>
              <h2 className={styles.heading}>
                <span className={styles.number} aria-hidden="true" />
                {s.title}
              </h2>
              {s.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}
          {page?.body ? null : <p className={styles.paragraph}>{kind ? t('pages.policy.ask') : t('pages.policy.lead')}</p>}
        </article>
      </div>
      <HelpPanel />
    </Layout>
  )
}
