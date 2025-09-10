import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const currencies = {
  BRL: { name: 'Real Brasileiro', symbol: 'R$', flag: '🇧🇷' },
  USD: { name: 'Dólar Americano', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' }
};

export default function CurrencyInput({ 
  currency, 
  amount, 
  onCurrencyChange, 
  onAmountChange, 
  label,
  readOnly = false 
}) {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          {label}
        </label>
        
        <div className="space-y-3">
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="h-12 text-lg bg-gray-50">
              <SelectValue>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currencies[currency]?.flag}</span>
                  <div>
                    <span className="font-semibold">{currency}</span>
                    <span className="text-gray-500 ml-2 text-sm">
                      {currencies[currency]?.name}
                    </span>
                  </div>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currencies).map(([code, info]) => (
                <SelectItem key={code} value={code}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{info.flag}</span>
                    <div>
                      <span className="font-semibold">{code}</span>
                      <span className="text-gray-500 ml-2">{info.name}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              {currencies[currency]?.symbol}
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              readOnly={readOnly}
              className="pl-12 h-14 text-xl font-semibold bg-gray-50"
              placeholder="0,00"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
