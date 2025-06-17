import { useState } from 'react';
import {
  BrainIcon,
  BookOpenIcon,
  TrendingUpIcon,
  SparklesIcon,
} from 'lucide-react';
import './App.css';

function App() {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Encabezado */}
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center">
            <div className="flex items-center space-x-3">
              <BrainIcon className="text-primary-600 h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">Flashcards AI</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transforma Tus Documentos en{' '}
              <span className="hero-gradient">Flashcards Inteligentes</span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-600">
              Sube cualquier documento y deja que nuestra IA cree flashcards
              personalizados para un aprendizaje eficiente con repetición
              espaciada científicamente probada.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mb-12 text-3xl font-bold text-gray-900">
              Características Principales
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group rounded-2xl bg-white bg-white/90 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
                <div className="feature-icon">
                  <SparklesIcon className="text-primary-600 mx-auto mb-4 h-12 w-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Generación con IA
                </h3>
                <p className="text-gray-600">
                  Extrae automáticamente conceptos clave y genera preguntas
                  desde tus documentos usando la última tecnología en IA.
                </p>
              </div>
              <div className="group rounded-2xl bg-white bg-white/90 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
                <div className="feature-icon">
                  <TrendingUpIcon className="text-primary-600 mx-auto mb-4 h-12 w-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Repetición Espaciada
                </h3>
                <p className="text-gray-600">
                  Optimiza tu aprendizaje con algoritmos de repetición espaciada
                  científicamente probados para una mejor retención.
                </p>
              </div>
              <div className="group rounded-2xl bg-white bg-white/90 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
                <div className="feature-icon">
                  <BrainIcon className="text-primary-600 mx-auto mb-4 h-12 w-12" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Análisis Inteligente
                </h3>
                <p className="text-gray-600">
                  Rastrea tu progreso e identifica áreas que necesitan más
                  enfoque con análisis detallados y recomendaciones
                  personalizadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-12 text-white shadow-2xl">
            <h3 className="mb-4 text-center text-3xl font-bold">
              ¿Listo para Comenzar?
            </h3>
            <p className="mb-8 text-center text-lg text-blue-100">
              Sube tu documento y genera flashcards inteligentes con IA.
            </p>
            <div className="space-y-6">
              <div className="group cursor-pointer rounded-xl border-2 border-dashed border-blue-300/50 bg-white/10 p-8 text-center backdrop-blur-sm transition-all hover:border-blue-300 hover:bg-white/20">
                <BookOpenIcon className="mx-auto mb-4 h-16 w-16 text-blue-200" />
                <p className="text-lg font-medium text-blue-100">
                  Arrastra y suelta tu documento aquí
                </p>
                <p className="mt-2 text-blue-200">
                  Soporta archivos TXT, PDF, DOCX y MD
                </p>
              </div>
              <button
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl focus:ring-4 focus:ring-orange-300 focus:outline-none"
                disabled={isLoading}
              >
                {isLoading ? 'Generando Flashcards...' : 'Generar Flashcards'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center space-x-3">
              <BrainIcon className="text-primary-600 h-8 w-8" />
              <h4 className="text-xl font-bold text-gray-900">Flashcards AI</h4>
            </div>
            <p className="text-gray-600">
              Transformando la forma de aprender con IA.
            </p>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>
              &copy; 2024 Flashcards AI. Construido con ❤️ para un mejor
              aprendizaje.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
