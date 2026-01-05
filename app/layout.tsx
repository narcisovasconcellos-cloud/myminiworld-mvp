export const metadata = {
  title: "MyMiniWorld",
  description: "Uma cidade que cresce com visitas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
