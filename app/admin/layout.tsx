export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background text-foreground">
      {children}
    </div>
  );
}
