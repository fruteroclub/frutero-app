import { JamNav } from '@/components/jam-platform/navigation/JamNav'

export default function JamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* JAM Content Area - Sidebar and Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed position, scrollable if needed */}
        <div className="flex-shrink-0">
          <JamNav />
        </div>

        {/* Main Content - Scrollable area with left padding on desktop */}
        <div className="flex-1 overflow-y-auto lg:pl-64">{children}</div>
      </div>
    </div>
  )
}
