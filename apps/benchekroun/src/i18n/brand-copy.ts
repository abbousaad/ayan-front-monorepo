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
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  collectionEyebrow: string;
  collectionTitle: string;
  collectionSubtitle: string;
  productsEmpty: string;
  productsError: string;
  retry: string;
  backToHome: string;
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
  brandTagline: 'بخور مغربي فاخر',
  heroEyebrow: 'بخور مغربي أصيل · فاس',
  heroTitle: 'عبق الأصالة في كل خيط دخان',
  heroTitleLead: 'سرغينة مخزنية',
  heroTitleAccent: 'تُروى بالبخور',
  heroAccentLine: "L'art du bakhour marocain, façonné à la main.",
  heroSubtitle:
    'خلطات مخزنية عريقة من العنبر والمسك والعود، تُحضّر على النار الهادئة وفق وصفات توارثتها الأجيال في دار بنشقرون.',
  heroCta: 'اكتشف المجموعة',
  heroCtaSecondary: 'قصة الدار',
  heroImageCaption: 'سرغينة · بخور دار بنشقرون',
  storyEyebrow: 'حكايتنا',
  storyTitle: 'إرثٌ من العطر والفخامة',
  storyBody:
    'من قلب المغرب، نصوغ بخورًا يجمع بين نفائس المكونات وحرفية توارثتها الأجيال. كل قطعة دعوة إلى لحظة سكينة وأناقة.',
  collectionEyebrow: 'المجموعة',
  collectionTitle: 'روائع مختارة بعناية',
  collectionSubtitle: 'تصفّح تشكيلتنا الكاملة من البخور والعود الفاخر.',
  productsEmpty: 'لا توجد منتجات متاحة حاليًا.',
  productsError: 'تعذّر تحميل المجموعة الآن.',
  retry: 'إعادة المحاولة',
  backToHome: 'العودة إلى الرئيسية',
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
  brandTagline: "Encens marocain d'exception",
  heroEyebrow: 'Parfumerie traditionnelle · Fès',
  heroTitle: "L'authenticité dans chaque volute",
  heroTitleLead: "L'art du bakhour",
  heroTitleAccent: 'façonné à la main',
  heroAccentLine: 'Ambre, musc et oud — brûlés au feu doux.',
  heroSubtitle:
    "Des compositions d'ambre, de musc et d'oud, brûlées au feu doux selon des recettes transmises de génération en génération chez Dar Benchekroun.",
  heroCta: 'Découvrir la collection',
  heroCtaSecondary: "L'histoire de la maison",
  heroImageCaption: 'Serghina · bakhour Dar Benchekroun',
  storyEyebrow: 'Notre histoire',
  storyTitle: 'Un héritage de parfum et de raffinement',
  storyBody:
    "Au cœur du Maroc, nous composons des encens qui allient des ingrédients précieux à un savoir-faire transmis de génération en génération. Chaque pièce est une invitation à un instant de sérénité.",
  collectionEyebrow: 'La collection',
  collectionTitle: 'Des pièces choisies avec soin',
  collectionSubtitle: "Parcourez notre gamme complète d'encens et de bois d'oud d'exception.",
  productsEmpty: 'Aucun produit disponible pour le moment.',
  productsError: "Impossible de charger la collection pour l'instant.",
  retry: 'Réessayer',
  backToHome: "Retour à l'accueil",
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
