'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function HomePage() {
  const revealRefs = useRef<(HTMLElement | null)[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const timer = setTimeout(() => {
      revealRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    }, 50)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [])

  const addRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  const faqs = [
    { q: "Mon employeur peut-il me trouver sur KeptCore ?", a: "Non. Votre profil est anonymisé par défaut. Vous pouvez bloquer votre employeur et toutes ses filiales en ajoutant leur domaine email. Aucun recruteur de ces organisations ne peut vous trouver ni vous contacter." },
    { q: "Est-ce que les recruteurs voient mon nom ?", a: "Non. Les recruteurs voient uniquement votre pseudo, votre fonction, vos compétences et votre disponibilité. Votre nom, votre entreprise et vos coordonnées ne sont révélés que si vous acceptez explicitement une demande de contact." },
    { q: "C'est gratuit pour les candidats ?", a: "Oui, la création et la gestion de votre profil sont entièrement gratuites. Des services complémentaires comme les références professionnelles ou le simulateur d'entretien sont disponibles en option." },
    { q: "Puis-je mettre mon profil en pause ?", a: "Oui. Vous pouvez à tout moment rendre votre profil invisible, le mettre en pause ou le supprimer définitivement. Vous gardez le contrôle total." },
    { q: "Mes données sont-elles sécurisées ?", a: "Oui. Vos données sont hébergées en France, conformes au RGPD et ne sont jamais revendues à des tiers. Seuls les recruteurs que vous avez autorisés peuvent accéder à vos informations complètes." }
  ]

  return (
    <div style={{ background: '#fafaf8', color: '#1a1a1a', fontFamily: "'Inter', sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 3rem', height: '76px',
        background: 'rgba(250,250,248,0.96)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <Image src="/logo-keptcore.png" alt="KeptCore" width={36} height={36} style={{ objectFit: 'contain' }} priority />
          <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em' }}>KeptCore</span>
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          <a href="#comment-ca-marche" className="nav-btn" style={navBtn}>Comment ça marche</a>
          <a href="/recruteur" className="nav-btn" style={navBtn}>Recruteurs</a>
          <a href="#tarifs" className="nav-btn" style={navBtn}>Tarifs</a>
          <a href="#faq" className="nav-btn" style={navBtn}>FAQ</a>
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <a href="/auth/connexion" className="nav-ghost" style={navGhost}>Connexion</a>
          <a href="/auth/inscription" className="nav-cta" style={navCta}>Créer mon profil</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: '76px' }}>
        <div style={{
          maxWidth: '1160px', margin: '0 auto',
          padding: '8rem 3rem 5rem',
          display: 'grid', gridTemplateColumns: '1fr 1.2fr',
          gap: '4rem', alignItems: 'center'
        }}>
          <div>
            <div className="a1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase',
              color: '#111', marginBottom: '1.5rem'
            }}>
              <span style={{ width: '28px', height: '1px', background: '#555' }}></span>
              Confidentiel par défaut · Tous profils
            </div>
            <h1 className="a2" style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-.01em', color: '#1a1a1a',
              marginBottom: '1.5rem'
            }}>
              Cherchez un nouveau poste.<br/>
              <span style={{ color: '#1e3a8a' }}>Sans que votre employeur ne le sache.</span>
            </h1>
            <p className="a3" style={{
              fontSize: '.95rem', color: '#6b6b6b', lineHeight: 1.8,
              marginBottom: '2.5rem', maxWidth: '460px'
            }}>
              Pour ceux qui explorent le marché&hellip; sans mettre leur carrière en danger.
            </p>
            <div className="a4" style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <a href="/auth/inscription" className="btn-primary" style={btnPrimary}>Créer mon profil confidentiel</a>
              <a href="/recruteur" className="btn-outline" style={btnOutline}>Je suis recruteur →</a>
            </div>
            <div className="a5" style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
              <PromiseItem>Votre identité reste masquée</PromiseItem>
              <PromiseItem>Votre employeur ne peut pas voir votre profil</PromiseItem>
              <PromiseItem>Vous acceptez ou refusez chaque prise de contact</PromiseItem>
            </div>
          </div>

          <div className="a2" style={{ position: 'relative' }}>
            <div style={{
              position: 'relative', borderRadius: '16px', overflow: 'hidden',
              height: '640px',
              background: 'linear-gradient(135deg, #e8e7e3 0%, #d4d2cd 100%)'
            }}>
              <Image src="/hero-executive.png" alt="Executive anonyme" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(250,250,248,.6))' }}></div>
            </div>
            <div className="fc1" style={{ ...floatingCard, top: '1rem', right: '1rem' }}>
              <div style={fcLabel}>Identité</div>
              <div style={fcVal}>Profil anonyme</div>
            </div>
            <div className="fc2" style={{ ...floatingCard, bottom: '3rem', left: '1rem' }}>
              <div style={fcLabel}>Entreprise</div>
              <div style={fcVal}>Domaine bloqué</div>
            </div>
            <div className="fc3" style={{ ...floatingCard, top: '42%', right: '1rem' }}>
              <div style={fcLabel}>Statut</div>
              <div style={{ ...fcVal, color: '#2d6a4f' }}>● À l&apos;écoute</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: '#1a1a1a', color: 'white' }}>
        <div style={{
          maxWidth: '1160px', margin: '0 auto', padding: '2rem 3rem',
          display: 'flex', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap'
        }}>
          <StatItem num="100%" label="Identité masquée"/>
          <div style={statSep}></div>
          <StatItem num="0" label="CV partagé sans accord"/>
          <div style={statSep}></div>
          <StatItem num="Tous" label="Secteurs couverts"/>
          <div style={statSep}></div>
          <StatItem num="Gratuit" label="Pour les candidats"/>
        </div>
      </div>

      {/* FEATURES */}
      <section style={section}>
        <div ref={addRef} className="reveal"><SectionEyebrow>Pourquoi KeptCore</SectionEyebrow></div>
        <h2 ref={addRef} className="reveal rd1" style={sectionTitle}>Conçu pour ceux qui explorent… en silence</h2>
        <p ref={addRef} className="reveal rd2" style={sectionSub}>À partir de 65k€ de package, une recherche visible peut fragiliser votre position actuelle. KeptCore est fait pour vous.</p>
        <div ref={addRef} className="reveal rd3" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px', overflow: 'hidden'
        }}>
          <FeatCard num="01" title="Anonymat absolu" desc={'Ni votre nom, ni votre employeur. Vous décrivez votre secteur librement — "Groupe industriel coté" plutôt que votre entreprise réelle.'}/>
          <FeatCard num="02" title="Blocage par domaine" desc="Bloquez @votregroupe.fr, ses filiales et les cabinets mandatés. Aucune exposition interne possible."/>
          <FeatCard num="03" title="Package complet visible" desc="Variable, véhicule, LTIP, intéressement, participation. Les recruteurs savent exactement ce qu'il faut proposer."/>
          <FeatCard num="04" title="Vous choisissez" desc="Aucun contact sans votre accord. Votre CV n'est jamais partagé automatiquement — vous restez maître."/>
        </div>
      </section>

      {/* CE QUE VOIENT LES RECRUTEURS */}
      <section style={{ ...section, background: '#f4f3ef', maxWidth: '100%', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 3rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div ref={addRef} className="reveal"><SectionEyebrow>Votre profil</SectionEyebrow></div>
            <h2 ref={addRef} className="reveal rd1" style={sectionTitle}>Ce que voient les recruteurs</h2>
            <p ref={addRef} className="reveal rd2" style={{ ...sectionSub, marginBottom: '1.5rem' }}>Le recruteur voit votre fonction, vos compétences et votre disponibilité. Jamais votre nom, votre entreprise ni vos coordonnées.</p>
            <p ref={addRef} className="reveal rd3" style={{ fontSize: '.85rem', color: '#6b6b6b', lineHeight: 1.7 }}>Vous voyez qui a consulté votre profil, combien de tentatives ont été bloquées, et vous pouvez mettre votre profil en pause à tout moment.</p>
          </div>
          <div ref={addRef} className="reveal rd2" style={profileCard}>
            <div style={pcHead}>
              <div style={{ ...pcAv, background: '#e5e7eb', color: '#9ca3af' }}>?</div>
              <div style={{ flex: 1 }}>
                <div style={pcTitle}>Directrice des Ressources Humaines</div>
                <div style={{ fontSize: '.75rem', color: '#6b6b6b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '.4rem', flexWrap: 'wrap' }}>
                  <span style={pseudoBadge}>drh_lead_paris</span>
                  <span>· 14 ans · Médico-social / Santé</span>
                </div>
              </div>
              <div style={pcStatus}>À l&apos;écoute</div>
            </div>
            <PcRow lbl="Niveau" val="Directeur · Bac+5 Master RH"/>
            <PcRow lbl="Spécialités" val="Transformation RH · CODIR · M&A · Relations sociales"/>
            <PcRow lbl="Management" val="Oui — équipe de 8 personnes"/>
            <PcRow lbl="Logiciels" val="Sage X3 · Mercateam · Beetween · SAP SuccessFactors"/>
            <PcRow lbl="Localisation" val="Île-de-France"/>
            <PcRow lbl="Mobilité" val="Île-de-France · Normandie · France entière"/>
            <PcRow lbl="Télétravail" val="Hybride — 2j / semaine min"/>
            <PcRow lbl="Salaire souhaité" val="Confidentiel" italic/>
            <PcRow lbl="Disponibilité" val="Sous 3 mois"/>
            <PcRow lbl="Langues" val="Français · Anglais courant · Espagnol notions"/>
            <PcRow lbl="Type contrat" val="CDI · Freelance"/>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginTop: '.9rem' }}>
              {['DRH', 'CODIR', 'Transformation RH', 'M&A RH', 'Sage X3', 'Relations sociales'].map(t => (
                <span key={t} style={pcTag}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '1rem' }}>
              <button style={{ ...ctaBtn, background: '#f8f9fa', border: '1px solid #e5e7eb', color: '#1a1a1a' }}>📄 Voir le CV anonymisé</button>
              <button style={{ ...ctaBtn, background: '#1a1a1a', color: 'white', fontWeight: 600 }}>Envoyer une demande de contact →</button>
              <div style={{ textAlign: 'center', fontSize: '.72rem', color: '#9ca3af' }}>🔒 Coordonnées révélées uniquement après acceptation du candidat</div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEME DE PROTECTION */}
      <section style={section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div ref={addRef} className="reveal"><SectionEyebrow>Confidentialité</SectionEyebrow></div>
            <h2 ref={addRef} className="reveal rd1" style={sectionTitle}>Votre système de protection</h2>
            <p ref={addRef} className="reveal rd2" style={{ ...sectionSub, marginBottom: 0 }}>Ajoutez les domaines à bloquer en quelques secondes. Aucun recruteur de ces organisations ne peut vous trouver ni vous contacter.</p>
          </div>
          <div ref={addRef} className="reveal rd2" style={{
            background: '#ffffff', border: '1px solid rgba(0,0,0,.08)',
            borderRadius: '12px', overflow: 'hidden', maxWidth: '560px',
            boxShadow: '0 2px 16px rgba(0,0,0,.06)'
          }}>
            <BlockRow domain="@mongroupe.fr" tag="Bloqué" note="Votre employeur" blocked/>
            <BlockRow domain="@filiale-groupe.fr" tag="Bloqué" note="Filiale" blocked/>
            <BlockRow domain="@cabinetmandate.fr" tag="Bloqué" note="Cabinet mandaté" blocked/>
            <BlockRow domain="@cabinetrecrutement.com" tag="Autorisé" note="Peut vous contacter"/>
            <BlockRow domain="@chasseurtetes.fr" tag="Autorisé" note="Peut vous contacter"/>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section id="comment-ca-marche" style={{ ...section, background: '#f4f3ef', maxWidth: '100%', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 3rem' }}>
          <div ref={addRef} className="reveal"><SectionEyebrow>En pratique</SectionEyebrow></div>
          <h2 ref={addRef} className="reveal rd1" style={sectionTitle}>Comment ça marche</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <HowItem num="01" title="Créez votre profil" desc="Poste, compétences, conditions, package. Tout en anonyme, en 5 minutes."/>
            <HowItem num="02" title="Bloquez vos domaines" desc="Votre employeur, ses filiales, les cabinets mandatés. Zéro risque d'exposition."/>
            <HowItem num="03" title="Recevez des demandes" desc="Un recruteur vous trouve. Vous voyez son cabinet avant de décider de répondre."/>
            <HowItem num="04" title="Vous choisissez" desc="Acceptez, refusez ou mettez en pause. Vous gardez le contrôle à chaque étape."/>
          </div>
        </div>
      </section>

      {/* SECTION EXECUTIVE DARK */}
      <section style={{ background: '#1a1a1a', padding: '5rem 3rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div ref={addRef} className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.9)', marginBottom: '.75rem' }}>
              <span style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,.5)' }}></span>Profils Executive
            </div>
            <h2 ref={addRef} className="reveal rd1" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 500, lineHeight: 1.2, color: 'white', marginBottom: '1rem' }}>
              Pour les profils<br/>
              <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.9)' }}>qui ont le plus à perdre.</em>
            </h2>
            <p ref={addRef} className="reveal rd2" style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.9)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '460px' }}>
              DAF, DRH, DSI, Directeur Commercial… À partir de 65k€ de package, une recherche visible peut fragiliser votre position. KeptCore vous protège.
            </p>
            <div ref={addRef} className="reveal rd3" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '2.5rem' }}>
              <DarkBullet>Variable, LTIP, stock-options — votre package complet visible</DarkBullet>
              <DarkBullet>Les meilleurs cabinets de chasse — vous choisissez qui vous contacte</DarkBullet>
              <DarkBullet>Badge Executive — visibilité premium auprès des chasseurs de têtes</DarkBullet>
            </div>
            <a ref={addRef} className="reveal rd3" href="/auth/inscription" style={{ background: 'white', color: '#1a1a1a', textDecoration: 'none', fontSize: '.85rem', fontWeight: 600, padding: '.75rem 1.75rem', borderRadius: '8px', display: 'inline-block', letterSpacing: '.02em' }}>Créer mon profil Executive →</a>
          </div>
          <div ref={addRef} className="reveal rd2" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: '1.25rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(196,163,90,.15)', border: '1px solid rgba(196,163,90,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 600, color: 'rgba(255,255,255,.9)' }}>?</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'white' }}>Directeur Administratif et Financier</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.9)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '.4rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,.1)', borderRadius: '3px', padding: '1px 6px', fontFamily: 'monospace' }}>daf_lyon_871</span>
                  <span>· 18 ans · Industrie / Manufacturing · Île-de-France</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.3rem' }}>
                <div style={{ padding: '3px 10px', background: 'rgba(45,106,79,.25)', border: '1px solid rgba(45,106,79,.4)', color: 'white', fontSize: '.7rem', borderRadius: '20px', fontWeight: 500 }}>À l&apos;écoute</div>
                <div style={{ padding: '2px 8px', background: 'rgba(196,163,90,.2)', border: '1px solid rgba(196,163,90,.35)', color: 'white', fontSize: '.65rem', borderRadius: '20px', fontWeight: 700 }}>Executive 65k+</div>
              </div>
            </div>
            <DarkRow lbl="Niveau" val="C-Level · Bac+5 Grande École"/>
            <DarkRow lbl="Spécialités" val="M&A · Consolidation · Trésorerie · CODIR"/>
            <DarkRow lbl="Management" val="Oui — équipe de 12 personnes"/>
            <DarkRow lbl="Logiciels" val="SAP · Sage X3 · Cegid · Kyriba"/>
            <DarkRow lbl="Salaire souhaité" val="Confidentiel"/>
            <DarkRow lbl="Package Executive" val="Variable · LTIP · Stock-options"/>
            <DarkRow lbl="Localisation" val="Île-de-France"/>
            <DarkRow lbl="Mobilité" val="Île-de-France · Grand Est"/>
            <DarkRow lbl="Télétravail" val="Hybride — 2j / semaine"/>
            <DarkRow lbl="Disponibilité" val="Préavis 3 mois"/>
            <DarkRow lbl="Langues" val="Français · Anglais courant · Allemand notions" last/>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem', marginTop: '.85rem' }}>
              {['DAF', 'M&A', 'CODIR'].map(t => (
                <span key={t} style={{ padding: '3px 10px', background: 'rgba(196,163,90,.15)', border: '1px solid rgba(196,163,90,.3)', borderRadius: '20px', fontSize: '.72rem', color: 'white', fontWeight: 500 }}>{t}</span>
              ))}
              {['SAP', 'Consolidation', 'Trésorerie'].map(t => (
                <span key={t} style={{ padding: '3px 10px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '20px', fontSize: '.72rem', color: 'rgba(255,255,255,.9)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BIEN PLUS QU'UNE CVTHEQUE */}
      <section style={{ padding: '6rem 0', background: '#f4f3ef' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em', color: '#6b6b6b', marginBottom: '.75rem' }}>Une plateforme complète</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: '1rem' }}>Bien plus qu&apos;une CVthèque</div>
            <div style={{ fontSize: '1rem', color: '#6b6b6b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>La combinaison unique qui n&apos;existait pas : CVthèque confidentielle, références professionnelles et appels d&apos;offres — au même endroit.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <EcoCard icon="🔒" title="CVthèque confidentielle" desc="Accédez à des profils en poste, anonymisés par défaut. Fonction, compétences, logiciels, disponibilité — sans jamais connaître l'identité avant accord." items={['Profils actifs en poste', 'Identité masquée jusqu'à accord', 'CV anonymisé accessible', 'Filtres : fonction, secteur, logiciels...']}/>
            <EcoCard icon="⭐" title="Références professionnelles" desc="Vérifiez les références d'un candidat avant de l'intégrer, ou constituez votre dossier de références pour renforcer votre crédibilité sur le marché." items={['Candidat : constituez votre dossier de références', 'Recruteur : vérification B2B avant intégration', 'Rapport détaillé et vérifiable', 'Réponse sous 7 jours garantie']}/>
            <EcoCard icon="💼" title="Appels d&apos;offres cabinets" desc="Publiez vos besoins de recrutement et recevez des propositions de cabinets vérifiés. Vous gardez l'anonymat jusqu'à ce que vous sélectionniez un cabinet." items={['Publication gratuite pour entreprises', 'Cabinets vérifiés SIRET + avis', 'Honoraires transparents', 'Vous choisissez votre cabinet']}/>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '.4rem' }}>La seule plateforme RH où le candidat garde le contrôle.</div>
            <div style={{ fontSize: '.88rem', color: '#6b6b6b' }}>CVthèque · Références · Appels d&apos;offres — un écosystème pensé pour un recrutement discret et efficace.</div>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section style={{ padding: '5rem 0', background: '#fafaf8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em', color: '#6b6b6b', marginBottom: '.75rem' }}>Ils utilisent KeptCore</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-.03em', color: '#1a1a1a' }}>Ce qu&apos;ils en disent</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <Testimonial quote="J&apos;explorais le marché depuis 6 mois sans que mon employeur le sache. KeptCore m&apos;a permis d&apos;être contacté par 3 cabinets pertinents. J&apos;ai finalement décroché un poste de DAF avec 30% d&apos;augmentation." pseudo="daf_lyon_871" role="DAF · Industrie · Lyon" initials="daf"/>
            <Testimonial quote="En poste dans une grande entreprise, je ne pouvais pas me permettre d&apos;être visible sur LinkedIn. KeptCore m&apos;a donné accès à des opportunités confidentielles. Mon employeur n&apos;a jamais rien su." pseudo="drh_lead_paris" role="DRH · Médico-social · Paris" initials="drh"/>
            <Testimonial quote="Le système de blocage d&apos;entreprises est génial. J&apos;ai bloqué mon groupe et ses filiales. Je reçois des demandes de qualité sans aucun risque. C&apos;est exactement ce qui manquait sur le marché." pseudo="dsi_senior_42" role="DSI · Tech · Île-de-France" initials="dsi"/>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 0', background: 'white' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em', color: '#6b6b6b', marginBottom: '.75rem' }}>Questions fréquentes</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-.03em', color: '#1a1a1a' }}>On répond à tout</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ border: '1px solid rgba(0,0,0,.08)', borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '1.25rem 1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '.92rem', fontWeight: 600, color: '#1a1a1a', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {f.q}
                  <span style={{ fontSize: '1.2rem', fontWeight: 300 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '.85rem', color: '#555', lineHeight: 1.8 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS RESUME */}
      <section id="tarifs" style={{ padding: '5rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em', color: '#6b6b6b', marginBottom: '.75rem' }}>Tarifs</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-.03em', color: '#1a1a1a' }}>Simple et transparent</div>
            <div style={{ fontSize: '.95rem', color: '#6b6b6b', marginTop: '.5rem' }}>Les candidats sont toujours gratuits.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <PriceCard label="Candidat" price="Gratuit" sub="pour toujours" items={['Profil anonymisé', 'Blocage employeur', 'Vous gardez le contrôle', 'Simulateur d'entretien']} cta="Créer mon profil →" href="/auth/inscription"/>
            <PriceCard label="Recruteur Pro" price="149 €" sub="/mois · sans engagement" items={['CVthèque illimitée', 'Filtres avancés', 'Messagerie intégrée', 'Support prioritaire']} cta="Démarrer →" href="/auth/inscription-recruteur" featured/>
            <PriceCard label="À la carte" price="49 €" sub="par accès AO" items={['Accès AO cabinet : 49€', 'Références candidat : 29€', 'Vérif. B2B : 89€', 'Simulateur : 9,90€']} cta="Voir tous les tarifs" href="/tarifs" outline/>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: '#1a1a1a', padding: '6rem 3rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>Rejoignez KeptCore</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: 'white', lineHeight: 1.15, marginBottom: '1.25rem' }}>Explorez le marché<br/>sans vous exposer.</h2>
          <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', lineHeight: 1.7 }}>Les talents expérimentés utilisent KeptCore pour rester visibles uniquement par les bons recruteurs. Sous pseudonyme. Gratuitement.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <CtaPill>Inscription gratuite</CtaPill>
            <CtaPill>Profil sous pseudonyme</CtaPill>
            <CtaPill>Vous gardez le contrôle</CtaPill>
          </div>
          <a href="/auth/inscription" style={{ background: 'white', color: '#1a1a1a', textDecoration: 'none', fontSize: '.88rem', fontWeight: 600, padding: '.85rem 2.25rem', borderRadius: '8px', display: 'inline-block', letterSpacing: '.02em' }}>Créer mon profil confidentiel</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '3rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
                <Image src="/logo-keptcore.png" alt="KeptCore" width={28} height={28} style={{ objectFit: 'contain', filter: 'invert(1) brightness(2)' }}/>
                <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-.02em' }}>KEPTCORE</div>
              </div>
              <div style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.8, maxWidth: '260px' }}>La CVthèque confidentielle pour les professionnels en poste. Invisible à votre employeur. Visible aux bons recruteurs.</div>
              <div style={{ marginTop: '1rem', fontSize: '.78rem', color: 'rgba(255,255,255,.3)' }}>contact@keptcore.fr</div>
            </div>
            <FooterCol title="Plateforme" links={[['Candidats', '/'], ['Recruteurs', '/recruteur'], ['Appels d'offres', '#'], ['Références', '#'], ['Tarifs', '#tarifs']]}/>
            <FooterCol title="Compte" links={[['Créer un profil candidat', '/auth/inscription'], ['Inscription recruteur', '/auth/inscription-recruteur'], ['Se connecter', '/auth/connexion'], ['Mot de passe oublié', '/auth/mot-de-passe-oublie']]}/>
            <FooterCol title="Légal" links={[['Mentions légales', '/legal'], ['CGU', '/cgu'], ['CGV', '/legal'], ['Politique RGPD', '/legal']]}/>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)' }}>© 2026 KeptCore — Tous droits réservés</div>
            <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)' }}>Hébergé en France · Données RGPD · Aucune publicité</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ============ STYLES ============
const navBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#6b6b6b', fontSize: '.82rem', padding: '.35rem .85rem', borderRadius: '8px', textDecoration: 'none', letterSpacing: '.02em', cursor: 'pointer' }
const navGhost: React.CSSProperties = { background: 'none', border: '1px solid rgba(0,0,0,0.14)', color: '#4a4a4a', fontSize: '.8rem', padding: '.4rem 1.1rem', borderRadius: '8px', textDecoration: 'none', cursor: 'pointer' }
const navCta: React.CSSProperties = { background: '#1a1a1a', color: 'white', fontSize: '.8rem', fontWeight: 500, padding: '.45rem 1.2rem', borderRadius: '8px', textDecoration: 'none', letterSpacing: '.03em', marginLeft: '.5rem' }
const btnPrimary: React.CSSProperties = { background: '#1a1a1a', color: 'white', fontSize: '.85rem', fontWeight: 500, padding: '.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none', letterSpacing: '.02em' }
const btnOutline: React.CSSProperties = { background: 'none', border: '1px solid rgba(0,0,0,0.14)', color: '#4a4a4a', fontSize: '.85rem', padding: '.7rem 1.5rem', borderRadius: '8px', textDecoration: 'none' }
const section: React.CSSProperties = { maxWidth: '1160px', margin: '0 auto', padding: '5rem 3rem' }
const sectionTitle: React.CSSProperties = { fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, lineHeight: 1.2, color: '#1a1a1a', marginBottom: '1rem' }
const sectionSub: React.CSSProperties = { fontSize: '.9rem', color: '#6b6b6b', lineHeight: 1.8, maxWidth: '560px', marginBottom: '3rem' }
const statSep: React.CSSProperties = { width: '1px', background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }
const floatingCard: React.CSSProperties = { position: 'absolute', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '.85rem 1.1rem', backdropFilter: 'blur(8px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
const fcLabel: React.CSSProperties = { fontSize: '.65rem', color: '#6b6b6b', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '3px' }
const fcVal: React.CSSProperties = { fontSize: '.82rem', fontWeight: 600, color: '#1a1a1a' }
const profileCard: React.CSSProperties = { background: '#ffffff', border: '1px solid rgba(0,0,0,.08)', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 20px rgba(0,0,0,.06)' }
const pcHead: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '.9rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,.08)', marginBottom: '1.25rem' }
const pcAv: React.CSSProperties = { width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 600 }
const pcTitle: React.CSSProperties = { fontSize: '.95rem', fontWeight: 600, color: '#1a1a1a' }
const pcStatus: React.CSSProperties = { padding: '3px 10px', background: 'rgba(45,106,79,.08)', border: '1px solid rgba(45,106,79,.2)', color: '#2d6a4f', fontSize: '.7rem', borderRadius: '20px', fontWeight: 500 }
const pseudoBadge: React.CSSProperties = { background: '#f3f4f6', borderRadius: '4px', padding: '1px 6px', fontSize: '.72rem', color: '#6b7280', fontFamily: 'monospace' }
const pcTag: React.CSSProperties = { padding: '3px 10px', background: '#f4f3ef', border: '1px solid rgba(0,0,0,.08)', borderRadius: '20px', fontSize: '.72rem', color: '#4a4a4a' }
const ctaBtn: React.CSSProperties = { width: '100%', border: 'none', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'Inter, sans-serif', fontSize: '.85rem', cursor: 'pointer' }

// ============ COMPONENTS ============
function PromiseItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.83rem', color: '#4a4a4a' }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#555', flexShrink: 0 }}></div>
      {children}
    </div>
  )
}

function StatItem({ num, label }: { num: string, label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>{num}</span>
      <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>{label}</span>
    </div>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#111', marginBottom: '.75rem' }}>
      <span style={{ width: '24px', height: '1px', background: '#555' }}></span>
      {children}
    </div>
  )
}

function FeatCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="feat-card" style={{ background: 'white', padding: '2rem' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1', opacity: 0.7, marginBottom: '.75rem', lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '.5rem' }}>{title}</div>
      <div style={{ fontSize: '.82rem', color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</div>
    </div>
  )
}

function HowItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div>
      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#6366f1', opacity: 0.8, lineHeight: 1, marginBottom: '.75rem', letterSpacing: '.05em' }}>{num}</div>
      <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '.4rem' }}>{title}</div>
      <div style={{ fontSize: '.82rem', color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</div>
    </div>
  )
}

function PcRow({ lbl, val, italic }: { lbl: string, val: string, italic?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '.83rem' }}>
      <span style={{ color: '#6b6b6b' }}>{lbl}</span>
      <span style={{ color: '#1a1a1a', fontWeight: 500, fontStyle: italic ? 'italic' : 'normal', opacity: italic ? 0.6 : 1 }}>{val}</span>
    </div>
  )
}

function BlockRow({ domain, tag, note, blocked }: { domain: string, tag: string, note: string, blocked?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.85rem 1.25rem', borderBottom: '1px solid rgba(0,0,0,.08)', fontSize: '.83rem' }}>
      <span style={{ fontFamily: 'monospace', color: '#4a4a4a', fontSize: '.78rem', flex: 1 }}>{domain}</span>
      <span style={blocked
        ? { padding: '2px 10px', background: 'rgba(185,28,28,.07)', color: '#b91c1c', border: '1px solid rgba(185,28,28,.15)', borderRadius: '20px', fontSize: '.7rem', fontWeight: 500 }
        : { padding: '2px 10px', background: 'rgba(45,106,79,.08)', color: '#2d6a4f', border: '1px solid rgba(45,106,79,.2)', borderRadius: '20px', fontSize: '.7rem', fontWeight: 500 }}>{tag}</span>
      <span style={{ fontSize: '.7rem', color: '#6b6b6b' }}>{note}</span>
    </div>
  )
}

function DarkBullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.83rem', color: 'rgba(255,255,255,.9)' }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,.5)', flexShrink: 0 }}></div>
      {children}
    </div>
  )
}

