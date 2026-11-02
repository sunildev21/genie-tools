import { Heading } from "@/components/heading"
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Heading
                title='PDF Converter'
                description='Convert your .docx,.pptx files to pdf format.'
              />
        <br />
        {children}
      </div>
    )
  }
  