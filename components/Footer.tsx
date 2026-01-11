'use client'

import { useEffect, useState } from 'react'
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'
import { useCategoryStore } from '@/store/categoryStore'
import { useFooterSettingsStore } from '@/store/footerSettingsStore'
import Link from 'next/link'

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const { getActiveCategories, initialize: initializeCategories } = useCategoryStore()
  const { settings, initialize: initializeFooter } = useFooterSettingsStore()
  
  useEffect(() => {
    setMounted(true)
    initializeCategories()
    initializeFooter()
  }, [initializeCategories, initializeFooter])
  
  const categories = mounted ? getActiveCategories() : []
  
  return (
    <footer className="bg-footer-dark text-white py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-primary-pink-dark flex items-center justify-center text-white text-lg font-bold">
                M
              </div>
              <span className="text-xl font-bold">
                <span className="text-purple-light">M</span>
                <span className="text-primary-pink-dark">💗</span>
                <span className="text-purple-light">mma</span>
                <span className="text-purple-light">& Me</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {settings.companyDescription}
            </p>
            <div className="flex space-x-4">
              <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-pink-dark flex items-center justify-center transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-pink-dark flex items-center justify-center transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-pink-dark flex items-center justify-center transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              {settings.socialMedia.pinterest && (
                <a href={settings.socialMedia.pinterest} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary-pink-dark flex items-center justify-center transition-colors">
                  <span className="text-lg">📌</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary-pink-dark">Quick Links</h3>
            <ul className="space-y-2">
              {settings.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.url} className="text-gray-300 hover:text-primary-pink transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary-pink-dark">Products</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#products-${cat.id}`}
                    className="text-gray-300 hover:text-primary-pink transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary-pink-dark">Contact Info</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start space-x-2">
                <span>📞</span>
                <span>{settings.contactInfo.phone}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>📧</span>
                <a href={`mailto:${settings.contactInfo.email}`} className="hover:text-primary-pink transition-colors">
                  {settings.contactInfo.email}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <span>📍</span>
                <span>{settings.contactInfo.address}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>🕐</span>
                <span>{settings.contactInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {settings.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}

