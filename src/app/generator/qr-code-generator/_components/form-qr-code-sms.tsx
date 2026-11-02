'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { useEventListener } from 'usehooks-ts'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/text-area'

type FormQRCodeSMSProps = {
  form: any
}

export function FormQRCodeSMS({ form }: FormQRCodeSMSProps) {
  const { pending } = useFormStatus()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClear = () => {
    form.reset({ phone: '', message: '' })
  }

  return (
    <div className='space-y-2'>
      <FormField
        control={form.control}
        name='phone'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder='Enter phone number...' type='tel' disabled={pending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='message'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea {...field} placeholder='Enter message...' disabled={pending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex items-center gap-2 justify-end'>
        <Button variant='outline' onClick={handleClear} size='sm' disabled={pending}>
          Clear
        </Button>
        <Button ref={buttonRef} type='submit' variant='primary' size='sm' disabled={pending}>
          Generate
        </Button>
      </div>
    </div>
  )
}
