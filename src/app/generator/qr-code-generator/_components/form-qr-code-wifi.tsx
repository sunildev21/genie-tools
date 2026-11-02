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

type FormQRCodeWiFiProps = {
  form: any
}

export function FormQRCodeWiFi({ form }: FormQRCodeWiFiProps) {
  const { pending } = useFormStatus()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClear = () => {
    if (form?.reset) {
      form.reset({ ssid: '', password: '', encryption: 'WPA' }) // Reset form values
    }
  }

  // Handle keyboard events
  const onKeydownSubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  const onKeydownClear = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && document.activeElement?.tagName === 'INPUT') {
      e.preventDefault()
      handleClear()
    }
  }

  useEventListener('keydown', onKeydownSubmit)
  useEventListener('keydown', onKeydownClear)

  if (!form) return <div /> // Prevents crashes if form is undefined

  return (
    <div className='space-y-2'>
      {/* SSID Input */}
      <FormField
        control={form.control}
        name='ssid'
        rules={{ required: 'WiFi SSID is required' }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder='Enter WiFi name (SSID)...' disabled={pending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password Input */}
      <FormField
        control={form.control}
        name='password'
        rules={{ required: 'Password is required for WPA/WPA2 encryption' }} // ✅ Add validation
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} type='password' placeholder='Enter password...' disabled={pending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Encryption Type Select Dropdown */}
      <FormField
        control={form.control}
        name='encryption'
        rules={{ required: 'Encryption type is required' }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <select {...field} className="border rounded px-2 py-1 w-full" disabled={pending}>
                <option value="WPA">WPA</option>
                <option value="WPA2">WPA2</option>
                <option value="WEP">WEP</option>
                <option value="None">None</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Buttons */}
      <div className="flex items-center gap-2 justify-end">
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
