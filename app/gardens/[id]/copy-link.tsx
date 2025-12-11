'use client'

import { Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

export function CopyLinkButton({ gardenId }: { gardenId: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        // The share link points to the planting page
        const url = `${window.location.origin}/gardens/${gardenId}/plant`

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url)
            } else {
                // Fallback for non-secure contexts (e.g. local network IP)
                const textArea = document.createElement("textarea")
                textArea.value = url
                textArea.style.position = "fixed" // Avoid scrolling to bottom
                textArea.style.left = "-9999px"
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()

                try {
                    document.execCommand('copy')
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err)
                    throw err
                } finally {
                    document.body.removeChild(textArea)
                }
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy link:', err)
            alert('Failed to copy link. Please copy it manually from the address bar if needed (requires HTTPS or localhost).')
        }
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
        >
            {copied ? <Check size={14} /> : <LinkIcon size={14} />}
            {copied ? 'Copied Link' : 'Copy Invite Link'}
        </button>
    )
}
