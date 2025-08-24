import type {Metadata} from 'next'
import {GeistSans} from 'geist/font/sans'
import {GeistMono} from 'geist/font/mono'
import './globals.css'
import {AppLayout} from "@/features/app-layout/app-layout";

export const metadata: Metadata = {
  title: 'Project Management',
  description: 'Project Management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
          <title>Project Management</title>
      </head>
      <body>
        <AppLayout>
            {children}
        </AppLayout>
      </body>
    </html>
  )
}
