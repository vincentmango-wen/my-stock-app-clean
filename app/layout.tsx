import './globals.css'

export const metadata = {
  title: '株分析AIレポート',
  description: 'AI-powered stock analysis and recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
