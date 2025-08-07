import { cn } from "@/lib/utils"

interface RichTextDisplayProps {
  content?: string
  className?: string
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  if (!content) return null

  return (
    <div 
      className={cn(
        "prose prose-sm prose-invert max-w-none",
        "prose-headings:text-foreground prose-p:text-muted-foreground",
        "prose-strong:text-foreground prose-em:text-muted-foreground",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-ul:text-muted-foreground prose-ol:text-muted-foreground",
        "prose-li:text-muted-foreground",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}