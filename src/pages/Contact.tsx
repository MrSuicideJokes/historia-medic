import { links } from '../config/store';
import { usePageMeta } from '../lib/meta';
import { useLang } from '../state/lang';
import { ContactDetails } from '../components/ContactDetails';
import { PinIcon, WhatsAppIcon } from '../components/icons';
import { LazyMap } from '../components/LazyMap';
import { PageHeader } from '../components/PageHeader';

export default function Contact() {
  usePageMeta('contact');
  const { t } = useLang();
  return (
    <>
      <PageHeader title={t.contact.title} />
      <div className="wrap">

      <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="mb-8 max-w-sm text-lg">{t.contact.lead}</p>
          <ContactDetails />
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={links.directions} target="_blank" rel="noopener"
              className="btn-primary inline-flex min-h-12 items-center gap-2 rounded-md px-5 font-medium">
              <PinIcon />
              {t.contact.directions}
            </a>
            <a href={links.whatsapp} target="_blank" rel="noopener"
              className="inline-flex min-h-12 items-center gap-2 rounded border border-blue px-5 font-medium text-blue transition-colors hover:bg-blue-tint">
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
        <div className="md:col-span-7">
          <LazyMap className="aspect-square sm:aspect-[4/3] md:aspect-auto md:h-[32rem]" />
        </div>
      </div>
      </div>
    </>
  );
}
