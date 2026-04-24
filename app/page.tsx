'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function HomePage() {
  const revealRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Intersection Observer pour les animations au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen" style={{
      background: '#fafaf8',
      color: '#1a1a1a',
      fontFamily: "'Inter', sans-serif"
    }}>

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
          <a href="/tarifs" className="nav-btn" style={navBtn}>Tarifs</a>
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
              Pour ceux qui explorent le marché&hellip; sans mettre leur carrière en danger. Votre identité reste masquée jusqu&apos;à ce que vous décidiez de vous révéler.
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
            <div className="a5" style={{ marginTop: '1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', letterSpacing: '-.01em' }}>
              Explorez le marché sans jamais vous exposer.
            </div>
          </div>

          {/* HERO RIGHT - Image avec cartes flottantes animées */}
          <div className="a2" style={{ position: 'relative' }}>
            <div style={{
              position: 'relative', borderRadius: '16px', overflow: 'hidden',
              height: '640px',
              background: 'linear-gradient(135deg, #e8e7e3 0%, #d4d2cd 100%)'
            }}>
              <Image
                src="/hero-executive.png"
                alt="Executive anonyme — Profil confidentiel"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 50%, rgba(250,250,248,.6))'
              }}></div>
            </div>

            {/* Floating cards avec ANIMATIONS */}
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
          maxWidth: '1160px', margin: '0 auto',
          padding: '2rem 3rem',
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
        <div ref={(el) => { revealRefs.current[0] = el }} className="reveal">
          <SectionEyebrow>Pourquoi KeptCore</SectionEyebrow>
        </div>
        <h2 ref={(el) => { revealRefs.current[1] = el }} className="reveal rd1" style={sectionTitle}>
          Conçu pour ceux qui explorent… en silence
        </h2>
        <p ref={(el) => { revealRefs.current[2] = el }} className="reveal rd2" style={sectionSub}>
          À partir de 100k€ de package, une recherche visible peut fragiliser votre position actuelle. KeptCore est fait pour vous.
        </p>
        <div ref={(el) => { revealRefs.current[3] = el }} className="reveal rd3" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px', background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px', overflow: 'hidden'
        }}>
          <FeatCard num="01" title="Anonymat absolu" desc='Ni votre nom, ni votre employeur. Vous décrivez votre secteur librement — "Groupe industriel coté" plutôt que votre entreprise réelle.'/>
          <FeatCard num="02" title="Blocage par domaine" desc="Bloquez @votregroupe.fr, ses filiales et les cabinets mandatés. Aucune exposition interne possible."/>
          <FeatCard num="03" title="Package complet visible" desc="Variable, véhicule, LTIP, intéressement, participation. Les recruteurs savent exactement ce qu'il faut proposer."/>
          <FeatCard num="04" title="Vous choisissez" desc="Aucun contact sans votre accord. Votre CV n'est jamais partagé automatiquement — vous restez maître."/>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section id="comment-ca-marche" style={section}>
        <div ref={(el) => { revealRefs.current[4] = el }} className="reveal">
          <SectionEyebrow>Comment ça marche</SectionEyebrow>
        </div>
        <h2 ref={(el) => { revealRefs.current[5] = el }} className="reveal rd1" style={sectionTitle}>
          4 étapes. Zéro risque.
        </h2>
        <div ref={(el) => { revealRefs.current[6] = el }} className="reveal rd2" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem', marginTop: '3rem'
        }}>
          <HowItem num="01" title="Créez votre profil anonyme" desc="Pseudo, fonction, compétences. Pas de nom, pas d'entreprise."/>
          <HowItem num="02" title="Bloquez votre employeur" desc="Ajoutez les domaines à bloquer. Aucun recruteur de ces entreprises ne vous trouve."/>
          <HowItem num="03" title="Les recruteurs vous contactent" desc="Vous voyez leur cabinet avant de répondre. Vous gardez le contrôle."/>
          <HowItem num="04" title="Vous révélez votre identité" desc="Uniquement si vous l'acceptez. Jamais avant."/>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a1a1a', padding: '6rem 3rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
            Rejoignez KeptCore
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500,
            color: 'white', lineHeight: 1.15, marginBottom: '1.25rem'
          }}>
            Explorez le marché<br/>sans vous exposer.
          </h2>
          <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Inscription gratuite · Profil sous pseudonyme · Vous gardez le contrôle
          </p>
          <a href="/auth/inscription" style={{
            background: 'white', color: '#1a1a1a', textDecoration: 'none',
            fontSize: '.88rem', fontWeight: 600, padding: '.85rem 2.25rem',
            borderRadius: '8px', display: 'inline-block', letterSpacing: '.02em'
          }}>
            Créer mon profil confidentiel →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#f4f3ef', borderTop: '1px solid rgba(0,0,0,0.08)',
        padding: '1.75rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '.78rem', color: '#6b6b6b', flexWrap: 'wrap', gap: '.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <Image src="/logo-keptcore.png" alt="KeptCore" width={24} height={24} style={{ objectFit: 'contain' }} />
          <span style={{ fontWeight: 800 }}>KeptCore</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/legal" style={{ color: '#6b6b6b', textDecoration: 'none' }}>Mentions légales</a>
          <a href="/cgu" style={{ color: '#6b6b6b', textDecoration: 'none' }}>CGU</a>
          <a href="/legal" style={{ color: '#6b6b6b', textDecoration: 'none' }}>RGPD</a>
        </div>
        <div>© 2026 KeptCore</div>
      </footer>
    </div>
  )
}

