import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KeptCore — CVthèque confidentielle',
  description: 'Invisible à votre employeur. Visible aux bons recruteurs. La CVthèque confidentielle pour les talents en poste.',
  keywords: 'cvthèque confidentielle, recrutement discret, profil anonyme, emploi confidentiel',
  openGraph: {
    title: 'KeptCore',
    description: 'Invisible à votre employeur. Visible aux bons recruteurs.',
    url: 'https://keptcore.fr',
    siteName: 'KeptCore',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
