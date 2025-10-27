/**
 * Search Module - Public API
 *
 * 🌟 UNIQUE FEATURE - Полнотекстовый поиск по чатам и сообщениям
 */

// Services
export { SearchService } from './services/SearchService'

// Components
export { SearchBar } from './components/SearchBar'
export { SearchResults } from './components/SearchResults'

// Types
export type {
  SearchQuery,
  SearchFilters,
  SearchResult,
  SearchResults as SearchResultsType,
} from './types'

export const SEARCH_MODULE_VERSION = '1.0.0'