// STYLES
const navBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: '#6b6b6b',
  fontSize: '.82rem', padding: '.35rem .85rem', borderRadius: '8px',
  textDecoration: 'none', letterSpacing: '.02em', cursor: 'pointer'
}
const navGhost: React.CSSProperties = {
  background: 'none', border: '1px solid rgba(0,0,0,0.14)', color: '#4a4a4a',
  fontSize: '.8rem', padding: '.4rem 1.1rem', borderRadius: '8px',
  textDecoration: 'none', cursor: 'pointer'
}
const navCta: React.CSSProperties = {
  background: '#1a1a1a', color: 'white', fontSize: '.8rem', fontWeight: 500,
  padding: '.45rem 1.2rem', borderRadius: '8px', textDecoration: 'none',
  letterSpacing: '.03em', marginLeft: '.5rem'
}
const btnPrimary: React.CSSProperties = {
  background: '#1a1a1a', color: 'white', fontSize: '.85rem', fontWeight: 500,
  padding: '.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none',
  letterSpacing: '.02em'
}
const btnOutline: React.CSSProperties = {
  background: 'none', border: '1px solid rgba(0,0,0,0.14)', color: '#4a4a4a',
  fontSize: '.85rem', padding: '.7rem 1.5rem', borderRadius: '8px',
  textDecoration: 'none'
}
const section: React.CSSProperties = {
  maxWidth: '1160px', margin: '0 auto', padding: '5rem 3rem'
}
const sectionTitle: React.CSSProperties = {
  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700,
  lineHeight: 1.2, color: '#1a1a1a', marginBottom: '1rem'
}
const sectionSub: React.CSSProperties = {
  fontSize: '.9rem', color: '#6b6b6b', lineHeight: 1.8,
  maxWidth: '560px', marginBottom: '3rem'
}
const statSep: React.CSSProperties = {
  width: '1px', background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch'
}
const floatingCard: React.CSSProperties = {
  position: 'absolute', background: 'rgba(255,255,255,0.95)',
  border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px',
  padding: '.85rem 1.1rem', backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
}
const fcLabel: React.CSSProperties = {
  fontSize: '.65rem', color: '#6b6b6b',
  letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '3px'
}
const fcVal: React.CSSProperties = {
  fontSize: '.82rem', fontWeight: 600, color: '#1a1a1a'
}
const fcSub: React.CSSProperties = {
  fontSize: '.7rem', color: '#6b6b6b', marginTop: '2px'
}
const blockedTag: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '4px',
  fontSize: '.68rem', color: '#b91c1c',
  background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.15)',
  borderRadius: '20px', padding: '2px 8px', marginTop: '4px'
}

// COMPONENTS
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
    <div style={{
      display: 'flex', alignItems: 'center', gap: '.6rem',
      fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase',
      color: '#111', marginBottom: '.75rem'
    }}>
      <span style={{ width: '24px', height: '1px', background: '#555' }}></span>
      {children}
    </div>
  )
}

function FeatCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="feat-card" style={{ background: 'white', padding: '2rem' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1', opacity: 0.7, marginBottom: '.75rem', lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '.5rem', letterSpacing: '.01em' }}>{title}</div>
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
