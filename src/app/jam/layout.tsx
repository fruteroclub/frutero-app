import Navbar from '@/components/layout/navbar';
import { JamNav } from '@/components/jam-platform/navigation/JamNav';

export default function JamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Navbar - Fixed at top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* JAM Content Area - Sidebar and Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Fixed position, scrollable if needed */}
        <div className="flex-shrink-0">
          <JamNav />
        </div>

        {/* Main Content - Scrollable area with left padding on desktop */}
        <main className="flex-1 overflow-y-auto lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  );
}
