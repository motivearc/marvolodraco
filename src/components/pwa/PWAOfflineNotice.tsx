import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export function PWAOfflineNotice() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[55] border-b border-line bg-black px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-center text-sm text-ink"
    >
      <p className="mx-auto flex max-w-3xl items-center justify-center gap-2">
        <WifiOff size={16} aria-hidden="true" />
        <span>You appear to be offline. Please reconnect to continue.</span>
      </p>
    </div>
  )
}
