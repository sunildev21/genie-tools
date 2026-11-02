export default function ConversionResult({
    amount,
    exchangeRate,
    toCurrency
  }: {
    amount: number | string
    exchangeRate: number | null
    toCurrency: string
  }) {
    const convertedAmount = amount && exchangeRate ? (Number(amount) * exchangeRate).toFixed(2) : '0.00'
  
    return (
      <div className='p-4 border rounded-md bg-background/60 backdrop-blur-md text-center'>
        <p className='font-semibold text-2xl'>{convertedAmount}</p>
        <p className='text-muted-foreground'>{toCurrency}</p>
      </div>
    )
  }
  