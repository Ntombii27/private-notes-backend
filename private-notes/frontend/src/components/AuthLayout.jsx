export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Private Notes</h1>
      <p className="mt-1 text-muted">Notes that only you can read.</p>

      <div className="mt-8 rounded-lg border border-line bg-sheet p-6 sm:p-8">
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">{footer}</p>
    </main>
  );
}
