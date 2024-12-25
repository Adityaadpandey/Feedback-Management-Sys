import React from 'react';


export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-20">
            {children}
        </div>

    )
}
