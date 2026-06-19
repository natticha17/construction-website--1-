export function StatsSection() {
  const stats = [
    { number: "100+", label: "โครงการสำเร็จ" },
    { number: "15+", label: "ปีประสบการณ์" },
    { number: "98%", label: "ความพึงพอใจ" },
    { number: "10+", label: "ทีมงานผู้เชี่ยวชาญ" },
  ]

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">{stat.number}</div>
              <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
