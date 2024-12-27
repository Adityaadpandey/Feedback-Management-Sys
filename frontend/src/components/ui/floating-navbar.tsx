"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    const pathname = usePathname();
    const { scrollYProgress } = useScroll();

    const [visible, setVisible] = useState(true);

    // Reset visibility state when page is reloaded or path changes
    useEffect(() => {
        setVisible(true);  // Reset to visible when the page loads
    }, [pathname]);  // Depend on pathname to reset visibility on route change

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            const direction = current - scrollYProgress.getPrevious()!;

            // Handle scroll direction and visibility
            if (scrollYProgress.get() < 0.001) {
                setVisible(true);  // Always visible when near the top of the page
            } else {
                if (direction < 0) {
                    setVisible(true);  // Scrolling up, make visible
                } else {
                    setVisible(false);  // Scrolling down, make invisible
                }
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-lg z-[5000] pr-4 pl-8 py-2 items-center justify-center space-x-4 ${className}`}
            >
                {/* Navigation Links with Gradient Underline for Active Link */}
                {navItems.map((navItem, idx) => (
                    <Link
                        key={idx}
                        href={navItem.link}
                        className={`relative items-center flex space-x-1 text-sm ${pathname === navItem.link
                            ? "text-gray-800 dark:text-gray-200"
                            : "text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300"
                            }`}
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden sm:block">{navItem.name}</span>

                        {/* Gradient Line Under Active Link */}
                        {pathname === navItem.link && (
                            <span className="absolute inset-x-0 w-100 mx-auto -bottom-px bg-gradient-to-r from-primary via-orange-300 to-primary-foreground from-transparent  to-transparent h-px" />
                        )}
                    </Link>
                ))}

                {/* Authenticated User Button */}
                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "h-8 w-8",
                                userButton: "p-2 border border-neutral-200 dark:border-white/[0.2] rounded-full",
                            },
                        }}
                    />
                </SignedIn>

                {/* Sign-in Button for Unauthenticated Users */}
                <SignedOut>
                    <SignInButton>
                        <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
                            <span>Login</span>
                            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent h-px" />
                        </button>
                    </SignInButton>
                </SignedOut>
            </motion.div>
        </AnimatePresence>
    );
};
