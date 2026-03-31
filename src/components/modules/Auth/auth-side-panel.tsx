import Image from "next/image"

type AuthSidePanelProps = {
  title: string
  description: string
}

export function AuthSidePanel({ title, description }: AuthSidePanelProps) {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=80"
        alt="Students learning together"
        fill
        sizes="50vw"
        className="object-cover"
        priority
      />

      {/* Dark scrim — always dark regardless of theme */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle colour accent at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

      {/* Content — centred vertically & horizontally */}
      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-12 py-16 text-center">
        {/* Logo badge */}
        <div className="rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/20 backdrop-blur-sm">
          <p className="text-xl font-bold tracking-wide text-white">
            SkillBridge
          </p>
          <p className="text-xs font-medium tracking-[0.15em] text-white/60 uppercase mt-0.5">
            Learn · Build · Grow
          </p>
        </div>

        {/* Heading & description */}
        <div className="max-w-sm space-y-4">
          <h2 className="text-3xl font-bold leading-snug text-white">
            {title}
          </h2>
          <p className="text-sm leading-7 text-white/70">
            {description}
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex gap-2">
          <span className="size-2 rounded-full bg-white/60" />
          <span className="size-2 rounded-full bg-white/30" />
          <span className="size-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}
