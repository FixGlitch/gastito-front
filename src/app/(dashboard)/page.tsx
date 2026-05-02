import { Wallet, TrendingUp, AlertCircle, PiggyBank } from 'lucide-react';
import { StatCard } from '@components/molecules/StatCard';
import { AllocationChart } from '@components/organisms/AllocationChart';
import { AlertBanner } from '@components/organisms/AlertBanner';
import { BudgetProgress } from '@components/molecules/BudgetProgress';
import { useDashboardStats } from '@lib/hooks/useQueryHooks';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen financiero</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tu panorama financiero actual
        </p>
      </div>

      {/* Alerts */}
      <AlertBanner 
        type="warning"
        title="Presupuesto ajustado"
        message="Has gastado el 75% de tu presupuesto mensual. Te quedan $125.000 para el resto del mes."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Presupuesto mensual"
          value={stats?.monthlyBudget || 500000}
          icon={Wallet}
          variant="primary"
        />
        <StatCard
          title="Gastado este mes"
          value={stats?.spentThisMonth || 375000}
          icon={TrendingUp}
          trend={12.5}
          variant="accent"
        />
        <StatCard
          title="Disponible"
          value={stats?.available || 125000}
          icon={PiggyBank}
          trend={-5.2}
          variant="secondary"
        />
        <StatCard
          title="Ahorro proyectado"
          value={stats?.projectedSavings || 50000}
          icon={PiggyBank}
          trend={8.3}
          variant="primary"
        />
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución de gastos
          </h2>
          <AllocationChart data={stats?.categoryDistribution || []} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progreso de presupuesto
            </h2>
            <BudgetProgress 
              spent={stats?.spentThisMonth || 375000}
              total={stats?.monthlyBudget || 500000}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Meta de ahorro
            </h2>
            <BudgetProgress 
              spent={stats?.currentSavings || 30000}
              total={stats?.savingsGoal || 100000}
              showPercentage
            />
          </div>
        </div>
      </div>
    </div>
  );
}
