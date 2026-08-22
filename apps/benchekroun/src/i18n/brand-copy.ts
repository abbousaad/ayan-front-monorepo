import type { Locale } from '@acme/shared';

/**
 * Bespoke brand narrative for دار بنشقرون, in Arabic + French.
 *
 * These strings are curated marketing copy specific to this one site, so they
 * live here rather than in the shared `@acme/shared` baseline (which the admin
 * back-office owns). Functional UI strings still come from `t()` / the baseline.
 */
export type BrandCopy = {
  brandName: string;
  brandTagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroAccentLine: string;
  heroSubtitle: string;
  heroCta: string;
  heroCtaSecondary: string;
  heroImageCaption: string;
  features: string[];
  // nav
  navHome: string;
  navShop: string;
  navCategories: string;
  navAbout: string;
  navContact: string;
  // footer
  footerBlurb: string;
  footerExploreTitle: string;
  footerRights: string;
  // best sellers / featured
  featuredEyebrow: string;
  featuredTitle: string;
  // about
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  aboutQuote: string;
  aboutImageCaption: string;
  statFoundedValue: string;
  statFoundedLabel: string;
  statNaturalValue: string;
  statNaturalLabel: string;
  statHandmadeValue: string;
  statHandmadeLabel: string;
  // contact
  contactEyebrow: string;
  contactTitle: string;
  contactSubtitle: string;
  contactInfoTitle: string;
  contactEmailLabel: string;
  contactMessageLabel: string;
  contactSend: string;
  contactSuccess: string;
  contactPhoneValue: string;
  contactEmailValue: string;
  contactAddressValue: string;
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  collectionEyebrow: string;
  collectionTitle: string;
  collectionSubtitle: string;
  categoriesTitle: string;
  categoryAll: string;
  categoryEyebrow: string;
  viewCategory: string;
  backToCategories: string;
  productsEmpty: string;
  productsError: string;
  retry: string;
  backToHome: string;
  continueShopping: string;
  backToCollection: string;
  viewStore: string;
  addToCart: string;
  outOfStock: string;
  inStock: string;
  onlyLeft: string; // uses {count}
  description: string;
  quantity: string;
  // checkout
  checkoutEyebrow: string;
  checkoutTitle: string;
  yourOrder: string;
  subtotal: string;
  discount: string;
  deliveryFee: string;
  total: string;
  contactDetails: string;
  cashOnDelivery: string;
  cashOnDeliveryNote: string;
  fullName: string;
  phone: string;
  address: string;
  placeOrder: string;
  placingOrder: string;
  cartEmpty: string;
  clearCart: string;
  yourSelections: string;
  // confirmation
  orderConfirmed: string;
  thankYou: string; // uses {name}
  orderReceived: string;
  orderId: string;
  status: string;
  delivery: string;
  instantDelivery: string;
  required: string;
  nameRequired: string;
  phoneRequired: string;
  addressRequired: string;
  submitError: string;
};

