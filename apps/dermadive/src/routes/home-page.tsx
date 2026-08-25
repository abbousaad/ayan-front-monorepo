import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { AmbianceEau, AmbianceEclat, AmbianceSoleil } from '../components/landing/ambiance';
import { useReveal } from '../hooks/use-reveal';

type ProductChip = { label: string; solid?: boolean };

type LandingProduct = {
  id: string;
  accent: string;
  accentFonce: string;
  flip: boolean;
  step: string;
  name: string;
  type: string;
  desc: string;
  actives: string[];
  benefits: string[];
  chips: ProductChip[];
  image: string;
  cols: [string, string, string, string];
  ambiance: ReactNode;
};

// The three products, lifted from the design. Each carries the stepped colour
// column printed on its own tube and the ambiance motif that section borrows.
const PRODUCTS: LandingProduct[] = [
  {
    id: 'nettodive',
    accent: 'var(--onde)',
    accentFonce: 'var(--onde-fonce)',
    flip: false,
    step: 'Étape 01 — Nettoyer',
    name: 'NettoDive',
    type: 'Gel nettoyant purifiant & hydratant',
    desc: "Un gel qui nettoie en profondeur sans tirailler. L'urée et le panthénol maintiennent le confort de la peau pendant que la formule régule l'excès de sébum.",
    actives: ['Urée', 'Niacinamide', 'Panthénol', 'Extrait de lavande'],
    benefits: ['Nettoie en profondeur', 'Élimine les impuretés', "Régule l'excès de sébum"],
    chips: [{ label: '200 ml · 6,76 fl.oz', solid: true }, { label: 'Tous types de peaux' }, { label: 'Matin et soir' }],
    image: '/images/nettodive.png',
    cols: ['#E8F2F8', '#BEDCEC', '#6EB4D8', '#0E86C4'],
    ambiance: <AmbianceEau />
  },
  {
    id: 'sundive',
    accent: 'var(--soleil)',
    accentFonce: 'var(--soleil-fonce)',
    flip: true,
    step: 'Étape 02 — Protéger',
    name: 'SunDive',
    type: 'Crème solaire invisible — SPF 50+ UVA·UVB',
    desc: "Très haute protection à la texture invisible. Au-delà du filtre, la centella asiatica et la niacinamide travaillent sur les taches et les ridules liées à l'exposition.",
    actives: ['Niacinamide', 'Acide hyaluronique', 'Panthénol', 'Centella asiatica', 'Vitamine E'],
    benefits: ['Protège contre le soleil', 'Éclaircit le teint', 'Prévient les taches et les ridules'],
    chips: [{ label: '50 ml · 1,67 fl.oz', solid: true }, { label: 'Anti-âge & anti-taches' }, { label: 'Tous types de peaux' }],
    image: '/images/sundive.png',
    cols: ['#FCEEDD', '#F6CE9C', '#EFA457', '#E67E28'],
    ambiance: <AmbianceSoleil />
  },
  {
    id: 'ecladive',
    accent: 'var(--argent)',
    accentFonce: 'var(--argent-fonce)',
    flip: false,
    step: 'Étape 03 — Corriger',
    name: 'EclaDive',
    type: 'Crème éclaircissante unifiante & anti-taches',
    desc: 'La formule la plus concentrée de la gamme. Réglisse et niacinamide ciblent les taches pigmentaires, le beurre de karité et l\'acide hyaluronique tiennent la peau souple.',
    actives: ['Niacinamide', 'Extrait de réglisse', 'Acide hyaluronique', 'Panthénol', 'Beurre de karité', 'Vitamine E'],
    benefits: ['Illumine et unifie le teint', 'Réduit les taches pigmentaires', "Améliore l'éclat de la peau"],
    chips: [{ label: '40 ml · 1,3 fl.oz', solid: true }, { label: 'Tous types de peaux' }, { label: 'Le soir' }],
    image: '/images/ecladive.png',
    cols: ['#EEF0F2', '#CBD1D7', '#9AA4AE', '#6E7A86'],
    ambiance: <AmbianceEclat />
  }
];

// Hero packs — bottoms aligned, heights to real scale (tallest = 200 ml bottle).
const PACKS = [
  { key: 'n', tag: 'Nettoyer', image: '/images/nettodive.png', cols: ['#E8F2F8', '#BEDCEC', '#6EB4D8', '#0E86C4'] },
  { key: 's', tag: 'Protéger', image: '/images/sundive.png', cols: ['#FCEEDD', '#F6CE9C', '#EFA457', '#E67E28'] },
  { key: 'e', tag: 'Corriger', image: '/images/ecladive.png', cols: ['#EEF0F2', '#CBD1D7', '#9AA4AE', '#6E7A86'] }
] as const;

const ROUTINE_STEPS = [
  { accent: 'var(--onde)', no: 'Étape 01', verb: 'Nettoyer', when: 'NettoDive — matin et soir', text: "Débarrasse la peau des impuretés et de l'excès de sébum, sans l'assécher." },
  { accent: 'var(--soleil)', no: 'Étape 02', verb: 'Protéger', when: 'SunDive — le matin', text: 'Une barrière SPF 50+ invisible, à appliquer avant toute exposition au soleil.' },
  { accent: 'var(--argent)', no: 'Étape 03', verb: 'Corriger', when: 'EclaDive — le soir', text: "Travaille sur les taches pigmentaires et l'uniformité du teint pendant la nuit." }
];

