import type { Metadata } from "next";
import "./globals.css";
import { SiteTrafficTracker } from "@/components/engagement";
export const metadata: Metadata = { title: { default: "UpShift — learn intentionally", template: "%s | UpShift" }, description: "Free, thoughtfully organized learning paths for better habits, focus, and personal growth.", openGraph: { title: "UpShift — learn intentionally", description: "Become a little better, every single day.", type: "website" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SiteTrafficTracker/>{children}</body></html>; }
