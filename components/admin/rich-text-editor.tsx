"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, List, ListOrdered, Heading2, LinkIcon } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertFormatting = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatButtons = [
    {
      icon: Heading2,
      label: "শিরোনাম",
      action: () => insertFormatting("<h2>", "</h2>"),
    },
    {
      icon: Bold,
      label: "বোল্ড",
      action: () => insertFormatting("<strong>", "</strong>"),
    },
    {
      icon: Italic,
      label: "ইটালিক",
      action: () => insertFormatting("<em>", "</em>"),
    },
    {
      icon: List,
      label: "বুলেট লিস্ট",
      action: () => insertFormatting("<ul>\n<li>", "</li>\n</ul>"),
    },
    {
      icon: ListOrdered,
      label: "নাম্বার লিস্ট",
      action: () => insertFormatting("<ol>\n<li>", "</li>\n</ol>"),
    },
    {
      icon: LinkIcon,
      label: "লিংক",
      action: () => insertFormatting('<a href="URL">', "</a>"),
    },
  ]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
        {formatButtons.map((button) => (
          <Button
            key={button.label}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.label}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        HTML ট্যাগ ব্যবহার করুন: &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;,
        &lt;p&gt;, &lt;br&gt;
      </p>
    </div>
  )
}

export default RichTextEditor
