




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="min-h-full flex flex-col">
       
        <main>
        {children}
        </main>
       
        </body>
    </html>
  );
}
