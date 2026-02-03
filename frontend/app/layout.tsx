import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display font: Modern geometric sans-serif, excellent for headings
const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

// Body font: Highly readable, modern sans-serif for UI text
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Mono font: Clean monospace for code/data elements
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Orbital | Supply Chain Intelligence",
  description: "AI-powered purchase order management and supplier tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}

        {/* SVG Filter for Liquid Glass Distortion Effect */}
        <svg style={{ display: 'none' }} aria-hidden="true">
          <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="1"
              seed="5"
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale="3"
              specularConstant="0.8"
              specularExponent="80"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-100" y="-100" z="200" />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0"
              k2="0.8"
              k3="0.8"
              k4="0"
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </body>
    </html>
  );
}
