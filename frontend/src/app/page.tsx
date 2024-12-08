"use client";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
const page = () => {
    const router = useRouter();
    const words = [
        {
            text: "Build",
        },
        {
            text: "awesome",
        },
        {
            text: "Form",
        },
        {
            text: "with",
        },
        {
            text: "Trax.",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];
    return (
        <>
        <HeroHighlight>
            <div className="flex flex-col items-center justify-center h-[40rem]  ">
                    <TypewriterEffectSmooth words={words} />
                    <p>Best tool to build forms and manage them using AI </p>
                <div className="mt-12">
                        <Button onClick={() => router.push("/dashboard")} >
                            Get Started
                        </Button>


                            </div>

            </div>
        </HeroHighlight>
        </>
    );
}


export default page;
