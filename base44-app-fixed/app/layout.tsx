export const metadata = { title: "Base44 — Siivous", description: "Protector-tyylinen siivousvaraus" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="fi"><body>{children}</body></html>);
}
