'use client'
import { useState } from 'react'
import { Mic, Send, RefreshCw, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'

const PROFILS = ['Responsable RH', 'DAF / CFO', 'DRH', 'DSI / CTO', 'Directeur Commercial', 'Manager', 'Ingénieur', 'Chef de projet']
const TYPES = [
  { id: 'motivation', label: 'Motivation', desc: 'Pourquoi ce poste ?' },
  { id: 'technique', label: 'Technique', desc: 'Compétences métier' },
  { id: 'comportemental', label: 'Comportemental', desc: 'Soft skills & situations' },
]

const QUESTIONS: Record<string, string[]> = {
  motivation: [
    'Pourquoi souhaitez-vous quitter votre poste actuel ?',
    "Qu'est-ce qui vous attire dans ce poste en particulier ?",
    'Comment décririez-vous votre projet professionnel à 3 ans ?',
  ],
  technique: [
    'Décrivez une situation où vous avez dû gérer un conflit social complexe.',
    'Comment pilotez-vous un processus de recrutement de A à Z ?',
    'Quelle est votre approche pour mettre en place un SIRH ?',
  ],
  comportemental: [
    "Donnez-moi un exemple de situation difficile que vous avez surmontée.",
    "Comment réagissez-vous face à un manager avec lequel vous n'êtes pas d'accord ?",
    "Parlez-moi d'un échec professionnel et ce que vous en avez appris.",
  ],
}

export default function SimulateurPage() {
  const [profil, setProfil] = useState('Responsable RH')
  const [type, setType] = useState('motivation')
  const [started, setStarted] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [isPremium] = useState(false) // TODO: vérifier abonnement

  const questions = QUESTIONS[type] || []
  const currentQuestion = questions[qIndex % questions.length]

  async function getFeedback() {
    if (!answer.trim()) return
    setLoadingFeedback(true)
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `Tu es un coach expert en entretien d'embauche. 
Question posée : "${currentQuestion}"
Profil du candidat : ${profil}
Réponse du candidat : "${answer}"

Donne un feedback constructif en 3 points numérotés :
1. Un point fort de cette réponse
2. Un point à améliorer
3. Un conseil pratique concret

Sois bienveillant, direct et professionnel.`
          }]
        })
      })
      const data = await response.json()
      setFeedback(data.content[0].text)
    } catch {
      setFeedback("✅ Bonne structure ! Pensez à utiliser la méthode STAR (Situation, Tâche, Action, Résultat) et à illustrer avec des chiffres concrets.")
    }
    setLoadingFeedback(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Simulateur d'entretien</h1>
        <p className="text-gray-500 mt-1">Préparez-vous avec des questions adaptées à votre profil</p>
      </div>

      {/* Banner freemium */}
      {!isPremium && (
        <div className="bg-blue-900 text-white rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm mb-0.5">Version gratuite — 3 simulations disponibles</p>
            <p className="text-xs text-white/60">Débloquez les réponses vocales et comptes rendus détaillés</p>
          </div>
          <button className="bg-white text-blue-900 text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap hover:bg-blue-50 transition-colors">
            Débloquer — 9,90 €
          </button>
        </div>
      )}

      {!started ? (
        <div className="flex flex-col gap-6">
          {/* Choix profil */}
          <div className="bg-white rounded-2xl border border-black/8 p-6">
            <h3 className="font-bold mb-3">Profil de poste</h3>
            <div className="grid grid-cols-2 gap-2">
              {PROFILS.map(p => (
                <button key={p} onClick={() => setProfil(p)}
                  className={`px-3 py-2.5 text-sm rounded-xl border transition-colors text-left ${profil === p ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Choix type */}
          <div className="bg-white rounded-2xl border border-black/8 p-6">
            <h3 className="font-bold mb-3">Type d'entretien</h3>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`p-4 rounded-xl border text-center transition-colors ${type === t.id ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}>
                  <div className="font-bold text-sm mb-1">{t.label}</div>
                  <div className={`text-xs ${type === t.id ? 'text-white/60' : 'text-gray-400'}`}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={() => setStarted(true)}>
            🎯 Lancer la simulation
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Question */}
          <div className="bg-white rounded-2xl border border-black/8 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">{profil} · {TYPES.find(t => t.id === type)?.label}</p>
                <p className="text-sm font-semibold leading-relaxed">{currentQuestion}</p>
              </div>
              <button onClick={() => { setQIndex(i => i + 1); setAnswer(''); setFeedback('') }}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
                <RefreshCw size={14} className="text-gray-400" />
              </button>
            </div>

            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Rédigez votre réponse..."
              className="w-full min-h-32 p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 resize-none transition-colors"
            />

            <div className="flex gap-3 mt-3">
              <Button onClick={getFeedback} loading={loadingFeedback} variant="outline" className="flex-1">
                <Send size={14} className="mr-2" />Obtenir un feedback IA
              </Button>
              <Button onClick={() => { setQIndex(i => i + 1); setAnswer(''); setFeedback('') }} className="flex-1">
                Question suivante →
              </Button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-green-700 mb-2">FEEDBACK IA</p>
              <p className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            </div>
          )}

          {/* Option vocale premium */}
          {!isPremium && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
              <Lock size={16} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Réponse vocale + compte rendu complet</p>
                <p className="text-xs text-gray-400">Disponible avec la version payante</p>
              </div>
              <button className="text-xs font-semibold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-400 transition-colors">
                9,90 €
              </button>
            </div>
          )}

          <Button variant="ghost" onClick={() => { setStarted(false); setFeedback(''); setAnswer('') }}>
            ← Changer de configuration
          </Button>
        </div>
      )}
    </div>
  )
}
