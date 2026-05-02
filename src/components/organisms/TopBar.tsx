'use client';

import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@lib/store/authStore';
import { Button } from '@gluestack-ui/themed';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {onMenuClick && (
            <Button 
              onPress={onMenuClick}
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
            >
              <Menu size={20} />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">Gastito</h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            variant="ghost"
            size="icon"
            className="rounded-lg"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center max-w-xs rounded-full bg-gray-200 dark:bg-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            >
              <span className="sr-only">Abrir menú de usuario</span>
              <span className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      useAuthStore.getState().clearCredentials();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
