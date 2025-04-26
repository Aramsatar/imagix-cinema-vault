
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { Mockup, MockupFrame } from "@/components/ui/mockup"
import { Glow } from "@/components/ui/glow"

interface HeroAction {
  text: string
  href: string
  icon?: React.ReactNode
  variant?: "default" | "outline"
}

interface HeroProps {
  badge?: {
    text: string
    action: {
      text: string
      href: string
    }
  }
  title: string
  description: string
  actions: HeroAction[]
  image: string
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  return (
    <section className="bg-background text-foreground py-12 sm:py-24 md:py-32 px-4 overflow-hidden pb-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="gap-2">
              <span className="text-muted-foreground">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1">
                {badge.action.text}
                <ArrowRight className="h-3 w-3" />
              </a>
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {title}
          </h1>

          {/* Description */}
          <p className="text-md max-w-[550px] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} size="lg" asChild>
                <a href={action.href} className="flex items-center gap-2">
                  {action.icon}
                  {action.text}
                </a>
              </Button>
            ))}
          </div>

          {/* Image with Glow */}
          <div className="relative pt-12">
            <MockupFrame size="small">
              <Mockup type="responsive">
                <img
                  src={image}
                  alt="Hero preview"
                  className="w-full h-auto"
                />
              </Mockup>
            </MockupFrame>
            <Glow variant="top" />
          </div>
        </div>
      </div>
    </section>
  )
}
