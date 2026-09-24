export default function SectionHead({ tag, title, subtitle }) {
  return (
    <div className="section-head">
      {tag && <span className="tag">{tag}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}
