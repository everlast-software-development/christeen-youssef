'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Base UI, not Radix. The upstream snippet for this shipped a
 * `@radix-ui/react-checkbox` version, but this project is on `@base-ui/react`
 * (see components.json: style "base-nova") and has no Radix packages at all —
 * that file would not have resolved, let alone built.
 *
 * The state attribute differs with it: Base UI emits `data-checked`, where
 * Radix emits `data-state="checked"`.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-4 shrink-0 rounded-[4px] border border-input bg-transparent transition-colors outline-none',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
