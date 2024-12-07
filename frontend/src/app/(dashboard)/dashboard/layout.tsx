import React from 'react';


export default function layout({
    children,
    forms,
    responses,
}: Readonly<{
    children: React.ReactNode;
    forms: React.ReactNode;
    responses: React.ReactNode;
}>) {
    return (
        <>
               {children}
            <div className='mt-32 h-fit flex flex-row justify-around'>
                <div>
                    {forms}
                </div>
                <div>
                    {responses}
                    </div>
            </div>
        </>
    )
}
