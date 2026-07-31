import { sizeGuide } from '../data/content'
import { SectionHeading } from './SectionHeading'

export function SizeGuide() {
  return (
    <section
      id="size-guide"
      className="scroll-mt-24 bg-mist px-5 py-20 md:px-8 md:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Fit"
          title="Size Guide"
          description="Use these garment measurements as a reference. Unsure about your size? Message us on WhatsApp for personalised advice."
        />

        <div className="overflow-x-auto border border-line bg-cream">
          <table className="min-w-[640px] w-full text-left">
            <thead>
              <tr className="border-b border-line bg-cream-dark/60 text-xs tracking-[0.14em] text-stone uppercase">
                <th className="px-4 py-4 font-medium md:px-6">Size</th>
                <th className="px-4 py-4 font-medium md:px-6">Chest (cm)</th>
                <th className="px-4 py-4 font-medium md:px-6">Shoulder (cm)</th>
                <th className="px-4 py-4 font-medium md:px-6">Sleeve (cm)</th>
                <th className="px-4 py-4 font-medium md:px-6">Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((row) => (
                <tr
                  key={row.size}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-4 py-4 font-medium text-ink md:px-6">
                    {row.size}
                  </td>
                  <td className="px-4 py-4 text-ink-soft md:px-6">{row.chest}</td>
                  <td className="px-4 py-4 text-ink-soft md:px-6">
                    {row.shoulder}
                  </td>
                  <td className="px-4 py-4 text-ink-soft md:px-6">
                    {row.sleeve}
                  </td>
                  <td className="px-4 py-4 text-ink-soft md:px-6">
                    {row.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-stone md:hidden">
          Swipe horizontally to view all measurements.
        </p>
      </div>
    </section>
  )
}