function DarkRow({ lbl, val, last }: { lbl: string, val: string, last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,.08)', fontSize: '.83rem' }}>
      <span style={{ color: 'rgba(255,255,255,.9)' }}>{lbl}</span>
      <span style={{ color: 'white', fontWeight: 500 }}>{val}</span>
    </div>
  )
}

function EcoCard({ icon, title, desc, items }: { icon: string, title: string, desc: string, items: string[] }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(0,0,0,.08)' }}>
      <div style={{ width: '44px', height: '44px', background: '#f4f3ef', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontSize: '1.3rem' }}>{icon}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '.5rem' }}>{title}</div>
      <div style={{ fontSize: '.85rem', color: '#6b6b6b', lineHeight: 1.75, marginBottom: '1.25rem' }}>{desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.82rem', color: '#1a1a1a' }}>
            <span style={{ color: '#2d6a4f', fontWeight: 700 }}>✓</span> {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function Testimonial({ quote, pseudo, role, initials }: { quote: string, pseudo: string, role: string, initials: string }) {
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '2rem', border: '1px solid rgba(0,0,0,.07)' }}>
      <div style={{ fontSize: '.85rem', color: '#1a1a1a', lineHeight: 1.8, marginBottom: '1.25rem' }}>&ldquo;{quote}&rdquo;</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
        <div style={{ width: '38px', height: '38px', background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '.72rem', fontWeight: 700 }}>{initials}</div>
        <div>
          <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#1a1a1a' }}>{pseudo}</div>
          <div style={{ fontSize: '.75rem', color: '#6b6b6b' }}>{role}</div>
        </div>
      </div>
    </div>
  )
}

