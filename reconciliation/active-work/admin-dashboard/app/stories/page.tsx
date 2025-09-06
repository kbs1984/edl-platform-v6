import { Sidebar } from '@/components/sidebar'
import { UserStoryMapperLive } from '@/components/user-story-mapper-live'

export default function UserStoriesPage() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--dark-primary)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--dark-secondary)' }}>
        <div className="p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold" style={{ 
              fontFamily: 'var(--font-heading)', 
              color: '#ededed' 
            }}>
              User Story Mapping
            </h1>
            <p className="mt-2 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
              Track platform features against user journeys with live progress matrix integration
            </p>
          </header>
          
          <UserStoryMapperLive />
        </div>
      </main>
    </div>
  )
}