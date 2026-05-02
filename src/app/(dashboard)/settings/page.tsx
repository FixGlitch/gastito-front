'use client';

import { useState } from 'react';
import { Save, DollarSign, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { Button, Text } from '@gluestack-ui/themed';
import { useUserSettings, useUpdateSettings } from '@lib/hooks/useQueryHooks';
import { formatCurrency } from '@lib/utils';
import { CurrencyInput } from '@components/atoms/CurrencyInput';

export default function SettingsPage() {
  const { data: settings, isLoading } = useUserSettings();
  const updateMutation = useUpdateSettings();
  
  const [formState, setFormState] = useState({
    salary: settings?.salary || 500000,
    savingsPercentage: settings?.savingsPercentage || 10,
    inflationRate: settings?.inflationRate || 5,
    payday: settings?.payday || 1,
    currency: settings?.currency || 'ARS',
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Cargando configuración...</p>
      </div>
    );
  }

  const handleSave = () => {
    updateMutation.mutate(formState);
  };

  const handleInputChange = (field: keyof typeof formState, value: string | number) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savingsAmount = (formState.salary * formState.savingsPercentage) / 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="text-gray-600 dark:text-gray-400">Personalizá tu experiencia financiera</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-accent mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración financiera</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Salario mensual
              </label>
              <CurrencyInput
                value={formState.salary}
                onValueChange={(value) => handleInputChange('salary', value)}
                locale="es-AR"
                currency="ARS"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Día de cobro
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formState.payday}
                onChange={(e) => handleInputChange('payday', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Día del mes en que cobrás"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Porcentaje de ahorro: {formState.savingsPercentage}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={formState.savingsPercentage}
                onChange={(e) => handleInputChange('savingsPercentage', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Ahorro estimado: {formatCurrency(savingsAmount)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tasa de inflación anual: {formState.inflationRate}%
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={formState.inflationRate}
                onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-accent mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen</h2>
          </div>
          
          <div className="space-y-4">
            <div className="pt-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Proyección mensual</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Salario:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(formState.salary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Ahorro automático:</span>
                  <span className="font-medium text-success-600">{formatCurrency(savingsAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Disponible para gastos:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(formState.salary - savingsAmount)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Inflación anual:</span>
                    <span className="font-medium text-danger-600">{formState.inflationRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">Consejo financiero</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Con un {formState.savingsPercentage}% de ahorro, estás por encima del promedio nacional. 
                    ¡Seguí así para alcanzar tus metas!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onPress={handleSave}
          isLoading={updateMutation.isPending}
          disabled={updateMutation.isPending}
          className="bg-accent hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          <Save size={20} className="mr-2" />
          <Text>Guardar cambios</Text>
        </Button>
      </div>
    </div>
  );
}
