export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-zinc-50 text-zinc-900">
      {children}
    </div>
  );
}
