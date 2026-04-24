import Link from 'next/link'
import { Eye, EyeOff, Shield, Users, FileText, Star, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans">
      
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafaf8]/95 backdrop-blur border-b border-black/8 px-8 h-16 flex items-center justify-between">
        <div className="font-black text-lg tracking-tight">USH-USH</div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <Link href="/recruteur" className="hover:text-gray-900 transition-colors">Recruteurs</Link>
          <Link href="/ao" className="hover:text-gray-900 transition-colors">Appels d'offres</Link>
          <Link href="/tarifs" className="hover:text-gray-900 transition-colors">Tarifs</Link>
          <Link href="/references" className="hover:text-gray-900 transition-colors">Références</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/connexion" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Connexion
          </Link>
          <Link href="/auth/inscription" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Créer mon profil
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-8 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            CVthèque confidentielle
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-6 text-gray-900">
            Invisible à votre employeur.<br />
            <span className="text-blue-900">Visible aux bons recruteurs.</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8">
            La première CVthèque confidentielle pour les talents en poste. 
            Explorez le marché, recevez des opportunités et restez totalement invisible pour votre employeur.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/auth/inscription" className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm">
              Créer mon profil anonyme →
            </Link>
            <Link href="/recruteur" className="border border-gray-200 text-gray-900 font-medium px-6 py-3 rounded-lg hover:border-gray-400 transition-colors text-sm bg-white">
              Je suis recruteur →
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Votre identité reste masquée</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Votre employeur ne peut pas voir votre profil</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Vous acceptez ou refusez chaque prise de contact</span>
          </div>
          <p className="mt-5 text-sm font-bold text-blue-900">Explorez le marché sans jamais vous exposer.</p>
        </div>
      </section>

      {/* PREUVE SOCIALE */}
      <section className="py-12 px-8 border-y border-black/8 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">Déjà utilisé par</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['Cabinets de recrutement', 'Scaleups', 'ESN', 'Entreprises Tech', 'Grands groupes'].map((item) => (
              <div key={item} className="text-center text-sm font-medium text-gray-400">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 px-8 max-w-6xl mx-auto" id="comment-ca-marche">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Comment ça fonctionne</p>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">4 étapes. Zéro risque.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Créez votre profil anonyme', desc: 'Pseudo, fonction, compétences. Pas de nom, pas d\'entreprise.' },
            { num: '02', title: 'Bloquez votre employeur', desc: 'Ajoutez les domaines à bloquer. Aucun recruteur de ces entreprises ne vous trouve.' },
            { num: '03', title: 'Les recruteurs vous contactent', desc: 'Vous voyez leur cabinet avant de répondre. Vous gardez le contrôle.' },
            { num: '04', title: 'Vous révélez votre identité', desc: 'Uniquement si vous l\'acceptez. Jamais avant.' },
          ].map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-6 border border-black/8">
              <div className="text-3xl font-black text-gray-100 mb-3">{step.num}</div>
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCAGE EMPLOYEUR */}
      <section className="py-20 px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Innovation clé</p>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Votre employeur ne peut pas vous voir.
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Bloquez votre employeur, ses filiales et vos anciens employeurs. 
              Aucun recruteur de ces organisations ne peut trouver votre profil.
            </p>
            <Link href="/auth/inscription" className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm inline-block">
              Essayer gratuitement →
            </Link>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Entreprises bloquées</p>
            <div className="flex flex-col gap-2">
              {['Votre employeur actuel', 'Toutes ses filiales', 'Vos anciens employeurs', 'Tout domaine email de votre choix'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="text-green-400 font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTÈME */}
      <section className="py-20 px-8 bg-[#f4f3ef]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Une plateforme complète</p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Bien plus qu'une CVthèque</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Lock size={20} />, title: 'CVthèque confidentielle', desc: 'Profils anonymisés, blocage employeur, CV accessible sur accord.', items: ['Profils actifs en poste', 'Identité masquée jusqu\'à accord', 'Filtres : fonction, secteur, logiciels'] },
              { icon: <Star size={20} />, title: 'Références professionnelles', desc: 'Pour les candidats et les recruteurs.', items: ['Candidat : constituez votre dossier', 'Recruteur : vérification B2B', 'Rapport détaillé sous 7 jours'] },
              { icon: <FileText size={20} />, title: 'Appels d\'offres cabinets', desc: 'Publiez votre besoin. Les cabinets viennent à vous.', items: ['Publication gratuite', 'Cabinets vérifiés SIRET', 'Vous choisissez votre cabinet'] },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 border border-black/8">
                <div className="w-10 h-10 bg-[#f4f3ef] rounded-xl flex items-center justify-center mb-4 text-gray-700">
                  {card.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{card.desc}</p>
                <div className="flex flex-col gap-1.5">
                  {card.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-700 font-bold">✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-gray-900 text-white text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Rejoignez USH-USH</p>
          <h2 className="text-3xl font-black tracking-tight mb-4">Explorez le marché<br />sans vous exposer.</h2>
          <p className="text-white/60 mb-8">Inscription gratuite · Profil sous pseudonyme · Vous gardez le contrôle</p>
          <Link href="/auth/inscription" className="bg-white text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors inline-block">
            Créer mon profil confidentiel →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-white/5 px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-black text-white">USH-USH</div>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/legal" className="hover:text-white/70 transition-colors">Mentions légales</Link>
            <Link href="/legal" className="hover:text-white/70 transition-colors">CGU</Link>
            <Link href="/legal" className="hover:text-white/70 transition-colors">RGPD</Link>
            <span>contact@ush-ush.fr</span>
          </div>
          <div className="text-xs text-white/25">© 2025 USH-USH</div>
        </div>
      </footer>
    </div>
  )
}
