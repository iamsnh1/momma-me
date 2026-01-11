import Navigation from '@/components/Navigation'
import FirstCryHomePage from '@/components/FirstCryHomePage'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <FirstCryHomePage />
      <Newsletter />
      <Footer />
    </main>
  )
}

