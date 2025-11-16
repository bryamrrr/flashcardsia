import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BrainIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  AlertCircleIcon,
  XCircleIcon,
  CheckIcon,
  EditIcon,
  XIcon,
  SaveIcon,
  GridIcon,
  PlayIcon,
} from 'lucide-react';
import { buildApiUrl } from '../config/api';

interface Flashcard {
  question: string;
  answer: string;
}

interface DocumentInfo {
  text_length: number;
  created_at: string;
}

interface FlashcardsResponse {
  success: boolean;
  document_id: number;
  flashcards: Flashcard[];
  total_flashcards: number;
  document_info: DocumentInfo;
  generation_info: {
    model: string;
    tokens_used: number;
  };
  error?: string;
}

function FlashcardsPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!documentId) {
      setError('ID de documento no válido');
      setIsLoading(false);
      return;
    }

    fetchFlashcards();
  }, [documentId]);

  useEffect(() => {
    if (isEditing && flashcards.length > 0) {
      const card = flashcards[currentIndex];
      setEditedQuestion(card.question);
      setEditedAnswer(card.answer);
    }
  }, [currentIndex, isEditing, flashcards]);

  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        buildApiUrl(`/api/flashcards/${documentId}`)
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error generando flashcards');
      }

      const result: FlashcardsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'No se pudieron generar flashcards');
      }

      setFlashcards(result.flashcards);
      setDocumentInfo(result.document_info);
      console.log('Flashcards generadas:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching flashcards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Si es la última tarjeta, mostrar resumen
      setShowSummary(true);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsEditing(false);
    setShowSummary(false);
  };

  const approveCard = () => {
    // Mover a la siguiente tarjeta
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setIsEditing(false);
    } else {
      // Si es la última tarjeta, mostrar resumen
      setShowSummary(true);
    }
  };

  const startEditing = () => {
    const card = flashcards[currentIndex];
    setIsEditing(true);
    setEditedQuestion(card.question);
    setEditedAnswer(card.answer);
    setIsFlipped(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedQuestion('');
    setEditedAnswer('');
  };

  const saveChanges = () => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex] = {
      question: editedQuestion,
      answer: editedAnswer,
    };
    setFlashcards(updatedFlashcards);
    setIsEditing(false);
    setEditedQuestion('');
    setEditedAnswer('');
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
    setShowSummary(false);
    setIsFlipped(false);
  };

  const restartStudy = () => {
    setCurrentIndex(0);
    setShowSummary(false);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="space-y-6 text-center">
          <div className="relative">
            <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            <BrainIcon className="absolute inset-0 m-auto h-8 w-8 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Generando Flashcards
            </h2>
            <p className="text-gray-600">
              Nuestra IA está procesando tu documento...
            </p>
            <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
              <span>Esto puede tomar unos segundos</span>
              <div className="flex space-x-1">
                <div className="animate-pulse">.</div>
                <div className="animation-delay-200 animate-pulse">.</div>
                <div className="animation-delay-400 animate-pulse">.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <AlertCircleIcon className="mx-auto h-20 w-20 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={fetchFlashcards}
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
            >
              Intentar de Nuevo
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <XCircleIcon className="mx-auto h-20 w-20 text-yellow-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Sin Flashcards</h2>
            <p className="text-gray-600">
              No se pudieron generar flashcards desde este documento.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
          >
            Subir Otro Documento
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  // Summary View
  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Volver</span>
              </button>

              <div className="flex items-center space-x-3">
                <BrainIcon className="text-primary-600 h-8 w-8" />
                <h1 className="text-xl font-bold text-gray-900">Flashcards AI</h1>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={restartStudy}
                  className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Repasar de Nuevo</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Summary Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-7xl">
            {/* Summary Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-3">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                ¡Completaste todas las flashcards!
              </h2>
              <p className="text-lg text-gray-600">
                Has revisado {flashcards.length} flashcards
              </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {flashcards.length}
                </div>
                <div className="text-sm text-gray-600">Total Flashcards</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Completado</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-600">
                  {documentInfo?.text_length || 0}
                </div>
                <div className="text-sm text-gray-600">Caracteres Procesados</div>
              </div>
            </div>

            {/* All Flashcards Grid */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Todas tus Flashcards
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {flashcards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => goToCard(index)}
                    className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                        #{index + 1}
                      </span>
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mb-2">
                      <div className="mb-1 text-xs font-medium text-gray-500">
                        Pregunta
                      </div>
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {card.question}
                      </p>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-gray-500">
                        Respuesta
                      </div>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {card.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={restartStudy}
                className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-8 py-3 text-white transition-colors hover:bg-indigo-700"
              >
                <RotateCcwIcon className="h-5 w-5" />
                <span>Repasar de Nuevo</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span>Subir Nuevo Documento</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Card View
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Volver</span>
            </button>

            <div className="flex items-center space-x-3">
              <BrainIcon className="text-primary-600 h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">Flashcards AI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} de {flashcards.length}
              </span>
              <button
                onClick={() => setShowSummary(true)}
                className="p-2 text-gray-600 transition-colors hover:text-gray-900"
                title="Ver Resumen"
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={resetCards}
                className="p-2 text-gray-600 transition-colors hover:text-gray-900"
                title="Reiniciar"
              >
                <RotateCcwIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Progreso</h2>
              <span className="text-sm text-gray-600">
                {Math.round(((currentIndex + 1) / flashcards.length) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Flashcard */}
          <div className="mb-8">
            {isEditing ? (
              /* Edit Mode */
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Pregunta
                  </label>
                  <textarea
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    rows={4}
                    placeholder="Escribe la pregunta aquí..."
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Respuesta
                  </label>
                  <textarea
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    rows={4}
                    placeholder="Escribe la respuesta aquí..."
                  />
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={saveChanges}
                    className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
                  >
                    <SaveIcon className="h-5 w-5" />
                    <span>Guardar Cambios</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <XIcon className="h-5 w-5" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div
                className={`preserve-3d relative h-96 w-full cursor-pointer transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={flipCard}
              >
                {/* Front of card (Question) */}
                <div className="absolute inset-0 h-full w-full backface-hidden">
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl transition-shadow hover:shadow-2xl">
                    <div className="mb-4">
                      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                        Pregunta
                      </span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">
                      {currentCard.question}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Haz clic para ver la respuesta
                    </p>
                  </div>
                </div>

                {/* Back of card (Answer) */}
                <div className="absolute inset-0 h-full w-full rotate-y-180 backface-hidden">
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center text-white shadow-xl transition-shadow hover:shadow-2xl">
                    <div className="mb-4">
                      <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                        Respuesta
                      </span>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold">
                      {currentCard.answer}
                    </h3>
                    <p className="text-sm text-white/80">
                      Haz clic para ver la pregunta
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (Aprovar/Editar) */}
          {!isEditing && (
            <div className="mb-6 flex items-center justify-center space-x-4">
              <button
                onClick={approveCard}
                className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
              >
                <CheckIcon className="h-5 w-5" />
                <span>
                  {currentIndex === flashcards.length - 1
                    ? 'Finalizar'
                    : 'Aprovar'}
                </span>
              </button>
              <button
                onClick={startEditing}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                <EditIcon className="h-5 w-5" />
                <span>Editar</span>
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          {!isEditing && (
            <div className="mb-8 flex items-center justify-center space-x-4">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-6 py-3 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span>Anterior</span>
              </button>

              <button
                onClick={flipCard}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
              >
                {isFlipped ? 'Ver Pregunta' : 'Ver Respuesta'}
              </button>

              <button
                onClick={nextCard}
                className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-6 py-3 transition-colors hover:bg-gray-50"
              >
                <span>
                  {currentIndex === flashcards.length - 1
                    ? 'Finalizar'
                    : 'Siguiente'}
                </span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Document Info */}
          {documentInfo && (
            <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h4 className="mb-2 font-semibold text-gray-900">
                Información del Documento
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Texto procesado:</span>{' '}
                  {documentInfo.text_length} caracteres
                </div>
                <div>
                  <span className="font-medium">Fecha:</span>{' '}
                  {documentInfo.created_at}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlashcardsPage;