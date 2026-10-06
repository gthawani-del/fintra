import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const uiFont=IBM_Plex_Sans({
  subsets:["latin"],
  weight:["400","500","600"],
  variable:"--font-ui",
  display:"swap"
});

const displayFont=Newsreader({
  subsets:["latin"],
  weight:["400","500","600"],
  variable:"--font-display",
  display:"swap"
});

export const metadata: Metadata={title:"Fintra",description:"A calm personal finance tracker"};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en-IN" className={uiFont.variable+" "+displayFont.variable}><body>{children}</body></html>
}
