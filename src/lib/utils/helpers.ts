import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrencyARS(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date));
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    sube: 'text-sube-600 bg-sube-100 dark:bg-sube-900/30',
    comida: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
    transporte: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    servicios: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    entretenimiento: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    salud: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    educacion: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
    compras: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30',
    otros: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30',
  };
  return colors[category] || colors.otros;
}

export function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    sube: 'SUBE',
    comida: 'Comida',
    transporte: 'Transporte',
    servicios: 'Servicios',
    entretenimiento: 'Entretenimiento',
    salud: 'Salud',
    educacion: 'Educación',
    compras: 'Compras',
    otros: 'Otros',
  };
  return names[category] || category;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function isToday(date: string | Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
}

export function isThisWeek(date: string | Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return checkDate >= weekStart && checkDate <= weekEnd;
}

export function isThisMonth(date: string | Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
}
