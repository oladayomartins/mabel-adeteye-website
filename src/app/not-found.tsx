import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60dvh] flex-col justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-4 max-w-[14ch]">That page is not here</h1>
      <p className="lede mt-5 max-w-[48ch]">
        The link may be out of date. Everything else is one tap away.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/bookings" className="btn btn-secondary">
          Bookings &amp; enquiries
        </Link>
      </div>
    </section>
  );
}
