import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden pt-20 sm:pt-24 pb-16 sm:pb-24 px-3 sm:px-4 md:px-6">
      <div className="flex justify-center items-start w-full max-w-[100vw]">
        {children}
      </div>
    </div>
  );
}
