'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select'
import ConversionResult from './conversion-result'

const API_URL = 'https://api.exchangerate-api.com/v4/latest/'

// ✅ Full currency flags mapping
const currencyFlags: Record<string, string> = {
  AED: '🇦🇪', AFN: '🇦🇫', ALL: '🇦🇱', AMD: '🇦🇲', ANG: '🇳🇱', AOA: '🇦🇴', ARS: '🇦🇷', AUD: '🇦🇺',
  AWG: '🇦🇼', AZN: '🇦🇿', BAM: '🇧🇦', BBD: '🇧🇧', BDT: '🇧🇩', BGN: '🇧🇬', BHD: '🇧🇭', BIF: '🇧🇮',
  BMD: '🇧🇲', BND: '🇧🇳', BOB: '🇧🇴', BRL: '🇧🇷', BSD: '🇧🇸', BTN: '🇧🇹', BWP: '🇧🇼', BYN: '🇧🇾',
  BZD: '🇧🇿', CAD: '🇨🇦', CDF: '🇨🇩', CHF: '🇨🇭', CLP: '🇨🇱', CNY: '🇨🇳', COP: '🇨🇴', CRC: '🇨🇷',
  CUP: '🇨🇺', CVE: '🇨🇻', CZK: '🇨🇿', DJF: '🇩🇯', DKK: '🇩🇰', DOP: '🇩🇴', DZD: '🇩🇿', EGP: '🇪🇬',
  ERN: '🇪🇷', ETB: '🇪🇹', EUR: '🇪🇺', FJD: '🇫🇯', FKP: '🇫🇰', GBP: '🇬🇧', GEL: '🇬🇪', GHS: '🇬🇭',
  GIP: '🇬🇮', GMD: '🇬🇲', GNF: '🇬🇳', GTQ: '🇬🇹', GYD: '🇬🇾', HKD: '🇭🇰', HNL: '🇭🇳', HRK: '🇭🇷',
  HTG: '🇭🇹', HUF: '🇭🇺', IDR: '🇮🇩', ILS: '🇮🇱', INR: '🇮🇳', IQD: '🇮🇶', IRR: '🇮🇷', ISK: '🇮🇸',
  JMD: '🇯🇲', JOD: '🇯🇴', JPY: '🇯🇵', KES: '🇰🇪', KGS: '🇰🇬', KHR: '🇰🇭', KMF: '🇰🇲', KPW: '🇰🇵',
  KRW: '🇰🇷', KWD: '🇰🇼', KYD: '🇰🇾', KZT: '🇰🇿', LAK: '🇱🇦', LBP: '🇱🇧', LKR: '🇱🇰', LRD: '🇱🇷',
  LSL: '🇱🇸', LYD: '🇱🇾', MAD: '🇲🇦', MDL: '🇲🇩', MGA: '🇲🇬', MKD: '🇲🇰', MMK: '🇲🇲', MNT: '🇲🇳',
  MOP: '🇲🇴', MUR: '🇲🇺', MVR: '🇲🇻', MWK: '🇲🇼', MXN: '🇲🇽', MYR: '🇲🇾', MZN: '🇲🇿', NAD: '🇳🇦',
  NGN: '🇳🇬', NIO: '🇳🇮', NOK: '🇳🇴', NPR: '🇳🇵', NZD: '🇳🇿', OMR: '🇴🇲', PAB: '🇵🇦', PEN: '🇵🇪',
  PGK: '🇵🇬', PHP: '🇵🇭', PKR: '🇵🇰', PLN: '🇵🇱', PYG: '🇵🇾', QAR: '🇶🇦', RON: '🇷🇴', RSD: '🇷🇸',
  RUB: '🇷🇺', RWF: '🇷🇼', SAR: '🇸🇦', SBD: '🇸🇧', SCR: '🇸🇨', SDG: '🇸🇩', SEK: '🇸🇪', SGD: '🇸🇬',
  SHP: '🇸🇭', SLL: '🇸🇱', SOS: '🇸🇴', SRD: '🇸🇷', SSP: '🇸🇸', STD: '🇸🇹', SYP: '🇸🇾', SZL: '🇸🇿',
  THB: '🇹🇭', TJS: '🇹🇯', TMT: '🇹🇲', TND: '🇹🇳', TOP: '🇹🇴', TRY: '🇹🇷', TTD: '🇹🇹', TWD: '🇹🇼',
  TZS: '🇹🇿', UAH: '🇺🇦', UGX: '🇺🇬', USD: '🇺🇸', UYU: '🇺🇾', UZS: '🇺🇿', VEF: '🇻🇪', VND: '🇻🇳',
  VUV: '🇻🇺', WST: '🇼🇸', XAF: '🇨🇲', XCD: '🇦🇬', XOF: '🇸🇳', XPF: '🇵🇫', YER: '🇾🇪', ZAR: '🇿🇦',
  ZMW: '🇿🇲', ZWL: '🇿🇼'
}

export default function CurrencyForm() {
  const [amount, setAmount] = useState<number | string>('')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('EUR')
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [currencies, setCurrencies] = useState<string[]>([])

  useEffect(() => {
    fetch(`${API_URL}USD`)
      .then(response => response.json())
      .then(data => setCurrencies(Object.keys(data.rates)))
      .catch(error => console.error('Error fetching currencies:', error))
  }, [])

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${API_URL}${fromCurrency}`)
        .then(response => response.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
        .catch(error => console.error('Error fetching exchange rate:', error))
    }
  }, [fromCurrency, toCurrency])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <Input
        type='number'
        placeholder='Enter amount'
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <div className='flex items-center gap-4'>
        <Select onValueChange={setFromCurrency} value={fromCurrency}>
          <SelectTrigger>
            {currencyFlags[fromCurrency] || '🏳'} {fromCurrency}
          </SelectTrigger>
          <SelectContent>
            {currencies.map(currency => (
              <SelectItem key={currency} value={currency}>
                {currencyFlags[currency] || '🏳'} {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSwap}>⇄</Button>

        <Select onValueChange={setToCurrency} value={toCurrency}>
          <SelectTrigger>
            {currencyFlags[toCurrency] || '🏳'} {toCurrency}
          </SelectTrigger>
          <SelectContent>
            {currencies.map(currency => (
              <SelectItem key={currency} value={currency}>
                {currencyFlags[currency] || '🏳'} {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ConversionResult amount={amount} exchangeRate={exchangeRate} toCurrency={toCurrency} />
    </div>
  )
}
