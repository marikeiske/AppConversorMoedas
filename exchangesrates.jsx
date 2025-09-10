import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ExchangeRates({ rates, lastUpdate, loading }) {
  const getRateDisplay = (rate, currency) => {
    if (loading) {
      return <div className="h-6 bg-gray-200 rounded animate-pulse" />;
    }
    return (
      <span className="text-2xl font-bold text-gray-900">
        {rate ? rate.toFixed(4) : '--'}
      </span>
    );
  };

  const getTrendIcon = (currency) => {
    // Simulação de tendência (em produção viria da API)
    const trend = Math.random() > 0.5;
    return trend ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5" />
          Cotações Atuais
        </CardTitle>
        {lastUpdate && (
          <p className="text-sm text-gray-600">
            Atualizado: {format(new Date(lastUpdate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇺🇸</span>
              <span className="font-medium">USD/BRL</span>
              {getTrendIcon('USD')}
            </div>
            {getRateDisplay(rates?.USDBRL, 'USD')}
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇪🇺</span>
              <span className="font-medium">EUR/BRL</span>
              {getTrendIcon('EUR')}
            </div>
            {getRateDisplay(rates?.EURBRL, 'EUR')}
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇪🇺</span>
              <span className="font-medium">EUR/USD</span>
              {getTrendIcon('EURUSD')}
            </div>
            {getRateDisplay(rates?.EURUSD, 'EURUSD')}
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇺🇸</span>
              <span className="font-medium">USD/EUR</span>
              {getTrendIcon('USDEUR')}
            </div>
            {getRateDisplay(rates?.USDEUR, 'USDEUR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
