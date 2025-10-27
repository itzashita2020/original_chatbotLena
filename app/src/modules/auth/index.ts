/**
 * Auth Module - Public API
 *
 * ⚠️ ВАЖНО: Импортировать ТОЛЬКО через этот файл!
 *
 * ✅ Правильно:
 * import { useAuth, AuthService } from '@/modules/auth'
 *
 * ❌ Неправильно:
 * import { useAuth } from '@/modules/auth/hooks/useAuth'
 *
 * Это обеспечивает изоляцию модуля и экономит токены AI при изменениях.
 */

// Hooks
export { useAuth } from './hooks/useAuth'
export type { UseAuthReturn } from './hooks/useAuth'

// Types
export type {
  User,
  AuthState,
  AuthError,
  AuthProvider,
} from './types'

export const AUTH_MODULE_VERSION = '1.1.0'
