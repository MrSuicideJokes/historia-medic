import { links, store } from '../config/store';
import { useLang } from '../state/lang';
import { InstagramIcon, PhoneIcon, PinIcon, TikTokIcon, WhatsAppIcon } from './icons';
import { Wordmark } from './Logo';

const rowLink = 'inline-flex min-h-11 items-center gap-3 text-white/90 transition-colors hover:text-white';

export function Footer() {
  const { t, lang } = useLang();
  return (
    <footer className="relative mt-24 overflow-hidden bg-footer text-white">
      <span aria-hidden="true" className="block h-1 bg-brand-stripe" />
      <div className="wrap relative grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark discSize={48} className="text-xl" />
          <p className="mt-4 max-w-xs text-lg font-light text-white/90">{store.tagline[lang]}</p>
        </div>

        <div className="md:col-span-4">
          <h2 className="mb-2 text-sm font-medium text-white/70">{t.footer.contact}</h2>
          <ul>
            <li className="flex min-h-11 items-center gap-3 text-white/90"><PinIcon />{store.city[lang]}</li>
            <li><a className={rowLink} href={links.tel}><PhoneIcon /><span dir="ltr" className="tnum">{store.phone.display}</span></a></li>
            <li><a className={rowLink} href={links.whatsapp} target="_blank" rel="noopener"><WhatsAppIcon />WhatsApp</a></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="mb-2 text-sm font-medium text-white/70">{t.footer.follow}</h2>
          <ul>
            <li><a className={rowLink} href={links.instagram} target="_blank" rel="noopener"><InstagramIcon /><span dir="ltr">@{store.instagram}</span></a></li>
            <li><a className={rowLink} href={links.tiktok} target="_blank" rel="noopener"><TikTokIcon /><span dir="ltr">@{store.tiktok}</span></a></li>
          </ul>
        </div>
      </div>
      <div className="wrap relative border-t border-white/15 py-5 text-sm text-white/70">
        © {new Date().getFullYear()} {store.name}
      </div>
    </footer>
  );
}
