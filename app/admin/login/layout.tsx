export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5 p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}