// Shared actives matrix — a dot per product, `null` where the active is absent.
const O = 'var(--onde)';
const S = 'var(--soleil)';
const A = 'var(--argent-clair)';
const ACTIVES: { name: string; dots: [string | null, string | null, string | null]; common?: boolean }[] = [
  { name: 'Niacinamide', dots: [O, S, A], common: true },
  { name: 'Panthénol', dots: [O, S, A], common: true },
  { name: 'Acide hyaluronique', dots: [null, S, A] },
  { name: 'Vitamine E', dots: [null, S, A] },
  { name: 'Urée', dots: [O, null, null] },
  { name: 'Extrait de lavande', dots: [O, null, null] },
  { name: 'Centella asiatica', dots: [null, S, null] },
  { name: 'Extrait de réglisse', dots: [null, null, A] },
  { name: 'Beurre de karité', dots: [null, null, A] }
];

export function HomePage() {
  useReveal();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="wrap">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow rise">Trois produits · Une routine complète</p>
              <h1 className="rise" data-d="1">
                Des soins experts<em>pour une peau en pleine santé</em>
              </h1>
              <p className="lede rise" data-d="2">
                Nettoyer, protéger, corriger. Trois formules construites pour agir dans le même sens, sur tous
                les types de peaux.
              </p>
              <div className="hero__cta rise" data-d="3">
                <a className="btn" href="#routine">
                  Voir la routine
                </a>
                <Link className="btn btn--ghost" to="/shop">
                  Boutique
                </Link>
              </div>
            </div>

            <div className="packs rise" data-d="2">
              {PACKS.map((pack) => (
                <div key={pack.key} className={`pack pack--${pack.key}`}>
                  <div className="pack__col" aria-hidden="true">
                    {pack.cols.map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </div>
                  <span className="pack__tag">{pack.tag}</span>
                  <img src={pack.image} alt="" />
                </div>
              ))}
            </div>
          </div>

          <div className="hero__meta">
            <div className="rise">
              <strong>Tous types de peaux</strong>
              <span>Les trois formules sont conçues pour un usage quotidien.</span>
            </div>
            <div className="rise" data-d="1">
              <strong>Niacinamide</strong>
              <span>Présente dans les trois produits, du nettoyage à la correction.</span>
            </div>
            <div className="rise" data-d="2">
              <strong>SPF 50+ UVA·UVB</strong>
              <span>Très haute protection, texture invisible, sans fini blanc.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROUTINE ================= */}
      <section className="routine" id="routine">
        <div className="wrap">
          <div className="routine__head">
            <div>
              <p className="eyebrow rise">La routine</p>
              <h2 className="rise" data-d="1">
                Trois gestes,
                <br />
                dans cet ordre
              </h2>
            </div>
            <p className="lede rise" data-d="2">
              L'ordre compte autant que les formules : on nettoie avant de protéger, on corrige quand la peau
              n'est plus exposée.
            </p>
          </div>

          <div className="steps">
            {ROUTINE_STEPS.map((step, index) => (
              <article
                key={step.verb}
                className="step rise"
                data-d={index === 0 ? undefined : String(index)}
                style={{ '--c': step.accent } as CSSProperties}
              >
                <p className="step__no">{step.no}</p>
                <h3 className="step__verb">{step.verb}</h3>
                <p className="step__when">{step.when}</p>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUITS ================= */}
      <div id="produits">
        {PRODUCTS.map((product) => (
          <section
            key={product.id}
            className={`produit${product.flip ? ' produit--flip' : ''}`}
            id={product.id}
            style={{ '--c': product.accent, '--c-fonce': product.accentFonce } as CSSProperties}
          >
            {product.ambiance}
            <div className="wrap">
              <div className="produit__grid">
                <div className="shot rise">
                  <div className="shot__col" aria-hidden="true">
                    {product.cols.map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </div>
                  <img src={product.image} alt={product.name} />
                </div>

                <div>
                  <p className="produit__no rise">{product.step}</p>
                  <h2 className="rise" data-d="1">
                    {product.name}
                  </h2>
                  <p className="produit__type rise" data-d="1">
                    {product.type}
                  </p>
                  <p className="produit__desc rise" data-d="2">
                    {product.desc}
                  </p>
                  <div className="actifs-band rise" data-d="2">
                    {product.actives.map((active) => (
                      <span key={active}>{active}</span>
                    ))}
                  </div>
                  <ul className="benefices rise" data-d="3">
                    {product.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                  <div className="produit__pied rise" data-d="3">
                    {product.chips.map((chip) => (
                      <span key={chip.label} className={`chip${chip.solid ? ' chip--solid' : ''}`}>
                        {chip.label}
                      </span>
                    ))}
                    <Link className="btn btn--ghost" to="/shop">
                      Commander
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ================= ACTIFS ================= */}
      <section className="actifs" id="actifs">
        <div className="wrap">
          <div className="actifs__head">
            <p className="eyebrow rise">Formulation</p>
            <h2 className="rise" data-d="1">
              Ce que les trois formules partagent
            </h2>
            <p className="rise" data-d="2">
              La niacinamide et le panthénol traversent toute la gamme. C'est ce qui permet aux trois produits
              de travailler dans le même sens plutôt que de se contredire.
            </p>
          </div>

          <table className="matrice rise" data-d="2">
            <thead>
              <tr>
                <th scope="col">Actif</th>
                <th scope="col">NettoDive</th>
                <th scope="col">SunDive</th>
                <th scope="col">EclaDive</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVES.map((active) => (
                <tr key={active.name} className={active.common ? 'is-common' : undefined}>
                  <th scope="row">{active.name}</th>
                  {active.dots.map((color, index) => (
                    <td key={index}>
                      {color ? (
                        <span className="dot" style={{ '--c': color } as CSSProperties} />
                      ) : (
                        <span className="dot dot--off" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="matrice__note">Lignes grisées : actifs communs aux trois produits</p>
        </div>
      </section>
    </>
  );
}
