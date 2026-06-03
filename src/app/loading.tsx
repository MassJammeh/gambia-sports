export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-xl" style={{ backgroundColor: '#E5E7EB' }} />
      <div className="h-4 w-32 rounded-lg" style={{ backgroundColor: '#E5E7EB' }} />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-2xl" style={{ backgroundColor: '#E5E7EB' }} />
        ))}
      </div>
    </div>
  )
}