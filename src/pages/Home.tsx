import { Link } from 'react-router';
import { links, store } from '../config/store';
import { categories, products } from '../data/products';
import { usePageMeta } from '../lib/meta';
import { useLang } from '../state/lang';
import { ContactDetails } from '../components/ContactDetails';
import { ArrowIcon, PinIcon } from '../components/icons';
import { ProductGrid } from '../components/ProductGrid';
import { ProductImage } from '../components/ProductImage';
import { Rings } from '../components/Rings';
import { LazyMap } from '../components/LazyMap';

function Hero() {
  const { t, lang } = useLang();
  return (
    <section className="overflow-x-clip bg-hero">
      <div className="wrap grid gap-12 pb-16 pt-10 md:grid-cols-12 md:items-center md:gap-8 md:pb-24 md:pt-16">
      <div className="md:col-span-7">
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-red" />
          {t.home.eyebrow}
        </p>
        <h1 lang="fr" className="display mt-5 [font-variation-settings:'HEXP'_75] text-[clamp(2.9rem,12vw,6.4rem)] font-semibold">
          <bdi>
            <span className="block text-blue">Historia</span>
            <span className="block text-red">Medic</span>
          </bdi>
        </h1>
        <p className="mt-6 text-2xl font-light leading-snug md:text-[2rem]">{store.tagline[lang]}</p>
        <p className="mt-4 max-w-md text-muted">{t.home.lead}</p>
        <Link to="/products" className="btn-primary mt-8 inline-flex min-h-12 items-center gap-3 rounded-md px-6 font-medium">
          {t.home.cta}
          <ArrowIcon />
        </Link>
        {/* Quick ways in: one pill per category. */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c}>
              <Link to={`/products?cat=${c}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-blue/20 bg-paper/70 px-4 text-sm text-ink transition-colors hover:border-blue hover:bg-paper hover:text-blue">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-red" />
                {t.categories[c]}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* The shop itself, framed by the logo's double ring (the same badge as on its sign). */}
      <figure className="relative mx-3 md:col-span-5 md:mx-0">
        <Rings className="pointer-events-none absolute -inset-[6%] text-red" gap={70} />
        <div className="relative animate-[slide-up_700ms_cubic-bezier(0.2,0.7,0.2,1)_both] overflow-hidden rounded-lg shadow-float">
          <img
            src="/images/storefront-800.webp"
            srcSet="/images/storefront-480.webp 480w, /images/storefront-800.webp 800w, /images/storefront-1200.webp 1200w"
            sizes="(min-width: 76rem) 30rem, (min-width: 48rem) 40vw, 90vw"
            width={1200}
            height={1352}
            alt={t.home.storefrontAlt}
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
        <figcaption className="absolute -bottom-4 start-4 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium shadow-float">
          <PinIcon width={16} height={16} className="text-red" />
          {t.home.storefront}
        </figcaption>
      </figure>
      </div>
    </section>
  );
}

function CategoryIndex() {
  const { t } = useLang();
  return (
    <section className="wrap mt-4" aria-labelledby="cat-title">
      <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
        <h2 id="cat-title" className="display text-2xl font-semibold md:text-3xl">{t.home.categoriesTitle}</h2>
        <span className="eyebrow">{t.productCount(products.length)}</span>
      </div>
      <ul>
        {categories.map((c, i) => {
          const items = products.filter((p) => p.category === c);
          return (
            <li key={c} className="reveal border-b border-line">
              <Link to={`/products?cat=${c}`}
                className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 py-4 transition-colors hover:bg-[linear-gradient(90deg,var(--color-blue-tint),transparent_85%)] rtl:hover:bg-[linear-gradient(270deg,var(--color-blue-tint),transparent_85%)] md:grid-cols-[4rem_minmax(0,1fr)_9rem_5.5rem_2.5rem] md:py-5 md:pe-4">
                <span className="tnum text-sm text-muted md:ps-2">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="display block text-[1.4rem] font-medium transition-colors group-hover:text-blue md:text-[2.6rem]">{t.categories[c]}</span>
                  <span className="mt-1 block text-sm text-muted md:hidden">{t.productCount(items.length)}</span>
                </span>
                <span className="hidden text-sm text-muted md:block">{t.productCount(items.length)}</span>
                <span className="block size-16 overflow-hidden rounded-md bg-paper shadow-float transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 md:size-[5.5rem]">
                  <ProductImage name={items[0].images[0]} alt="" sizes="96px" />
                </span>
                <ArrowIcon className="hidden text-blue transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 md:block" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Featured() {
  const { t } = useLang();
  return (
    <section className="mt-20 bg-band py-14 md:mt-28 md:py-20" aria-labelledby="featured-title">
      <div className="wrap">
      <div className="reveal flex flex-wrap items-end justify-between gap-x-4">
        <h2 id="featured-title" className="display whitespace-nowrap text-2xl font-semibold md:text-3xl">{t.home.featuredTitle}</h2>
        <Link to="/products" className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-blue hover:text-blue-strong">
          {t.home.seeAll}
          <ArrowIcon />
        </Link>
      </div>
      <ProductGrid items={products.filter((p) => p.featured)} className="mt-5 bg-paper shadow-float" />
      </div>
    </section>
  );
}

function Location() {
  const { t } = useLang();
  return (
    <section className="mt-14 md:mt-20" aria-labelledby="loc-title">
      <div className="wrap flex items-center gap-4" aria-hidden="true">
        <Rings className="size-9 text-red" />
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="wrap mt-8 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 id="loc-title" className="display text-2xl font-semibold md:text-3xl">{t.home.locationTitle}</h2>
          <p className="mb-6 mt-3 max-w-sm text-muted">{t.home.locationText}</p>
          <ContactDetails social={false} />
          <a href={links.directions} target="_blank" rel="noopener"
            className="btn-primary mt-6 inline-flex min-h-12 items-center gap-2 rounded-md px-5 font-medium">
            <PinIcon />
            {t.contact.directions}
          </a>
        </div>
        <div className="reveal md:col-span-7">
          <LazyMap className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[24rem]" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta('home');
  return (
    <>
      <Hero />
      <CategoryIndex />
      <Featured />
      <Location />
    </>
  );
}
