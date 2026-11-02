'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CopyIcon, SaveIcon } from 'lucide-react'
import Image from 'next/image'
import QrCode from 'qrcode'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { LIST_QR_CODE_OPTIONS } from '@/lib/constants'
import { QRCodeOption } from '@/lib/types'
import { FormQRCodeText } from './form-qr-code-text'
import { FormQRCodeEmail } from './form-qr-code-email'
import { FormQRCodeURL } from './form-qr-code-url'
import { FormQRCodeWiFi } from './form-qr-code-wifi'
import { FormQRCodePayment } from './form-qr-code-payment'
import { QRCodeOptionItem } from './qr-code-option-item'

const formSchema = z.object({
  url: z.string().url().optional(),
  text: z.string().optional(),
  email: z.string().email().optional(),
  ssid: z.string().optional(),
  password: z.string().optional(),
  encryption: z.string().optional(),
  upiId: z.string().optional(), // ✅ Add UPI ID field
  amount: z.string().optional() // ✅ Add Amount field
})


const IMAGE_SIZE = 400

export function FormQRCode() {
  const [qrCodeURL, setQRCodeURL] = useState<string>('')
  const [activeOption, setActiveOption] = useState<QRCodeOption>(LIST_QR_CODE_OPTIONS[0])
  const imageRef = useRef<HTMLImageElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      text: '',
      email: '',
      ssid: '',
      password: '',
      encryption: 'WPA',
      upiId: '',  // ✅ Already included in schema
      amount: ''   // ✅ Already included in schema
    }
  })
  
  const handleActiveOption = (option: QRCodeOption) => {
    console.log('Selected QR Option:', option) // Debugging log
    setActiveOption(option)
    form.reset()
  }

  const handleCopyImage = async () => {
    if (imageRef.current) {
      const response = await fetch(qrCodeURL)
      const blob = await response.blob()
      const clipboardItem = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([clipboardItem])
      toast.success('QR Code copied to clipboard!')
    }
  }

  const handleDownloadImage = () => {
    if (imageRef.current) {
      const link = document.createElement('a')
      link.href = imageRef.current.src
      link.download = 'qr-code.png'
      link.click()
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Active QR Code Option:', activeOption) // Debugging log
    let dataToEncode = ''

    switch (activeOption.label) {
      case 'URL':
        if (!values.url) {
          toast.error('Please enter a valid URL!')
          return
        }
        dataToEncode = values.url
        break

      case 'Text':
        if (!values.text) {
          toast.error('Please enter some text!')
          return
        }
        dataToEncode = values.text
        break

      case 'Email':
        if (!values.email) {
          toast.error('Please enter a valid email!')
          return
        }
        dataToEncode = `mailto:${values.email}`
        break

      case 'WiFi':
        if (!values.ssid) {
          toast.error('Please enter a WiFi SSID!')
          return
        }
        dataToEncode = `WIFI:T:${values.encryption};S:${values.ssid};P:${values.password};;`
        break

        case 'Payment': {
          console.log("UPI ID Entered:", values.upiId); // ✅ Debugging
          console.log("Amount Entered:", values.amount);
        
          const upiRegex = /^[0-9a-zA-Z][0-9a-zA-Z.\-_]{1,254}@[a-zA-Z]{2,64}$/; // ✅ Updated regex (allows numbers at start)
          const minAmount = 1;
          const maxAmount = 100000;
        
          // 🔹 Validate UPI ID
          if (!values.upiId || typeof values.upiId !== 'string' || !upiRegex.test(values.upiId.trim())) {
            toast.error('Please enter a valid UPI ID! (e.g., example@upi or 9209070574@upi)');
            return;
          }
        
          // 🔹 Validate Amount
          const amountStr = values.amount?.toString().trim() || '';
          if (amountStr) {
            const amountNum = Number(amountStr);
            if (!/^\d+(\.\d{1,2})?$/.test(amountStr) || isNaN(amountNum) || amountNum < minAmount || amountNum > maxAmount) {
              toast.error(`Amount should be a valid number between ₹${minAmount} and ₹${maxAmount}`);
              return;
            }
          }
        
          // ✅ Format the UPI payment string correctly
          dataToEncode = `upi://pay?pa=${values.upiId.trim()}&pn=Merchant&mc=&tid=&tr=&tn=Payment&am=${amountStr}&cu=INR`;
        
          console.log("Final Payment String:", dataToEncode); // ✅ Debugging output
          break;
        }
        
        

      default:
        toast.error(`Invalid QR code type selected: ${activeOption.label || 'Unknown'}`)
        return
    }

    try {
      const qrCodeDataUrl = await QrCode.toDataURL(dataToEncode, {
        width: IMAGE_SIZE
      })
      setQRCodeURL(qrCodeDataUrl)
    } catch (error) {
      console.error('QR Code generation error:', error)
      toast.error('Failed to generate QR code!')
    }
  }

  return (
    <div className='w-full mt-12 flex flex-wrap md:flex-nowrap items-center justify-center gap-4'>
      {/* Form */}
      <Card className='p-4 min-h-[400px] w-full' style={{ WebkitBackdropFilter: 'blur(8px)' }}>
        <div className='grid gap-4 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 mb-6'>
          {LIST_QR_CODE_OPTIONS.map(option => (
            <QRCodeOptionItem
              key={option.label}
              option={option}
              onOptionClick={handleActiveOption}
              isActive={activeOption?.label === option.label}
            />
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {activeOption?.label === 'URL' && <FormQRCodeURL form={form} />}
            {activeOption?.label === 'Text' && <FormQRCodeText form={form} />}
            {activeOption?.label === 'Email' && <FormQRCodeEmail form={form} />}
            {activeOption?.label === 'WiFi' && <FormQRCodeWiFi form={form} />}
            {activeOption?.label === 'Payment' && <FormQRCodePayment form={form} />}

            
          </form>
        </Form>
      </Card>

      {/* QR Image */}
      <Card
        className='p-4 min-h-[400px] w-full md:w-[500px] flex flex-col items-center gap-4'
        style={{ WebkitBackdropFilter: 'blur(8px)' }}
      >
        <Image
          ref={imageRef}
          src={qrCodeURL || '/images/qr-code-devgaurav.png'}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          alt='QR Code'
          className='rounded-md border shadow-sm'
        />

        <div className='flex items-center justify-center gap-2'>
          <Button variant='success' onClick={handleDownloadImage} size='sm'>
            <SaveIcon className='size-5 mr-2' />
            <p className='font-normal tracking-wide'>Download</p>
          </Button>
          <Button variant='outline' onClick={handleCopyImage} size='sm'>
            <CopyIcon className='size-5 mr-2' />
            <p className='font-normal tracking-wide'>Copy</p>
          </Button>
        </div>
      </Card>
    </div>
  )
}
