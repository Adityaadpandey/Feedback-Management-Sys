import React from 'react';

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-24 mb-[190px] flex justify-center items-center px-4">
            {children}
        </div>

    )
}
