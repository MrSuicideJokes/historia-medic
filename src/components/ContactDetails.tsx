import { links, store } from '../config/store';
import { useLang } from '../state/lang';
import { InstagramIcon, PhoneIcon, PinIcon, TikTokIcon, WhatsAppIcon } from './icons';

const row = 'flex min-h-12 items-center gap-3 border-b border-line py-2';
const link = `${row} transition-colors hover:text-blue`;

// Address + every contact channel, as a ruled list. Used on Home and Contact.
export function ContactDetails({ social = true }: { social?: boolean }) {
  const { t, lang } = useLang();
  return (
    <ul className="border-t border-line">
      <li className={row}>
        <PinIcon className="shrink-0 text-blue" />
        <span><span className="sr-only">{t.contact.address} : </span>{store.city[lang]}</span>
      </li>
      <li>
        <a className={link} href={links.tel}>
          <PhoneIcon className="shrink-0 text-blue" />
          <span className="sr-only">{t.contact.phone} : </span>
          <span dir="ltr" className="tnum font-medium">{store.phone.display}</span>
        </a>
      </li>
      <li>
        <a className={link} href={links.whatsapp} target="_blank" rel="noopener">
          <WhatsAppIcon className="shrink-0 text-blue" />WhatsApp
        </a>
      </li>
      {social && (
        <>
          <li>
            <a className={link} href={links.instagram} target="_blank" rel="noopener">
              <InstagramIcon className="shrink-0 text-blue" />Instagram <span dir="ltr" className="text-muted">@{store.instagram}</span>
            </a>
          </li>
          <li>
            <a className={link} href={links.tiktok} target="_blank" rel="noopener">
              <TikTokIcon className="shrink-0 text-blue" />TikTok <span dir="ltr" className="text-muted">@{store.tiktok}</span>
            </a>
          </li>
        </>
      )}
    </ul>
  );
}
