import { useStorefront } from '@dripfunnel/storefront-core/theme'

export type AboutKind = 'about' | 'shipping' | 'privacy' | 'terms' | 'returns' | 'billing' | 'cancellation'
export type AboutEntry = { kind: AboutKind; href: string; label: string }

/** The address of the About Us section, the breadcrumb's middle step on every page in it. */
export const aboutHref = '/about/'

/**
 * The About Us section in footer order: one list, so the footer, the policy pages' side menu and the
 * breadcrumbs never disagree about a page's address or name.
 */
export const useAboutPages = (): AboutEntry[] => {
  const { t } = useStorefront()
  return [
    { kind: 'about', href: aboutHref, label: t('common.footer.aboutUs') },
    { kind: 'shipping', href: '/policies/shipping/', label: t('common.footer.delivery') },
    { kind: 'privacy', href: '/policies/privacy/', label: t('common.footer.privacy') },
    { kind: 'terms', href: '/policies/terms/', label: t('common.footer.terms') },
    { kind: 'returns', href: '/policies/returns/', label: t('common.footer.returns') },
    { kind: 'billing', href: '/policies/billing/', label: t('common.footer.billing') },
    { kind: 'cancellation', href: '/policies/cancellation/', label: t('common.footer.cancellation') },
  ]
}
