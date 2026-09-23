export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="shell pt-10 pb-2 md:pt-16">
      {/* Transform-only entrance keeps this above-the-fold block eligible for LCP. */}
      <div className="rise">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h1 mt-4 max-w-[16ch] text-balance">{title}</h1>
        {lede ? <p className="lede mt-6 max-w-[58ch]">{lede}</p> : null}
      </div>
    </header>
  );
}
