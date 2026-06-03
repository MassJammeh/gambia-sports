export default function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 rounded-xl mb-2" style={{ backgroundColor: '#E5E7EB' }} />
          <div className="h-4 w-56 rounded-lg" style={{ backgroundColor: '#E5E7EB' }} />
        </div>
        <div className="h-8 w-24 rounded-xl" style={{ backgroundColor: '#E5E7EB' }} />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 rounded-2xl"
            style={{ backgroundColor: '#E5E7EB' }}
          />
        ))}
      </div>
    </div>
  )
}