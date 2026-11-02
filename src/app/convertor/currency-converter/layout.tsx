export async function generateMetadata() {
    return {
      title: 'Currency Converter'
    }
  }
  
  export default function CurrencyConverterLayout({
    children
  }: {
    children: React.ReactNode
  }) {
    return <>{children}</>
  }
  