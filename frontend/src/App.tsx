import { useState } from 'react';
import { BrainIcon, BookOpenIcon, TrendingUpIcon } from 'lucide-react';
import './App.css';

function App() {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Encabezado */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center">
            <div className="flex items-center space-x-3">
              <BrainIcon className="text-primary-600 h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">Flashcards AI</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Sección Principal */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900">
            Transforma Tus Documentos en{' '}
            <span className="text-primary-600">Flashcards Inteligentes</span>
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            Sube cualquier documento y deja que nuestra IA cree flashcards
            personalizados para un aprendizaje eficiente con repetición
            espaciada científicamente probada.
          </p>

          {/* Tarjetas de Características */}
          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <div className="card text-center">
              <BookOpenIcon className="text-primary-600 mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">Generación con IA</h3>
              <p className="text-gray-600">
                Extrae automáticamente conceptos clave y genera preguntas desde
                tus documentos
              </p>
            </div>
            <div className="card text-center">
              <TrendingUpIcon className="text-primary-600 mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Repetición Espaciada
              </h3>
              <p className="text-gray-600">
                Optimiza tu aprendizaje con algoritmos de repetición espaciada
                científicamente probados
              </p>
            </div>
            <div className="card text-center">
              <BrainIcon className="text-primary-600 mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Análisis Inteligente
              </h3>
              <p className="text-gray-600">
                Rastrea tu progreso e identifica áreas que necesitan más enfoque
              </p>
            </div>
          </div>

          {/* Sección de Llamada a la Acción */}
          <div className="card mx-auto max-w-2xl">
            <h3 className="mb-4 text-2xl font-bold">¿Listo para Comenzar?</h3>
            <p className="mb-6 text-gray-600">
              Sube tu primer documento y experimenta el poder del aprendizaje
              asistido por IA.
            </p>
            <div className="space-y-4">
              <div className="hover:border-primary-400 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors">
                <BookOpenIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">
                  Arrastra y suelta tu documento aquí
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Soporta archivos TXT, PDF, DOCX y MD
                </p>
              </div>
              <button className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? 'Procesando...' : 'Elegir Archivo'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
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
