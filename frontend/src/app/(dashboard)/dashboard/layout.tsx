import React from 'react';


export default function layout({
    children,
    forms
}: Readonly<{
    children: React.ReactNode;
    forms: React.ReactNode;
}>) {
    return (
        <>
            <div className='mt-32 h-fit flex flex-row justify-around'>

                <div>
                    {children}

                </div>
                <div>
                    {forms}
                </div>
            </div>
        </>
  )
}
