import React from 'react'

type Props = {
    children: React.ReactNode
}

function layout({children}: Props) {
  return (
      <div className='min-h-screen flex justify-center items-center mt-24'>

          {children}
    </div>
  )
}

export default layout
