import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainIcon,
  TrendingUpIcon,
  SparklesIcon,
  UploadIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UserPlusIcon,
  LogInIcon,
} from 'lucide-react';
import { buildApiUrl } from '../config/api';
import RegisterModal from '../components/RegisterModal';
import LoginModal from '../components/LoginModal';
import UserMenu from '../components/UserMenu';

interface User {
  id: number;
  username: string;
  created_at: string;
}

interface UploadResponse {
  success: boolean;
  document_id: number;
  filename: string;
  file_type: string;
  text_length: number;
  message: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Función para manejar el login exitoso
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleFileSelect = (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'text/plain'];
    const allowedExtensions = ['pdf', 'txt'];
    const fileExtension = file.name.toLowerCase().split('.').pop();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension || '')
    ) {
      setError(
        'Tipo de archivo no soportado. Solo se permiten archivos PDF y TXT.'
      );
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setUploadedFile(file);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const uploadDocument = async () => {
    if (!uploadedFile) {
      setError('Por favor selecciona un archivo primero.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch(buildApiUrl('/api/documents'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error subiendo el archivo');
      }

      const result: UploadResponse = await response.json();
      console.log('Documento subido exitosamente:', result);

      // Navegar automáticamente a la página de flashcards
      navigate(`/flashcards/${result.document_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error uploading document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainIcon className="text-primary-600 h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">Flashcards AI</h1>
            </div>
            
            {/* Mostrar botones de auth o menú de usuario según el estado */}
            {currentUser ? (
              <UserMenu username={currentUser.username} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center space-x-2 rounded-lg border-2 border-blue-600 bg-white px-4 py-2 font-semibold text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                  <LogInIcon className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Regístrate</span>
                </button>
              </div>
            )}
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
              Sube tu documento PDF o TXT y genera flashcards inteligentes con
              IA.
            </p>

            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`group cursor-pointer rounded-xl border-2 border-dashed p-8 text-center backdrop-blur-sm transition-all ${
                  isDragOver
                    ? 'border-blue-300 bg-white/20'
                    : uploadedFile
                      ? 'border-green-300/50 bg-green-500/10'
                      : 'border-blue-300/50 bg-white/10 hover:border-blue-300 hover:bg-white/20'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="space-y-2">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-300" />
                    <p className="text-lg font-medium text-green-100">
                      {uploadedFile.name}
                    </p>
                    <p className="text-green-200">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        resetUpload();
                      }}
                      className="text-sm text-blue-200 underline hover:text-white"
                    >
                      Seleccionar otro archivo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadIcon className="mx-auto h-16 w-16 text-blue-200" />
                    <p className="text-lg font-medium text-blue-100">
                      Arrastra y suelta tu documento aquí
                    </p>
                    <p className="text-blue-200">o haz clic para seleccionar</p>
                    <p className="text-sm text-blue-300">
                      Soporta archivos PDF y TXT (máximo 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 rounded-lg bg-red-500/20 p-4 text-red-200">
                  <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={uploadDocument}
                disabled={!uploadedFile || isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl focus:ring-4 focus:ring-orange-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    <span>Procesando Documento...</span>
                  </div>
                ) : (
                  'Subir y Generar Flashcards'
                )}
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

export default HomePage;
