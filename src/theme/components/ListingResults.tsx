import type { Listing } from '@dripfunnel/storefront-core/theme'
import { ShopListing } from './interactive/Filters'

/**
 * A collection's or a search's products: filters, sort, view, the grid and its states.
 * `browse` adds the collections as a Category filter, which only a collection page has.
 */
export const ListingResults = ({ listing, browse = false }: { listing: Listing; browse?: boolean }) => <ShopListing listing={listing} browse={browse} />
