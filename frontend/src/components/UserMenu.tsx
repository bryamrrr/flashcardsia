import { useState, useRef, useEffect } from 'react';
import { UserIcon, LogOutIcon, ChevronDownIcon } from 'lucide-react';

interface UserMenuProps {
  username: string;
  onLogout: () => void;
}

function UserMenu({ username, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <UserIcon className="h-5 w-5" />
        </div>
        
        {/* Nombre de usuario */}
        <span className="font-semibold text-gray-900">{username}</span>
        
        {/* Icono de dropdown */}
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">Usuario activo</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
