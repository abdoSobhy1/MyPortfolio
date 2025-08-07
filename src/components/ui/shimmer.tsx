import { cn } from "@/lib/utils"

interface ShimmerProps {
  className?: string
  children?: React.ReactNode
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div className={cn("shimmer", className)}>
      {children || <div className="bg-muted rounded-md h-4 w-full" />}
    </div>
  )
}

interface ShimmerCardProps {
  className?: string
}

export function ShimmerCard({ className }: ShimmerCardProps) {
  return (
    <div className={cn("border rounded-lg p-6 space-y-4", className)}>
      <div className="shimmer bg-muted rounded h-6 w-3/4" />
      <div className="shimmer bg-muted rounded h-4 w-full" />
      <div className="shimmer bg-muted rounded h-4 w-2/3" />
      <div className="flex gap-2">
        <div className="shimmer bg-muted rounded h-8 w-16" />
        <div className="shimmer bg-muted rounded h-8 w-16" />
      </div>
    </div>
  )
}

interface ShimmerPostProps {
  className?: string
}

export function ShimmerPost({ className }: ShimmerPostProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="shimmer aspect-video bg-muted" />
      <div className="p-6 space-y-4">
        <div className="shimmer bg-muted rounded h-6 w-3/4" />
        <div className="shimmer bg-muted rounded h-4 w-full" />
        <div className="shimmer bg-muted rounded h-4 w-2/3" />
        <div className="flex flex-wrap gap-1">
          <div className="shimmer bg-muted rounded-full h-6 w-12" />
          <div className="shimmer bg-muted rounded-full h-6 w-16" />
          <div className="shimmer bg-muted rounded-full h-6 w-14" />
        </div>
        <div className="flex gap-2">
          <div className="shimmer bg-muted rounded h-8 w-20" />
          <div className="shimmer bg-muted rounded h-8 w-20" />
        </div>
      </div>
    </div>
  )
}