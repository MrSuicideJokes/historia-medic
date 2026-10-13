import type { Dict } from './fr';

// Arabic plural forms: 1, 2, 3–10, 11+.
const plural = (n: number, [one, two, few, many]: [string, string, string, string]) =>
  n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`;
const products = (n: number) => plural(n, ['منتج واحد', 'منتجان', 'منتجات', 'منتجًا']);
const items = (n: number) => plural(n, ['قطعة واحدة', 'قطعتان', 'قطع', 'قطعة']);

export const ar: Dict = {
  skip: 'الانتقال إلى المحتوى',
  nav: { home: 'الرئيسية', products: 'المنتجات', contact: 'اتصل بنا', cart: 'السلة', menu: 'القائمة الرئيسية' },
  langLabel: 'اللغة',
  darkMode: 'الوضع الداكن',
  cartLink: (n) => (n ? `السلة، ${items(n)}` : 'السلة، فارغة'),

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
    add: 'أضف إلى السلة',
    added: 'تمت الإضافة',
    addedSr: 'أُضيف إلى السلة',
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

  cart: {
    title: 'السلة',
    items,
    empty: 'سلّتكم فارغة.',
    emptyText: 'تصفّحوا المنتجات وأضيفوا ما تحتاجون إليه.',
    emptyCta: 'تصفّح المنتجات',
    unitPrice: 'سعر الوحدة',
    remove: 'حذف',
    removeItem: (name) => `حذف ${name} من السلة`,
    lineTotal: 'المجموع',
    total: 'مجموع الطلب',
    clear: 'إفراغ السلة',
    clearConfirm: 'هل تريدون إفراغ السلة بالكامل؟',
    clearYes: 'نعم، أفرغها',
    cancel: 'إلغاء',
    checkout: 'إتمام الطلب',
    continue: 'متابعة التسوّق',
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
    summary: 'ملخّص الطلب',
    edit: 'تعديل السلة',
    submit: 'اطلب عبر واتساب',
    note: 'تبقى سلّتكم محفوظة إلى أن تُفرغوها.',
    empty: 'سلّتكم فارغة، لا يوجد ما يمكن طلبه.',
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

  dock: {
    label: 'سلّتكم',
    view: 'عرض السلة',
    added: 'أُضيف إلى السلة',
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
    cart: { title: 'السلة · Historia Medic', description: 'سلّتكم في Historia Medic.' },
    checkout: { title: 'الطلب · Historia Medic', description: 'أكملوا طلبكم وأرسلوه عبر واتساب.' },
    contact: { title: 'اتصل بنا · Historia Medic', description: 'Historia Medic في قسنطينة: الهاتف، واتساب، إنستغرام، تيك توك والاتجاهات.' },
    notFound: { title: 'الصفحة غير موجودة · Historia Medic', description: 'هذه الصفحة غير موجودة.' },
  },
};
