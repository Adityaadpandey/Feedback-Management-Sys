import React from 'react'

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>)



 {
  return (
    <div className="my-20 flex justify-center items-center">
      {children}
    </div>
  )
}