const ar: BrandCopy = {
  brandName: 'دار بنشقرون',
  brandTagline: 'أجود المواد · بذوق مغربي',
  heroEyebrow: 'أجود المواد · بذوق مغربي',
  heroTitle: 'عبق الأصالة في كل خيط دخان',
  heroTitleLead: 'ما تتوارثه',
  heroTitleAccent: 'العائلات المغربية',
  heroAccentLine: '«الفخامة الحقيقية لا تُصنع، بل تُورَّث.»',
  heroSubtitle: 'مواد نبيلة، وصفات قديمة، وصنعة أهل الحرفة — مجموعة في دار واحدة.',
  heroCta: 'تصفّح الفئات',
  heroCtaSecondary: 'قصة الدار',
  heroImageCaption: 'سرغينة · بخور دار بنشقرون',
  features: ['صناعة يدوية', 'مكونات طبيعية', 'وصفات عريقة', 'معايير عالمية', 'توصيل داخل المغرب'],
  navHome: 'الرئيسية',
  navShop: 'المتجر',
  navCategories: 'الفئات',
  navAbout: 'من نحن',
  navContact: 'اتصل بنا',
  footerBlurb:
    'دار بنشقرون — بخور مغربي فاخر يُصنع يدويًا بفاس وفق وصفات عريقة، ويُوصل إلى باب منزلك داخل المغرب.',
  footerExploreTitle: 'استكشف',
  footerRights: 'جميع الحقوق محفوظة',
  featuredEyebrow: 'تشكيلتنا',
  featuredTitle: 'مجموعتنا المختارة',
  aboutEyebrow: 'قصتنا',
  aboutTitle: 'إرثٌ نحمله، لا بضاعة نبيعها',
  aboutParagraphs: [
    'منذ أجيال، حافظت عائلة بنشقرون على وصفاتها كما تُحفظ الأمانة: تنتقل من يدٍ إلى يد، دون أن يُنقص منها شيء.',
    'في بيوتنا، حين نستقبل من هو عزيزٌ على القلب، نُحسن إعداد الطعام… ثم نُتمّ الاستقبال برائحة تليق به. فالرائحة عندنا ليست تفصيلًا صغيرًا، بل هي ما يبقى في الذاكرة بعد أن ينصرف الضيف.',
    'وصفاتنا موروثة عمّن سبقونا، ونحن لا نبيع منتجًا بقدر ما نمدّ لك طرفًا من هذا الإرث — ونحمل مسؤولية تسليمه كاملًا لمن يأتي بعدنا، دون اختصار ولا تبديل.'
  ],
  aboutQuote: '«الرائحة هي ما يبقى بعد أن ينصرف الضيف.»',
  aboutImageCaption: 'قصتنا · دار بنشقرون',
  statFoundedValue: '٤ أجيال',
  statFoundedLabel: 'من التوارث',
  statNaturalValue: '100%',
  statNaturalLabel: 'مكوّنات طبيعية',
  statHandmadeValue: 'يدويًا',
  statHandmadeLabel: 'تحضير بالكامل',
  contactEyebrow: 'تواصل معنا',
  contactTitle: 'نسعد بتواصلكم',
  contactSubtitle: 'لأي استفسار عن منتجاتنا أو طلباتكم، لا تترددوا في مراسلتنا.',
  contactInfoTitle: 'معلومات التواصل',
  contactEmailLabel: 'البريد الإلكتروني',
  contactMessageLabel: 'رسالتك',
  contactSend: 'إرسال',
  contactSuccess: 'شكرًا لك، تم استلام رسالتك وسنعود إليك قريبًا.',
  contactPhoneValue: '+212 5 35 00 00 00',
  contactEmailValue: 'contact@benchekroun.ma',
  contactAddressValue: 'المدينة القديمة، فاس، المغرب',
  storyEyebrow: 'حكايتنا',
  storyTitle: 'إرثٌ من العطر والفخامة',
  storyBody:
    'من قلب المغرب، نصوغ بخورًا يجمع بين نفائس المكونات وحرفية توارثتها الأجيال. كل قطعة دعوة إلى لحظة سكينة وأناقة.',
  collectionEyebrow: 'الأقسام الرئيسية',
  collectionTitle: 'روائع مختارة بعناية',
  collectionSubtitle: 'تصفّح تشكيلتنا الكاملة',
  categoriesTitle: 'تصفّح حسب الفئة',
  categoryAll: 'الكل',
  categoryEyebrow: 'الفئة',
  viewCategory: 'اكتشف',
  backToCategories: 'العودة إلى الفئات',
  productsEmpty: 'لا توجد منتجات متاحة حاليًا.',
  productsError: 'تعذّر تحميل المجموعة الآن.',
  retry: 'إعادة المحاولة',
  backToHome: 'العودة إلى الرئيسية',
  continueShopping: 'متابعة التسوق',
  backToCollection: 'العودة إلى المجموعة',
  viewStore: 'زيارة المتجر',
  addToCart: 'أضف إلى السلة',
  outOfStock: 'نفدت الكمية',
  inStock: 'متوفر',
  onlyLeft: 'بقي {count} فقط',
  description: 'الوصف',
  quantity: 'الكمية',
  checkoutEyebrow: 'إتمام الطلب',
  checkoutTitle: 'أكمل طلبك',
  yourOrder: 'طلبك',
  subtotal: 'المجموع الفرعي',
  discount: 'الخصم',
  deliveryFee: 'رسوم التوصيل',
  total: 'الإجمالي',
  contactDetails: 'معلومات التواصل',
  cashOnDelivery: 'الدفع عند الاستلام',
  cashOnDeliveryNote: 'تدفع نقدًا عند وصول طلبك إلى باب منزلك.',
  fullName: 'الاسم الكامل',
  phone: 'رقم الهاتف',
  address: 'عنوان التوصيل',
  placeOrder: 'تأكيد الطلب',
  placingOrder: 'جارٍ تسجيل الطلب…',
  cartEmpty: 'سلتك فارغة',
  clearCart: 'إفراغ السلة',
  yourSelections: 'اختياراتك',
  orderConfirmed: 'تم تأكيد الطلب',
  thankYou: 'شكرًا لك، {name}!',
  orderReceived: 'تم استلام طلبك وجارٍ تجهيزه.',
  orderId: 'رقم الطلب',
  status: 'الحالة',
  delivery: 'التوصيل',
  instantDelivery: 'توصيل فوري',
  required: 'مطلوب',
  nameRequired: 'الاسم مطلوب',
  phoneRequired: 'رقم الهاتف مطلوب',
  addressRequired: 'العنوان مطلوب',
  submitError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
};

