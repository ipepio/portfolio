import type { Meta, StoryObj } from '@storybook/nextjs'

const tokenGroups = [
  {
    title: 'Surfaces',
    tokens: [
      { name: 'background', value: 'var(--background)', note: 'page canvas' },
      { name: 'card', value: 'var(--card)', note: 'raised surfaces' },
      { name: 'border', value: 'var(--border)', note: 'hairlines' },
    ],
  },
  {
    title: 'Brand',
    tokens: [
      { name: 'primary', value: 'var(--primary)', note: 'lime accent / CTA' },
      { name: 'peach', value: 'var(--peach)', note: 'warm accent' },
    ],
  },
  {
    title: 'Text',
    tokens: [
      { name: 'foreground', value: 'var(--foreground)', note: 'ink' },
      { name: 'muted-foreground', value: 'var(--muted-foreground)', note: 'body copy' },
      { name: 'muted', value: 'var(--muted)', note: 'meta / soft' },
    ],
  },
]

const meta = {
  title: 'Design System/Tokens',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Colors: Story = {
  render: () => (
    <div className="mx-auto flex max-w-(--container-page) flex-col gap-10 p-8">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Color tokens</span>
        <p className="max-w-lg text-sm text-muted-foreground">
          Semantic shadcn variables mapped onto the ipepio palette. Use the Theme toolbar to compare
          the dark default with the light theme.
        </p>
      </div>

      {tokenGroups.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <h2 className="mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {group.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <div
                key={token.name}
                className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground"
              >
                <div
                  className="grid-lines h-24 w-full border-b border-border"
                  style={{ backgroundColor: token.value }}
                />
                <div className="flex flex-col gap-1 p-4">
                  <code className="mono text-xs text-foreground">--{token.name}</code>
                  <span className="mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {token.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{token.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="mx-auto flex max-w-(--container-page) flex-col gap-10 p-8">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Type tokens</span>
        <h1 className="text-[clamp(58px,7.3vw,112px)] font-bold leading-[0.92] tracking-[-0.087em]">
          Hi, I&apos;m <span className="text-primary">ipepio</span>
          <br />
          <span className="text-muted-foreground">system architect</span>
        </h1>
        <p className="mono text-[10px] uppercase tracking-[0.06em] text-muted">
          + display · clamp(58px, 7.3vw, 112px) / .92 / -.087em
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="eyebrow">Eyebrow pattern</span>
        <p className="max-w-lg text-sm text-muted-foreground">
          Mono 11px uppercase, .16em tracking, 7px rotated accent square before the label.
        </p>
        <code className="mono max-w-max rounded-md border border-border bg-secondary px-3 py-1.5 text-[11px] text-secondary-foreground">
          &lt;span className=&quot;eyebrow&quot;&gt;Selected work&lt;/span&gt;
        </code>
      </div>

      <div className="flex flex-col gap-3">
        <span className="eyebrow">Mono meta</span>
        <p className="mono text-[10px] uppercase leading-6 tracking-[0.06em] text-muted">
          + available for q3 <br />+ buenos aires · utc-3 <br />+ payload · next.js · typescript
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="eyebrow">Body</span>
        <p className="max-w-xl text-base leading-[1.7] text-muted-foreground">
          Body copy renders in Inter at{' '}
          <strong className="font-semibold text-foreground">1.55 line-height</strong>, with muted
          foreground for long-form paragraphs and foreground for emphasis.
        </p>
      </div>
    </div>
  ),
}
