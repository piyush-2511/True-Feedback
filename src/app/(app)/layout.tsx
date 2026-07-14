import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0E13]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}