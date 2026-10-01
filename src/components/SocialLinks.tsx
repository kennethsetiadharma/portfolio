import { FileText, Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const items = [
  { label: "GitHub", href: site.links.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedinIcon },
  { label: "Email", href: site.links.email, Icon: Mail },
  { label: "Resume", href: site.links.resume, Icon: FileText },
];

// Row of dark, round icon buttons. Links come from src/content/site.ts.
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {items.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "icon-lg" }), "rounded-full")}
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
