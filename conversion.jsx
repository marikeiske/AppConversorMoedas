import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const currencies = {
  BRL: { symbol: 'R$', flag: '🇧🇷' },
  USD: { symbol: '$', flag: '🇺🇸' },
  EUR: { symbol: '€', flag: '🇪🇺' }
};

export default function ConversionHistory({ conversions, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Conversões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Histórico de Conversões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {conversions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma conversão realizada ainda</p>
            </div>
          ) : (
            conversions.map((conversion) => (
              <div 
                key={conversion.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span>{currencies[conversion.from_currency]?.flag}</span>
                    <span className="font-semibold">
                      {currencies[conversion.from_currency]?.symbol} {conversion.from_amount.toFixed(2)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-1">
                    <span>{currencies[conversion.to_currency]?.flag}</span>
                    <span className="font-semibold text-blue-600">
                      {currencies[conversion.to_currency]?.symbol} {conversion.to_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    Taxa: {conversion.exchange_rate.toFixed(4)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(conversion.conversion_date), 'dd/MM HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
