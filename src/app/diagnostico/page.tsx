import { Suspense } from 'react';
import Diagnostic from './report';

export const metadata = {
  title: 'Seu mapa de independência | ARVO',
  robots: { index: false, follow: false }
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
        <div className="text-center font-sans text-stone-600">
          <div className="w-10 h-10 border-3 border-[#2B6E76] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium text-[#123044]">Preparando seu mapa ARVO...</p>
        </div>
      </div>
    }>
      <Diagnostic />
    </Suspense>
  );
}
