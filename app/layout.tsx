import type { Metadata } from 'next'
import './globals.css'
import { Quicksand, Poppins, Inter, DM_Sans, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'M💗mma & Me - Premium Baby Products',
  description: 'Safe, comfortable, and designed to make parenting a beautiful journey filled with precious moments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${poppins.variable} ${inter.variable} ${dmSans.variable} ${dancingScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}

