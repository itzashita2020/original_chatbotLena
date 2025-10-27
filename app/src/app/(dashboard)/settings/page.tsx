/**
 * Settings Page
 *
 * Пользовательские настройки и статистика использования
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserService, type UserSettings } from '@/modules/user/services/UserService'
import { StatsService, type UsageStats } from '@/modules/user/services/StatsService'
import { SettingsPageSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { applyTheme, type Theme } from '@/lib/theme'
import { useAuth } from '@/modules/auth'

const AI_MODELS = [
  { value: 'gpt-4', label: 'GPT-4 (Most capable)' },
  { value: 'gpt-4o', label: 'GPT-4o (Multimodal - images & text)' },
  { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo (Faster)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Economical)' },
]

const THEMES = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
] as const

function SettingsPageContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut()
        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
        setSaveMessage('Failed to sign out')
      }
    }
  }

  // Load settings and stats on mount
  useEffect(() => {
    loadSettings()
    loadStats()
  }, [])

  const loadSettings = async () => {
    try {
      const userSettings = await UserService.getSettings()
      setSettings(userSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const loadStats = async () => {
    try {
      const usageStats = await StatsService.getUsageStats()
      setStats(usageStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleSaveSetting = async (key: keyof UserSettings, value: string | number) => {
    if (!settings) return

    setIsSaving(true)
    setSaveMessage('')

    try {
      const updated = { ...settings, [key]: value }
      await UserService.saveSettings({ [key]: value })
      setSettings(updated)

      // Apply theme immediately if theme setting changed
      if (key === 'theme') {
        applyTheme(value as Theme)
      }

      setSaveMessage('Settings saved successfully')
      setTimeout(() => setSaveMessage(''), 2000)
    } catch (error) {
      console.error('Failed to save setting:', error)
      setSaveMessage('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingSettings) {
    return (
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
        <SettingsPageSkeleton />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-red-500">Failed to load settings</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <a
              href="/"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Back to chats"
              aria-label="Back to chats"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </a>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your preferences and view usage statistics
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            saveMessage.includes('success')
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* User Profile Section */}
        {user && (
          <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Account
            </h2>

            <div className="space-y-4">
              {/* User Avatar/Initial */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {user.id.substring(0, 8)}...
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account created</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email verified</span>
                  <span className={`text-sm font-medium ${
                    user.email_confirmed_at
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {user.email_confirmed_at ? 'Yes' : 'Pending'}
                  </span>
                </div>

                {user.app_metadata?.provider && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sign-in method</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {user.app_metadata.provider}
                    </span>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </section>
        )}

        {/* Appearance Settings */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Appearance
          </h2>

          <div className="space-y-4">
            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleSaveSetting('theme', theme.value)}
                    disabled={isSaving}
                    className={`
                      p-3 sm:p-4 rounded-lg border-2 transition-all
                      min-h-[72px] touch-manipulation
                      ${settings.theme === theme.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 active:border-blue-400'
                      }
                      ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="text-2xl mb-1">{theme.icon}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {theme.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI Model Settings */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Model
          </h2>

          <div className="space-y-4">
            {/* Model Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Model
              </label>
              <select
                value={settings.default_model}
                onChange={(e) => handleSaveSetting('default_model', e.target.value)}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {AI_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature: {settings.temperature?.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleSaveSetting('temperature', parseFloat(e.target.value))}
                disabled={isSaving}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>More focused (0.0)</span>
                <span>More creative (2.0)</span>
              </div>
            </div>

            {/* Max Tokens Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={settings.max_tokens}
                onChange={(e) => handleSaveSetting('max_tokens', parseInt(e.target.value))}
                disabled={isSaving}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum length of AI responses (100-4000)
              </p>
            </div>
          </div>
        </section>

        {/* Usage Statistics */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Usage Statistics
          </h2>

          {isLoadingStats ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-gray-500">Loading statistics...</div>
            </div>
          ) : !stats ? (
            <div className="text-center py-8 text-red-500">
              Failed to load statistics
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.total_chats}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total Chats
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.total_messages}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total Messages
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.total_tokens.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total Tokens
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ${stats.total_cost_estimate.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Est. Cost
                  </div>
                </div>
              </div>

              {/* Messages by Role */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Messages by Role
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">User</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stats.messages_by_role.user}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Assistant</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stats.messages_by_role.assistant}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">System</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stats.messages_by_role.system}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chats by Category */}
              {Object.keys(stats.chats_by_category).length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Chats by Category
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.chats_by_category)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {category}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Most Used Model */}
              {stats.most_used_model && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Most Used Model
                  </h3>
                  <div className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {stats.most_used_model}
                  </div>
                </div>
              )}

              {/* Favorites */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Favorite Chats
                </h3>
                <div className="text-lg font-medium text-yellow-600 dark:text-yellow-400">
                  {stats.favorite_chats} of {stats.total_chats}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border border-red-200 dark:border-red-900/30">
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-300 mb-4">
            Danger Zone
          </h2>
          <button
            onClick={async () => {
              if (confirm('Are you sure you want to reset all settings to defaults?')) {
                await UserService.clearSettings()
                await loadSettings()
                setSaveMessage('Settings reset to defaults')
                setTimeout(() => setSaveMessage(''), 2000)
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Reset Settings to Defaults
          </button>
        </section>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ErrorBoundary>
      <SettingsPageContent />
    </ErrorBoundary>
  )
}
