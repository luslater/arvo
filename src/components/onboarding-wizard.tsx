"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Target, Briefcase, TrendingUp } from "lucide-react"

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    nome: "",
    jaInveste: null as boolean | null,
    objetivo: "",
  })

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  const handleComplete = () => {
    onComplete()
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dash-bg p-4 sm:p-6">
      <div className="absolute inset-0 bg-dash-border/30 backdrop-blur-sm pointer-events-none" />
      
      <div className="relative w-full max-w-xl bg-dash-surface border border-dash-border rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[480px]">
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-dash-surface-active">
          <motion.div 
            className="h-full bg-dash-accent" 
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex-1 relative p-8 md:p-10 flex flex-col">
          <AnimatePresence mode="wait" custom={1}>
            
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-1 justify-center"
              >
                <div className="w-16 h-16 bg-dash-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl">👋</span>
                </div>
                <h2 className="text-3xl font-bold text-dash-text tracking-tight mb-3">
                  Bem-vindo à ARVO
                </h2>
                <p className="text-dash-text-muted text-lg leading-relaxed mb-8 max-w-sm">
                  Estamos felizes em ter você aqui. Vamos configurar seu perfil rapidamente para podermos oferecer a melhor orientação financeira.
                </p>
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-dash-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-dash-accent/90 transition-colors"
                  >
                    Começar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-1"
              >
                <h2 className="text-2xl font-bold text-dash-text tracking-tight mb-6">
                  Um pouco sobre você
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dash-text-light mb-2">
                      Como podemos te chamar?
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome ou apelido"
                      value={data.nome}
                      onChange={(e) => setData({ ...data, nome: e.target.value })}
                      className="w-full bg-dash-surface-active border border-dash-border rounded-xl px-4 py-3 text-dash-text focus:outline-none focus:ring-2 focus:ring-dash-accent/50 focus:border-dash-accent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dash-text-light mb-3">
                      Você já investe atualmente?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setData({ ...data, jaInveste: true })}
                        className={`p-4 rounded-xl border text-left transition-all ${data.jaInveste === true ? 'border-dash-accent bg-dash-accent/5 text-dash-accent' : 'border-dash-border bg-dash-surface hover:bg-dash-surface-active text-dash-text'}`}
                      >
                        <div className="font-semibold mb-1">Sim, já invisto</div>
                        <div className="text-xs opacity-70">Tenho conta em corretora</div>
                      </button>
                      <button
                        onClick={() => setData({ ...data, jaInveste: false })}
                        className={`p-4 rounded-xl border text-left transition-all ${data.jaInveste === false ? 'border-dash-accent bg-dash-accent/5 text-dash-accent' : 'border-dash-border bg-dash-surface hover:bg-dash-surface-active text-dash-text'}`}
                      >
                        <div className="font-semibold mb-1">Ainda não</div>
                        <div className="text-xs opacity-70">Quero começar agora</div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex justify-between pt-8">
                  <button onClick={prevStep} className="px-4 py-2 text-dash-text-light hover:text-dash-text transition-colors">Voltar</button>
                  <button
                    onClick={nextStep}
                    disabled={!data.nome || data.jaInveste === null}
                    className="flex items-center gap-2 bg-dash-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-dash-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Avançar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-1"
              >
                <h2 className="text-2xl font-bold text-dash-text tracking-tight mb-2">
                  Qual seu principal objetivo?
                </h2>
                <p className="text-dash-text-muted text-sm mb-6">
                  Isso nos ajudará a personalizar sua estratégia e suas simulações.
                </p>
                
                <div className="space-y-3">
                  {[
                    { id: 'aposentadoria', label: 'Independência Financeira', desc: 'Viver de renda no futuro', icon: Target },
                    { id: 'patrimonio', label: 'Multiplicar Patrimônio', desc: 'Fazer o dinheiro render mais', icon: TrendingUp },
                    { id: 'casa', label: 'Compra de Imóvel', desc: 'Dar entrada ou quitar uma casa', icon: Briefcase },
                  ].map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => setData({ ...data, objetivo: obj.id })}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${data.objetivo === obj.id ? 'border-dash-accent bg-dash-accent/5' : 'border-dash-border bg-dash-surface hover:bg-dash-surface-active'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.objetivo === obj.id ? 'bg-dash-accent text-white' : 'bg-dash-bg text-dash-text-light'}`}>
                        <obj.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-semibold ${data.objetivo === obj.id ? 'text-dash-accent' : 'text-dash-text'}`}>{obj.label}</div>
                        <div className="text-xs text-dash-text-muted mt-0.5">{obj.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-auto flex justify-between pt-8">
                  <button onClick={prevStep} className="px-4 py-2 text-dash-text-light hover:text-dash-text transition-colors">Voltar</button>
                  <button
                    onClick={nextStep}
                    disabled={!data.objetivo}
                    className="flex items-center gap-2 bg-dash-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-dash-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Avançar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full flex-1 justify-center items-center text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-dash-text tracking-tight mb-3">
                  Tudo pronto, {data.nome}!
                </h2>
                <p className="text-dash-text-muted text-lg leading-relaxed mb-8 max-w-sm">
                  Configuramos sua conta com sucesso. Vamos montar seu plano financeiro e descobrir as melhores carteiras para você.
                </p>
                
                <button
                  onClick={handleComplete}
                  className="w-full max-w-xs flex justify-center items-center gap-2 bg-dash-text text-dash-bg px-6 py-3.5 rounded-xl font-semibold hover:bg-dash-text/90 transition-colors"
                >
                  Ir para o Dashboard
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
