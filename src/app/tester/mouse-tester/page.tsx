"use client";

import MouseTracker from "./_components/mouse-tracker";

import { Heading } from '@/components/heading'
import AlertError from '@/components/alert-error'

export default function MouseTesterPage() {
    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <Heading 
                    title='Mouse Tester'
                    description='Press any key to test your Mouse working or not.'
                  />
            <div className="hidden lg:flex flex-col items-center gap-6">
                <MouseTracker />
            </div>
            <div className='flex lg:hidden'>
                <AlertError message='Support for desktop only!' />
            </div>
        </div>
    );
}
