import AdminChannel from './admin-channel'
import PublicChannel from './public-channel'

export default function ArenaChannels() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <AdminChannel />
      <PublicChannel />
    </div>
  )
}