const fr: BrandCopy = {
  brandName: 'Dar Benchekroun',
  brandTagline: 'Les plus belles matières · le goût marocain',
  heroEyebrow: 'Les plus belles matières · le goût marocain',
  heroTitle: "L'authenticité dans chaque volute",
  heroTitleLead: 'Ce que les familles marocaines',
  heroTitleAccent: 'se transmettent',
  heroAccentLine: "« On n'invente pas un héritage. On le préserve. »",
  heroSubtitle:
    "Matières nobles, recettes anciennes, gestes d'artisans — réunis dans une seule maison.",
  heroCta: 'Découvrir la collection',
  heroCtaSecondary: "L'histoire de la maison",
  heroImageCaption: 'Serghina · bakhour Dar Benchekroun',
  features: ['Fait main', 'Ingrédients naturels', 'Recettes ancestrales', 'Normes internationales', 'Livraison au Maroc'],
  navHome: 'Accueil',
  navShop: 'Boutique',
  navCategories: 'Catégories',
  navAbout: 'À propos',
  navContact: 'Contact',
  footerBlurb:
    "Dar Benchekroun — encens marocain d'exception, fait main à Fès selon des recettes ancestrales et livré chez vous partout au Maroc.",
  footerExploreTitle: 'Explorer',
  footerRights: 'Tous droits réservés',
  featuredEyebrow: 'Notre collection',
  featuredTitle: 'Notre sélection',
  aboutEyebrow: 'Notre histoire',
  aboutTitle: "Un héritage que l'on porte, pas une marchandise",
  aboutParagraphs: [
    "Depuis des générations, la famille Benchekroun garde ses recettes comme on garde un dépôt : elles passent d'une main à l'autre sans qu'on en retire rien.",
    "Chez nous, quand on reçoit quelqu'un qui compte, on soigne la table… puis on achève l'accueil par une odeur qui lui fait honneur. Le parfum n'est pas un détail : c'est ce qui reste en mémoire une fois l'invité parti.",
    "Nos recettes nous viennent de ceux qui nous ont précédés. Nous ne vendons pas un produit, nous vous tendons une part de cet héritage — avec la responsabilité de le transmettre intact à ceux qui viendront après nous."
  ],
  aboutQuote: "« Le parfum est ce qui reste quand l'invité est parti. »",
  aboutImageCaption: 'Notre histoire · Dar Benchekroun',
  statFoundedValue: '4',
  statFoundedLabel: 'générations de transmission',
  statNaturalValue: '100%',
  statNaturalLabel: 'ingrédients naturels',
  statHandmadeValue: 'À la main',
  statHandmadeLabel: 'préparation entièrement',
  contactEyebrow: 'Contact',
  contactTitle: 'Écrivez-nous',
  contactSubtitle: 'Pour toute question sur nos produits ou vos commandes, écrivez-nous.',
  contactInfoTitle: 'Coordonnées',
  contactEmailLabel: 'E-mail',
  contactMessageLabel: 'Votre message',
  contactSend: 'Envoyer',
  contactSuccess: 'Merci, votre message a bien été reçu. Nous vous répondrons bientôt.',
  contactPhoneValue: '+212 5 35 00 00 00',
  contactEmailValue: 'contact@benchekroun.ma',
  contactAddressValue: 'Médina, Fès, Maroc',
  storyEyebrow: 'Notre histoire',
  storyTitle: 'Un héritage de parfum et de raffinement',
  storyBody:
    "Au cœur du Maroc, nous composons des encens qui allient des ingrédients précieux à un savoir-faire transmis de génération en génération. Chaque pièce est une invitation à un instant de sérénité.",
  collectionEyebrow: 'La collection',
  collectionTitle: 'Des pièces choisies avec soin',
  collectionSubtitle: 'Découvrez toute notre collection',
  categoriesTitle: 'Parcourir par catégorie',
  categoryAll: 'Tout',
  categoryEyebrow: 'Catégorie',
  viewCategory: 'Découvrir',
  backToCategories: 'Retour aux catégories',
  productsEmpty: 'Aucun produit disponible pour le moment.',
  productsError: "Impossible de charger la collection pour l'instant.",
  retry: 'Réessayer',
  backToHome: "Retour à l'accueil",
  continueShopping: 'Continuer les achats',
  backToCollection: 'Retour à la collection',
  viewStore: 'Voir la boutique',
  addToCart: 'Ajouter au panier',
  outOfStock: 'Épuisé',
  inStock: 'En stock',
  onlyLeft: 'Plus que {count}',
  description: 'Description',
  quantity: 'Quantité',
  checkoutEyebrow: 'Commande',
  checkoutTitle: 'Finalisez votre commande',
  yourOrder: 'Votre commande',
  subtotal: 'Sous-total',
  discount: 'Remise',
  deliveryFee: 'Frais de livraison',
  total: 'Total',
  contactDetails: 'Coordonnées',
  cashOnDelivery: 'Paiement à la livraison',
  cashOnDeliveryNote: 'Vous payez en espèces à la réception de votre commande.',
  fullName: 'Nom complet',
  phone: 'Téléphone',
  address: 'Adresse de livraison',
  placeOrder: 'Valider la commande',
  placingOrder: 'Enregistrement…',
  cartEmpty: 'Votre panier est vide',
  clearCart: 'Vider le panier',
  yourSelections: 'Votre sélection',
  orderConfirmed: 'Commande confirmée',
  thankYou: 'Merci, {name} !',
  orderReceived: 'Votre commande a été reçue et est en préparation.',
  orderId: 'N° de commande',
  status: 'Statut',
  delivery: 'Livraison',
  instantDelivery: 'Livraison immédiate',
  required: 'requis',
  nameRequired: 'Le nom est requis',
  phoneRequired: 'Le téléphone est requis',
  addressRequired: "L'adresse est requise",
  submitError: "Une erreur inattendue s'est produite. Veuillez réessayer."
};

const COPY: Record<'ar' | 'fr', BrandCopy> = { ar, fr };

export const getBrandCopy = (locale: Locale): BrandCopy =>
  locale === 'fr' ? COPY.fr : COPY.ar;

export const interpolateCopy = (
  template: string,
  params: Record<string, string | number>
): string => template.replace(/\{(\w+)\}/g, (match, name: string) =>
  name in params ? String(params[name]) : match
);
