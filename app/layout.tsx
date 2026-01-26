import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BirthTech.ai - AI-Powered Pregnancy Care',
  description: 'Your personalized AI companion for a healthy pregnancy journey. Get daily care plans, nutrition guidance, and wellness tips tailored just for you.',
  keywords: 'pregnancy care, prenatal, AI health, nutrition, wellness, baby care',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
