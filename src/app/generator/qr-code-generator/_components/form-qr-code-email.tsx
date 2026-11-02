'use client'

import { useRef, useEffect } from 'react'
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

type FormQRCodeEmailProps = {
  form: any
}

export function FormQRCodeEmail({ form }: FormQRCodeEmailProps) {
  // Ensure hooks are called unconditionally
  const { pending } = useFormStatus()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!form || !form.control) {
      console.error("Form is not initialized correctly.");
    }
  }, [form])

  const handleClear = () => {
    if (form?.reset) {
      form.reset({ email: '' })
    }
  }

  const onKeydownSubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  const onKeydownClear = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClear()
    }
  }

  // Hooks must always be called
  useEventListener('keydown', onKeydownSubmit)
  useEventListener('keydown', onKeydownClear)

  return (
    <div className='space-y-2'>
      {form && form.control ? (
        <>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className='w-full focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none'
                    placeholder='Enter email address...'
                    type='email'
                    disabled={pending}
                  />
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
        </>
      ) : (
        <p className="text-red-500">Form is not initialized correctly.</p>
      )}
    </div>
  )
}
