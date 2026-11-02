'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type FormQRCodePaymentProps = {
  form: any
}

export function FormQRCodePayment({ form }: FormQRCodePaymentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { pending } = form.formState

  const upiRegex = /^[a-zA-Z0-9._-]+@(?:upi|paytm|ybl|apl|wa|okhdfcbank|okicici|oksbi|icici|sbi|axis)$/;
  const isUpiValid = upiRegex.test(form.watch('upiId') || '');
  const isAmountValid = form.watch('amount') && form.watch('amount') > 0;

  const handleClear = () => {
    form.reset({ upiId: '', amount: '' }) // ✅ Reset correctly
  }

  return (
    <div className='space-y-2'>
      <FormField
        control={form.control}
        name='upiId'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder='Enter UPI ID (e.g., user@upi)' type='text' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='amount'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder='Enter Amount (optional)' type='number' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <div className='flex items-center gap-2 justify-end'>
        <Button
          variant='outline'
          onClick={handleClear}
          size='sm'
          disabled={pending}
        >
          Clear
        </Button>
        <Button
          ref={buttonRef}
          type='submit'
          variant='primary'
          size='sm'
          disabled={pending}
        >
          Generate
        </Button>
      </div>
    </div>
  )
}
