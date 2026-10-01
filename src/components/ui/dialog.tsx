"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({ className, ...props }: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={className}
      {...props}
    />
  );
}

// Centered modal over a blurred backdrop. Closes on Esc, outside click, or the X.
function DialogContent({
  className,
  closeClassName,
  children,
  ...props
}: DialogPrimitive.Popup.Props & { closeClassName?: string }) {
  // Focus the close button on open, not the first focusable thing. Otherwise a
  // YouTube iframe grabs focus and Esc would go to it instead of closing the dialog.
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="dialog-backdrop"
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none"
      />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        initialFocus={closeRef}
        className={cn(
          "fixed top-1/2 left-1/2 z-[60] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-background shadow-2xl outline-none transition duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          ref={closeRef}
          aria-label="Close"
          className={cn(
            "absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/70 text-white outline-none transition-colors hover:bg-black focus-visible:ring-3 focus-visible:ring-white/60",
            closeClassName,
          )}
        >
          <XIcon className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-2xl font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription };
