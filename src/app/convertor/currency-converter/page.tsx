import { Container } from '@/components/container'
import { Heading } from '@/components/heading'
import CurrencyForm from './_components/currency-form'

export default function CurrencyConverterPage() {
  return (
    <Container className='flex flex-col items-center justify-center'>
      <Heading
        title='Currency Converter'
        description='Convert currency values in real-time.'
      />
      <br/>
      <CurrencyForm />
    </Container>
  )
}
