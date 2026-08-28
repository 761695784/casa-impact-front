import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { LinkedinIcon, FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/brand/social-icons"
import { branding, contactInfo, footerNav, siteConfig, socialLinks } from "@/lib/config"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Watermark tree */}
      <Image
        src={branding.watermarkWhite || "/placeholder.svg"}
        alt=""
        aria-hidden
        width={520}
        height={560}
        className="pointer-events-none absolute -right-16 -top-10 w-[340px] opacity-[0.06] md:w-[440px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="white" width={180} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-sm font-medium text-accent">{siteConfig.signature}</p>
          </div>

          <FooterColumn title="Explorer" links={footerNav.explorer} />
          <FooterColumn title="Participer" links={footerNav.participer} />

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  {contactInfo.address.line1}, {contactInfo.address.line2}
                  <br />
                  {contactInfo.address.city}
                </span>
              </li>
              <li>
                <a href={contactInfo.phoneHref} className="flex items-center gap-3 hover:text-primary-foreground">
                  <Phone className="size-4 shrink-0 text-accent" />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 break-all hover:text-primary-foreground"
                >
                  <Mail className="size-4 shrink-0 text-accent" />
                  {contactInfo.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon href={socialLinks.linkedin} label="LinkedIn">
                <LinkedinIcon className="size-4" />
              </SocialIcon>
              <SocialIcon href={socialLinks.facebook} label="Facebook">
                <FacebookIcon className="size-4" />
              </SocialIcon>
              <SocialIcon href={socialLinks.instagram} label="Instagram">
                <InstagramIcon className="size-4" />
              </SocialIcon>
              <SocialIcon href={socialLinks.tiktok} label="TikTok">
                <TiktokIcon className="size-4" />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/75">
          <p className="text-center md:text-left">
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
          
          <p className="text-center">
            Made by{" "}
            <a
              href="https://majeliconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:underline hover:text-white transition-colors"
            >
              Majeli Connect
            </a>
          </p>

          <ul className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </a>
  )
}