function PriceCard({ label, price, sub, items, cta, href, featured, outline }: { label: string, price: string, sub: string, items: string[], cta: string, href: string, featured?: boolean, outline?: boolean }) {
  const bg = featured ? '#1a1a1a' : '#fafaf8'
  const txt = featured ? 'white' : '#1a1a1a'
  const sublabel = featured ? 'rgba(255,255,255,.4)' : '#6b6b6b'
  return (
    <div style={{ background: bg, border: featured ? 'none' : '1px solid rgba(0,0,0,.08)', borderRadius: '16px', padding: '2rem', textAlign: 'center', color: txt, position: 'relative' }}>
      {featured && (
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1e3a8a', color: 'white', fontSize: '.65rem', fontWeight: 700, padding: '.25rem .75rem', borderRadius: '50px', whiteSpace: 'nowrap' }}>LE PLUS POPULAIRE</div>
      )}
      <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: sublabel, marginBottom: '.75rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '.25rem' }}>{price}</div>
      <div style={{ fontSize: '.82rem', color: sublabel, marginBottom: '1.5rem' }}>{sub}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ fontSize: '.82rem', display: 'flex', gap: '.5rem', alignItems: 'center', color: txt, opacity: featured ? 0.85 : 1 }}>
            <span style={{ color: featured ? 'rgba(255,255,255,.6)' : '#2d6a4f', fontWeight: 700 }}>✓</span>{item}
          </div>
        ))}
      </div>
      <a href={href} style={{
        display: 'block', textDecoration: 'none', width: '100%', boxSizing: 'border-box',
        background: outline ? 'none' : (featured ? 'white' : '#1a1a1a'),
        color: outline ? '#1a1a1a' : (featured ? '#1a1a1a' : 'white'),
        border: outline ? '1.5px solid rgba(0,0,0,.14)' : 'none',
        fontFamily: 'Inter, sans-serif', fontSize: '.85rem', fontWeight: outline ? 500 : 600,
        padding: '.75rem', borderRadius: '10px', cursor: 'pointer', textAlign: 'center'
      }}>{cta}</a>
    </div>
  )
}

function CtaPill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}></span>
      {children}
    </span>
  )
}

function FooterCol({ title, links }: { title: string, links: string[][] }) {
  return (
    <div>
      <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,.3)', marginBottom: '.85rem' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {links.map(([txt, href], i) => (
          <a key={i} href={href} style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>{txt}</a>
        ))}
      </div>
    </div>
  )
}
