import type { Locale } from '@acme/shared';

/**
 * Bespoke functional + brand copy for Dermadive. The site is French-only (the
 * supplied design ships no Arabic), so a single `fr` bundle backs everything.
 * The rich landing narrative is authored directly in the landing components; the
 * strings here cover the reusable storefront chrome (cart, shop, checkout,
 * contact) so those components never depend on the server translation baseline.
 */
export type BrandCopy = {
  brandName: string;
  brandTagline: string;
  // nav / chrome
  navShop: string;
  navRoutine: string;
  navProducts: string;
  navActives: string;
  navContact: string;
  cartLabel: string;
  close: string;
  checkout: string;
  // footer
  footerBlurb: string;
  footerRights: string;
  // shop / product
  shopTitle: string;
  productsEmpty: string;
  productsError: string;
  retry: string;
  backToHome: string;
  backToShop: string;
  continueShopping: string;
  addToCart: string;
  outOfStock: string;
  inStock: string;
  onlyLeft: string; // uses {count}
  description: string;
  quantity: string;
  // cart / checkout
  checkoutEyebrow: string;
  checkoutTitle: string;
  yourOrder: string;
  yourSelections: string;
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
  // confirmation
  orderConfirmed: string;
  thankYou: string; // uses {name}
  orderReceived: string;
  orderId: string;
  status: string;
  delivery: string;
  instantDelivery: string;
  nameRequired: string;
  phoneRequired: string;
  addressRequired: string;
  submitError: string;
  // contact page
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
};

const fr: BrandCopy = {
  brandName: 'Dermadive',
  brandTagline: 'Trois produits · une routine complète',
  navShop: 'Boutique',
  navRoutine: 'Routine',
  navProducts: 'Produits',
  navActives: 'Actifs',
  navContact: 'Contact',
  cartLabel: 'Panier',
  close: 'Fermer',
  checkout: 'Commander',
  footerBlurb:
    'Trois soins dermo-cosmétiques formulés pour un usage quotidien, sur tous les types de peaux.',
  footerRights: 'Tous droits réservés',
  shopTitle: 'La gamme',
  productsEmpty: 'Aucun produit disponible pour le moment.',
  productsError: "Impossible de charger la gamme pour l'instant.",
  retry: 'Réessayer',
  backToHome: "Retour à l'accueil",
  backToShop: 'Retour à la boutique',
  continueShopping: 'Continuer les achats',
  addToCart: 'Ajouter au panier',
  outOfStock: 'Épuisé',
  inStock: 'En stock',
  onlyLeft: 'Plus que {count}',
  description: 'Description',
  quantity: 'Quantité',
  checkoutEyebrow: 'Commande',
  checkoutTitle: 'Finalisez votre commande',
  yourOrder: 'Votre commande',
  yourSelections: 'Votre sélection',
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
  orderConfirmed: 'Commande confirmée',
  thankYou: 'Merci, {name} !',
  orderReceived: 'Votre commande a été reçue et est en préparation.',
  orderId: 'N° de commande',
  status: 'Statut',
  delivery: 'Livraison',
  instantDelivery: 'Livraison immédiate',
  nameRequired: 'Le nom est requis',
  phoneRequired: 'Le téléphone est requis',
  addressRequired: "L'adresse est requise",
  submitError: "Une erreur inattendue s'est produite. Veuillez réessayer.",
  contactEyebrow: 'Contact',
  contactTitle: 'Écrivez-nous',
  contactSubtitle: 'Pour toute question sur nos produits ou vos commandes, écrivez-nous.',
  contactInfoTitle: 'Coordonnées',
  contactEmailLabel: 'E-mail',
  contactMessageLabel: 'Votre message',
  contactSend: 'Envoyer',
  contactSuccess: 'Merci, votre message a bien été reçu. Nous vous répondrons bientôt.',
  contactPhoneValue: '+212 5 22 00 00 00',
  contactEmailValue: 'contact@dermadive.ma',
  contactAddressValue: 'Casablanca, Maroc'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getBrandCopy = (_locale: Locale): BrandCopy => fr;

export const interpolateCopy = (
  template: string,
  params: Record<string, string | number>
): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
