import type { LucideIcon } from 'lucide-react'
import { Building2, Cloud, Code2, Database, ShieldCheck, Sparkles, Workflow } from 'lucide-react'

/**
 * Payload `skill-groups.icon` select values mapped onto lucide glyphs.
 *
 * Shared by the Skills cards and the About orbit so both surfaces always show the
 * same glyph for the same area (the editor picks the value, this map renders it).
 */
export const skillIcons: Record<string, LucideIcon> = {
  code: Code2,
  cloud: Cloud,
  ai: Sparkles,
  shield: ShieldCheck,
  database: Database,
  enterprise: Building2,
  engineering: Workflow,
}

/** Resolve a stored `icon` value, falling back to `code` for empty or unknown ones. */
export function skillIcon(icon?: string | null): LucideIcon {
  return (icon ? skillIcons[icon] : undefined) ?? skillIcons.code
}
