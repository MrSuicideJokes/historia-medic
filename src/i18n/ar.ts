import type { Dict } from './fr';

// Arabic plural forms: 1, 2, 3–10, 11+.
const plural = (n: number, [one, two, few, many]: [string, string, string, string]) =>
  n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`;
const products = (n: number) => plural(n, ['منتج واحد', 'منتجان', 'منتجات', 'منتجًا']);

export const ar: Dict = {
  skip: 'الانتقال إلى المحتوى',
  nav: { home: 'الرئيسية', products: 'المنتجات', contact: 'اتصل بنا', menu: 'القائمة الرئيسية' },
  langLabel: 'اللغة',
  darkMode: 'الوضع الداكن',

  categories: { 'pese-personne': 'موازين الأشخاص', tensiometres: 'أجهزة قياس الضغط', autres: 'منتجات أخرى' },
  all: 'الكل',
  productCount: products,

  home: {
    eyebrow: 'معدات طبية · قسنطينة',
    lead: 'معدات طبية ذات جودة في قسنطينة. اختاروا عبر الموقع، واطلبوا عبر واتساب.',
    cta: 'تصفّح المنتجات',
    storefront: 'محلّنا في قسنطينة',
    storefrontAlt: 'واجهة محل Historia Medic المضاءة في قسنطينة مساءً',
    categoriesTitle: 'الفئات',
    featuredTitle: 'مختارات',
    seeAll: 'كل المنتجات',
    locationTitle: 'موقعنا',
    locationText: 'زوروا محلّنا في قسنطينة، أو راسلونا عبر واتساب.',
  },

  product: {
    order: 'اطلب الآن',
    orderItem: (name) => `اطلب ${name}`,
    qty: 'الكمية',
    decrease: 'إنقاص الكمية',
    increase: 'زيادة الكمية',
    view: (i, n) => `الصورة ${i} من ${n}`,
    photos: 'صور المنتج',
  },

  products: {
    title: 'منتجاتنا',
    filterLabel: 'تصفية حسب الفئة',
  },

  checkout: {
    title: 'الطلب',
    intro: 'أدخلوا معلوماتكم، وسيُفتح طلبكم في واتساب جاهزًا للإرسال.',
    customer: 'معلوماتكم',
    firstName: 'الاسم',
    lastName: 'اللقب',
    phone: 'رقم الهاتف',
    phoneHint: '05 أو 06 أو 07 متبوعًا بـ 8 أرقام',
    wilaya: 'الولاية',
    wilayaPlaceholder: 'ابحثوا عن الولاية',
    noResults: 'لا توجد ولاية مطابقة',
    commune: 'البلدية',
    communePlaceholder: 'اختاروا البلدية',
    communeDisabled: 'اختاروا الولاية أولًا',
    errors: {
      required: 'هذا الحقل مطلوب.',
      phone: 'رقم غير صالح: 05 أو 06 أو 07 متبوعًا بـ 8 أرقام.',
      wilaya: 'اختاروا ولاية من القائمة.',
      commune: 'اختاروا البلدية.',
    },
    errorSummary: 'بعض الحقول تحتاج إلى تصحيح.',
    summary: 'طلبكم',
    change: 'تغيير المنتج',
    unitPrice: 'سعر الوحدة',
    total: 'المجموع',
    submit: 'اطلب عبر واتساب',
    note: 'لا يُرسَل أي شيء قبل أن تضغطوا على «إرسال» في واتساب.',
    empty: 'لم تختاروا أي منتج.',
    emptyText: 'اختاروا منتجًا من الكتالوج، ثم اضغطوا على «اطلب الآن».',
    emptyCta: 'تصفّح المنتجات',
  },

  contact: {
    title: 'اتصل بنا',
    lead: 'لأي سؤال أو طلب، اتصلوا بنا أو راسلونا عبر واتساب.',
    address: 'العنوان',
    phone: 'الهاتف',
    social: 'تابعونا',
    directions: 'الاتجاهات',
    mapLabel: 'خريطة موقع Historia Medic',
    mapHint: 'حرّكوا الخريطة بإصبعين.',
  },

  footer: { follow: 'تابعونا', contact: 'اتصل بنا' },

  notFound: {
    title: 'الصفحة غير موجودة',
    text: 'هذه الصفحة غير موجودة أو تم نقلها.',
    cta: 'العودة إلى الرئيسية',
  },

  meta: {
    home: { title: 'Historia Medic · معدات طبية في قسنطينة', description: 'موازين، أجهزة قياس الضغط ومعدات طبية ذات جودة في قسنطينة. اختاروا عبر الموقع واطلبوا عبر واتساب.' },
    products: { title: 'المنتجات · Historia Medic', description: 'موازين، أجهزة قياس الضغط ومعدات طبية أخرى، بالأسعار بالدينار.' },
    checkout: { title: 'الطلب · Historia Medic', description: 'أكملوا طلبكم وأرسلوه عبر واتساب.' },
    contact: { title: 'اتصل بنا · Historia Medic', description: 'Historia Medic في قسنطينة: الهاتف، واتساب، إنستغرام، تيك توك والاتجاهات.' },
    notFound: { title: 'الصفحة غير موجودة · Historia Medic', description: 'هذه الصفحة غير موجودة.' },
  },
};
