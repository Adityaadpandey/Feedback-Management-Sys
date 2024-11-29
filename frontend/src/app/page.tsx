import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

const page = () => {
  return (
    <HeroHighlight
      className="text-xl text-center"
      containerClassName="bg-gradient-to-r min-h-[720px]"
    >
      <h1>
        Welcome to the
        <Highlight className="text-xl">Hero Section!</Highlight>
      </h1>
      <p>
        This section has a dynamic hover effect, and you can{" "}
        <Highlight>
          highlight
        </Highlight> specific text.
      </p>
    </HeroHighlight>
  );
};

export default page;
