import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: "CognifyForms - AI-Powered Forms",
    description: "Signup and SignIn pages"
};


type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <div className='h-screen flex justify-center items-center'>
            {children}</div>
    )
}

export default layout
