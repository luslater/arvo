"use client"

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AnimatedHero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["Inteligente", "Transparente", "Rentável", "Global", "Seguro"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
                    <div>
                        <Link href="/questionnaire">
                            <Button variant="secondary" size="sm" className="gap-4 rounded-full px-6 bg-gray-100 hover:bg-gray-200 text-gray-900">
                                Descubra seu perfil de investidor <MoveRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-light leading-tight">
                            <span className="text-gray-900">Seu patrimônio</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 min-h-[1.2em]">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl leading-relaxed tracking-tight text-gray-600 max-w-2xl text-center mx-auto font-light">
                            Assessoria de investimentos independente e sem conflitos de interesse.
                            Recomendações baseadas exclusivamente no que é melhor para você.
                        </p>
                    </div>
                    <div className="flex flex-row gap-3 pt-4">
                        <Link href="/register">
                            <Button size="lg" className="gap-4 rounded-full h-14 px-8 text-lg bg-gray-900 text-white hover:bg-gray-800">
                                Começar Agora <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="gap-4 rounded-full h-14 px-8 text-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                                Já tenho conta <TrendingUp className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { AnimatedHero };
