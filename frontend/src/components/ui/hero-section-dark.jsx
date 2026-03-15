import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  )
}

const HeroSection = React.forwardRef(
  (
    {
      className,
      title = "Civic Connect Infrastructure",
      subtitle = {
        regular: "Effortlessly Track ",
        gradient: "and Resolve Issues",
      },
      description = "Optimize Productivity and Enhance Collaboration with our Intuitive Issue Tracking Solution.",
      ctaText = "Get started",
      ctaHref = "/register",
      secondaryCtaText = "Command Login",
      secondaryCtaHref = "/login",
      gridOptions = {
        angle: 65,
        opacity: 0.4,
        cellSize: 50,
        lightLineColor: "#4a4a4a",
        darkLineColor: "#2a2a2a",
      },
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative overflow-hidden w-full", className)} ref={ref} {...props}>
        <div className="absolute top-0 z-[0] h-screen w-screen bg-slate-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <section className="relative max-w-full mx-auto z-1 pt-24 lg:pt-32">
          <RetroGrid {...gridOptions} />
          <div className="max-w-screen-xl z-10 mx-auto px-4 py-8 lg:py-16 gap-12 md:px-8">
            <div className="space-y-6 max-w-4xl leading-relaxed lg:leading-tight mx-auto text-center relative z-20">
              <h1 className="text-sm text-slate-600 group font-geist mx-auto px-5 py-2 bg-slate-200/50 border-[2px] border-slate-300 rounded-3xl w-fit backdrop-blur-md font-medium shadow-sm">
                {title}
                <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
              </h1>
              <div className="relative py-4">
                {/* Background animation effect for text lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-blue-100/50 blur-[80px] rounded-full animate-pulse duration-3000 pointer-events-none" />
                <h2 className="text-5xl tracking-tighter font-medium font-geist text-slate-900 mx-auto md:text-8xl relative z-10 leading-[1.1]">
                  {subtitle.regular}
                  <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mt-2 inline-block drop-shadow-sm">
                    {subtitle.gradient}
                  </span>
                </h2>
              </div>
              <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl font-medium tracking-wide">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 relative z-10">
                <a
                  href={ctaHref}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 transition-colors shadow-lg shadow-blue-500/30 w-full sm:w-auto text-center"
                >
                  {ctaText}
                </a>
                <a
                  href={secondaryCtaHref}
                  className="rounded-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-medium py-3.5 px-8 transition-colors shadow-lg shadow-black/50 w-full sm:w-auto text-center"
                >
                  {secondaryCtaText}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  },
)
HeroSection.displayName = "HeroSection"

export { HeroSection }
