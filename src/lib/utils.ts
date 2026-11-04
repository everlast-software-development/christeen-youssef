import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The type scale in globals.css (`text-h1`…`text-h3`) is a font size, but
// tailwind-merge cannot know that and would read it as a colour — dropping it
// whenever a `text-ink` or `text-white` follows. Registering it keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
