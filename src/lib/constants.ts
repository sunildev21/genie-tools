import {
  ImageIcon,
  KeyIcon,
  KeyboardIcon,
  LinkIcon,
  MailIcon,
  MessageSquareTextIcon,
  PipetteIcon,
  QrCodeIcon,
  CircleDollarSign,
  TextIcon,
  FileIcon,
  PenTool,
  FileTextIcon,
  IndianRupee,
  WifiIcon,
  MousePointerIcon,
  Gavel,
  Volume2,
  

} from 'lucide-react'

import { ListTools, QRCodeOption } from '@/lib/types'
import { FaJs, FaPython } from 'react-icons/fa'

export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_LOCAL_URL
    : process.env.NEXT_PUBLIC_URL

export const SITE_NAME = 'Tools Online'
export const SITE_TITLE = 'Tools Online'
export const SITE_DESCRIPTION =
  'A collection of free tools created by devGaurav.'

export const LIST_TOOLS: ListTools[] = [
  {
    label: 'Converter',
    tools: [
      {
        label: 'Color Converter',
        link: '/convertor/color-converter',
        keywords: ['Convertor', 'Color', 'Hex', 'RGB', 'HSL', 'CSS', 'Picker'],
        color: '#fd7e14',
        icon: PipetteIcon
      },
      {
        label: 'Image Converter',
        link: '/convertor/image-converter',
        keywords: ['Convertor', 'Image', 'Format', 'Extension'],
        color: '#40c057',
        icon: ImageIcon
      },
      // {
      //   label: 'PDF Converter',
      //   link: '/convertor/pdf-converter',
      //   keywords: ['Convertor', 'PDF', 'Word', 'PPT', 'File', 'Document'],
      //   color: '#845ef7',
      //   icon: FileTextIcon
      // },
      {
        label: 'File Resizer',
        link: '/convertor/file-resizer',
        keywords: ['Resize', 'File', 'PDF', 'DOCX', 'PPTX', 'Image'],
        color: '#FF5733',
        icon: FileIcon
    },
    
      {
        label: 'Currency Converter',
        link: '/convertor/currency-converter',
        keywords: ['Convertor', 'Currency', 'Money', 'Exchange', 'Forex'],
        color: '#ffcc00',
        icon: CircleDollarSign
      },
      {
        label: 'Text to Speech Converter',
        link: '/convertor/text-to-speech',
        keywords: ['Convertor', 'Text', 'Speech', 'Voice', 'TTS', 'Multilingual'],
        color: '#4f46e5', // A calm, tech-feel blue (adjust if you want)
        icon: Volume2
      }
      
    ]
  },
  {
    label: 'Calculator',
    tools: [
      {
        label: 'Word Counter',
        link: '/calculator/word-counter',
        keywords: ['Word', 'Counter', 'Calculator', 'Text'],
        color: '#4c6ef5',
        icon: TextIcon
      }
    ]
  },
  {
    label: 'Generator',
    tools: [
      {
        label: 'Password Generator',
        link: '/generator/password-generator',
        keywords: ['Generator', 'Password', 'Random'],
        color: '#f783ac',
        icon: KeyIcon
      },
    //   {
    //     label: 'Image Generator',
    //     link: '/generator/image-generator',
    //     keywords: ['Generator', 'Image', 'Text to Image', 'AI'],
    //     color: '#74c0fc',  // Light blue color
    //     icon: ImageIcon    // Replace with a suitable icon
    // },
    {
        label: 'Diagram Generator',
        link: '/generator/diagram-generator',
        keywords: ['Generator', 'Diagram', 'UML', 'PlantUML', 'Class', 'Component'],
        color: '#74c0fc',   // Light blue color
        icon: PenTool   // Replace with your preferred icon component
    },
{
        label: 'QR Code Generator',
        link: '/generator/qr-code-generator',
        keywords: ['Generator', 'QR', 'Code', 'Barcode'],
        color: '#0891b2',
        icon: QrCodeIcon
      }
    ]
  },
  {
    label: 'Tester',
    tools: [
      {
        label: 'Keyboard Tester',
        link: '/tester/keyboard-tester',
        keywords: ['Tester', 'Keyboard', 'Test'],
        color: '#be4bdb',
        icon: KeyboardIcon
      },
      {
        label: 'Mouse Tester',
        link: '/tester/mouse-tester',
        keywords: ['Tester', 'Mouse', 'Clicks', 'Pointer', 'Buttons'],
        color: '#ff5722',
        icon: MousePointerIcon
      },
    //   {
    //     label: 'Legal Aid Chatbot',
    //     link: '/legal-aid-chatbot',
    //     keywords: ['Legal', 'Chatbot', 'Law', 'Assistance', 'Help'],
    //     color: '#4caf50', // Green color for legal theme
    //     icon: Gavel // Choose a suitable icon
    // }
    
      // ,
      // {
      //   label: 'Internet Speed Tester',
      //   link: '/tester/internet-speed-tester',
      //   keywords: ['Tester', 'Internet', 'Speed', 'Upload', 'Download', 'Ping'],
      //   color: '#2196F3',
      //   icon: NetworkIcon
      // }
    ]
  },
  {
    label: 'Compiler',
    tools: [
      {
        label: 'JavaScript Compiler',
        link: '/compiler/js',
        keywords: ['JavaScript', 'JS Compiler', 'Code Execution', 'Programming'],
        color: '#f7df1e',
        icon: FaJs 
      },
      {
        label: 'Python Compiler',
        link: '/compiler/python',
        keywords: ['Python', 'Python Compiler', 'Code Execution', 'Programming'],
        color: '#3776AB',
        icon: FaPython 
      }
    ]
  }
]

export const LIST_QR_CODE_OPTIONS: QRCodeOption[] = [
  {
    label: 'URL',
    icon: LinkIcon
  },
  {
    label: 'Text',
    icon: TextIcon
  },
  {
    label: 'Email',
    icon: MailIcon
  },
  {
    label: 'SMS',
    icon: MessageSquareTextIcon
  },
  {
    label: 'WiFi',
    icon: WifiIcon
  },
  {
    label: 'Payment',
    icon: IndianRupee
  }
]
