'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@lib/store/authStore';

interface SidebarNavProps {
  pathname: string;
}

const navItems = [
  { href: '/', icon: Home, label: 'Resumen' },
  { href: '/expenses', icon: Wallet, label: 'Gastos' },
  { href: '/settings', icon: Settings, label: 'Configuración' },
];

export function SidebarNav({ pathname }: SidebarNavProps) {
  const { clearCredentials } = useAuthStore();

  const handleLogout = () => {
    clearCredentials();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="bg-accent p-2 rounded-xl">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Gastito</h1>
          </div>
          
          <nav className="mt-8 flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar placeholder - handled by drawer in layout */}
      <div className="lg:hidden hidden">
        {/* Mobile navigation is handled via TopBar menu button and drawer */}
      </div>
    </>
  );
}
