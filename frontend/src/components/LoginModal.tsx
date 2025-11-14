import { useState } from 'react';
import { XIcon, UserIcon, LockIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { buildApiUrl } from '../config/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: LoginResponse) => void;
}

interface LoginResponse {
  id: number;
  username: string;
  created_at: string;
}

function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }

      const result: LoginResponse = await response.json();
      console.log('Usuario logueado:', result);
      
      // Guardar información de usuario en localStorage
      localStorage.setItem('user', JSON.stringify(result));
      
      setSuccess(true);
      
      // Llamar al callback si existe
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
      
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error logging in:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          disabled={isLoading}
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-gray-600">
            Ingresa con tu cuenta de Flashcards AI
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 flex items-center space-x-2 rounded-lg bg-green-50 p-4 text-green-800">
            <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">¡Inicio de sesión exitoso!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center space-x-2 rounded-lg bg-red-50 p-4 text-red-800">
            <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="login-username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nombre de Usuario
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="usuario123"
                required
                disabled={isLoading || success}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
                disabled={isLoading || success}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : success ? (
              '¡Sesión iniciada!'
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
