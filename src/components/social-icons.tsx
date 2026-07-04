import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
      {children}
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13.5 21v-7.4h2.5l.4-2.9h-2.9v-1.9c0-.85.23-1.43 1.46-1.43H16.5V4.8c-.26-.03-1.13-.11-2.16-.11-2.14 0-3.6 1.3-3.6 3.7v2.06H8.24v2.9h2.5V21h2.76Z" />
    </IconBase>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <IconBase {...props} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M10 9.3v5.4l5-2.7-5-2.7Z" />
    </IconBase>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M7.5 10v7M7.5 7v.01M11 17v-4.2c0-1.5.9-2.3 2.1-2.3 1.2 0 1.9.8 1.9 2.3V17" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M11 10v7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </IconBase>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16.6 5.82c-.9-.9-1.36-2.02-1.4-3.32h-3.02v13.9c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1-2.72-2.72 2.72 2.72 0 0 1 2.72-2.72c.28 0 .55.04.8.12v-3.08a5.8 5.8 0 0 0-.8-.06A5.74 5.74 0 0 0 3.72 16.6 5.74 5.74 0 0 0 9.46 22.3a5.74 5.74 0 0 0 5.74-5.74V9.1a8.5 8.5 0 0 0 4.94 1.58V7.66a5.4 5.4 0 0 1-3.54-1.84Z" />
    </IconBase>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.08-.3-.15-1.26-.46-2.4-1.47a9 9 0 0 1-1.66-2.06c-.17-.3 0-.46.13-.6.13-.13.3-.34.44-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.24-.7.24-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.03 2C6.5 2 2.03 6.48 2.03 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.95 9.95 0 0 0 12.03 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3 .79.8-2.92-.2-.3A8.2 8.2 0 1 1 20.23 12a8.2 8.2 0 0 1-8.2 8.2Z" />
    </IconBase>
  );
}

export const socialIconMap = {
  FACEBOOK: FacebookIcon,
  INSTAGRAM: InstagramIcon,
  TIKTOK: TikTokIcon,
  YOUTUBE: YoutubeIcon,
  LINKEDIN: LinkedinIcon,
  WHATSAPP: WhatsAppIcon,
} as const;
