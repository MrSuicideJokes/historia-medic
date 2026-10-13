import { Link } from 'react-router';
import { usePageMeta } from '../lib/meta';
import { useLang } from '../state/lang';
import { ArrowIcon } from '../components/icons';
import { Rings } from '../components/Rings';

export default function NotFound() {
  usePageMeta('notFound');
  const { t } = useLang();
  return (
    <section className="wrap grid gap-8 py-20 md:grid-cols-12 md:items-center md:py-28">
      <div className="md:col-span-7">
        <p className="eyebrow tnum">404</p>
        <h1 className="display mt-4 text-4xl font-semibold md:text-6xl">{t.notFound.title}</h1>
        <p className="mt-4 text-muted">{t.notFound.text}</p>
        <Link to="/" className="btn-primary mt-8 inline-flex min-h-12 items-center gap-3 rounded-md px-6 font-medium">
          {t.notFound.cta}
          <ArrowIcon />
        </Link>
      </div>
      <Rings className="hidden size-64 text-red md:col-span-5 md:block md:justify-self-end" />
    </section>
  );
}
