import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "")
  // Decode HTML entities
  const textarea = document.createElement("textarea")
  textarea.innerHTML = text
  return textarea.value
}

export function stripHtmlServer(html: string): string {
  if (!html) return ""
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, "")
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return text.trim()
}
