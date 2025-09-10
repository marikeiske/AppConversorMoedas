
import React, { useState, useEffect, useCallback } from 'react';
import { Conversion } from '@/entities/Conversion';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, RefreshCw, Banknote } from 'lucide-react';
import { toast } from 'sonner';

import CurrencyInput from '../components/converter/CurrencyInput';
import ExchangeRates from '../components/converter/ExchangeRates';
import ConversionHistory from '../components/converter/ConversionHistory';

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const getExchangeRate = useCallback((from, to) => {
    if (from === to) return 1;
    
    const rateKey = `${from}${to}`;
    if (exchangeRates[rateKey]) {
      return exchangeRates[rateKey];
    }
    
    // Calcular taxa inversa ou através de uma moeda intermediária
    if (from === 'BRL' && to === 'USD') {
      return 1 / (exchangeRates.USDBRL || 5.10);
    }
    if (from === 'BRL' && to === 'EUR') {
      return 1 / (exchangeRates.EURBRL || 5.55);
    }
    if (from === 'USD' && to === 'BRL') {
      return exchangeRates.USDBRL || 5.10;
    }
    if (from === 'EUR' && to === 'BRL') {
      return exchangeRates.EURBRL || 5.55;
    }
    if (from === 'EUR' && to === 'USD') {
      return exchangeRates.EURUSD || 1.09;
    }
    if (from === 'USD' && to === 'EUR') {
      return exchangeRates.USDEUR || 0.92;
    }
    
    return 1;
  }, [exchangeRates]);

  const calculateConversion = useCallback(() => {
    const amount = parseFloat(fromAmount);
    if (!amount || amount <= 0) {
      setToAmount('');
      return;
    }

    const rate = getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;
    setToAmount(convertedAmount.toFixed(2));
  }, [fromAmount, fromCurrency, toCurrency, getExchangeRate]);

  useEffect(() => {
    loadExchangeRates();
    loadConversionHistory();
  }, []);

  useEffect(() => {
    if (fromAmount && exchangeRates) {
      calculateConversion();
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency, exchangeRates, calculateConversion]);

  const loadExchangeRates = async () => {
    setRatesLoading(true);
    try {
      const response = await InvokeLLM({
        prompt: `Busque as cotações atuais de câmbio para:
        - USD para BRL (Dólar Americano para Real Brasileiro)
        - EUR para BRL (Euro para Real Brasileiro)  
        - EUR para USD (Euro para Dólar Americano)
        - USD para EUR (Dólar Americano para Euro)
        
        Retorne as cotações exatas e atuais do mercado financeiro.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            USDBRL: { type: "number" },
            EURBRL: { type: "number" },
            EURUSD: { type: "number" },
            USDEUR: { type: "number" }
          }
        }
      });

      setExchangeRates(response);
      setLastUpdate(new Date().toISOString());
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      // Fallback com cotações aproximadas
      setExchangeRates({
        USDBRL: 5.10,
        EURBRL: 5.55,
        EURUSD: 1.09,
        USDEUR: 0.92
      });
      setLastUpdate(new Date().toISOString());
    } finally {
      setRatesLoading(false);
    }
  };

  const loadConversionHistory = async () => {
    try {
      const history = await Conversion.list('-conversion_date', 10);
      setConversions(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleConvert = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Digite um valor válido para converter');
      return;
    }

    if (fromCurrency === toCurrency) {
      toast.error('Selecione moedas diferentes para conversão');
      return;
    }

    setLoading(true);
    try {
      const amount = parseFloat(fromAmount);
      const rate = getExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = amount * rate;

      await Conversion.create({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_amount: amount,
        to_amount: convertedAmount,
        exchange_rate: rate,
        conversion_date: new Date().toISOString()
      });

      setToAmount(convertedAmount.toFixed(2));
      loadConversionHistory();
      toast.success('Conversão realizada com sucesso!');
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast.error('Erro ao realizar conversão');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Banknote className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversor de Moedas</h1>
              <p className="text-gray-600">Converta entre Real, Dólar e Euro com cotações atualizadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conversion Panel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Currency Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <CurrencyInput
                  currency={fromCurrency}
                  amount={fromAmount}
                  onCurrencyChange={setFromCurrency}
                  onAmountChange={setFromAmount}
                  label="De"
                />
                
                <CurrencyInput
                  currency={toCurrency}
                  amount={toAmount}
                  onCurrencyChange={setToCurrency}
                  onAmountChange={() => {}} // Readonly
                  label="Para"
                  readOnly={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={swapCurrencies}
                  className="flex items-center gap-2 h-12 px-6"
                >
                  <ArrowUpDown className="w-5 h-5" />
                  Trocar
                </Button>
                
                <Button
                  size="lg"
                  onClick={handleConvert}
                  disabled={loading || !fromAmount}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Convertendo...
                    </>
                  ) : (
                    'Converter'
                  )}
                </Button>
              </div>

              {/* Exchange Rates */}
              <ExchangeRates 
                rates={exchangeRates}
                lastUpdate={lastUpdate}
                loading={ratesLoading}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ConversionHistory 
              conversions={conversions}
              loading={loading}
            />
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  loadExchangeRates();
                  loadConversionHistory();
                }}
                disabled={ratesLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${ratesLoading ? 'animate-spin' : ''}`} />
                Atualizar Cotações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
