import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

const page = () => {
  return (
    <HeroHighlight
      className="text-xl text-center"
      containerClassName="bg-gradient-to-r min-h-full"
    >
      <h1 className="text-5xl mb-6">
        Welcome to the {}
        <Highlight className="text-5xl">FeedBack Management System</Highlight>
      </h1>
      <p>
        help you make effortless <Highlight>Forms</Highlight> and
        <Highlight>Analyze</Highlight> them with ease.
      </p>
    </HeroHighlight>
  );
};

export default page;
