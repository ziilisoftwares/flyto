export const metadata = { title: "Flyto-movings", description: "heittämällä helpoimmat muutot" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="fi"><body>{children}</body></html>);
}
