import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Option = {
  title: string;
  price: number;
  subtitle: string;
  bullets: string[];
  highlighted: boolean;
};

const OPTIONS: Option[] = [
  {
    title: "Starter",
    price: 0,
    subtitle: "To start",
    bullets: ["Up to 3 sample packs", "500MB per pack", "20% fee on each sale"],
    highlighted: false,
  },
  {
    title: "Pro",
    price: 35,
    subtitle: "For profesionals",
    bullets: [
      "Unlimited sample packs",
      "5GB per pack (for stems)",
      "No extra fees",
    ],
    highlighted: true,
  },
  {
    title: "Basic",
    price: 20,
    subtitle: "Best value",
    bullets: ["Up to 20 sample packs", "1GB per pack", "No extra fees"],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="flex flex-col items-center justify-start pt-28">
      <h4 className="text-5xl tracking-tight">Pricing</h4>
      <p className="pt-6 w-96 text-center text-lg text-neutral-300 pb-14 md:max-w-xl md:w-full">
        Start selling samples without paying a subscription. Upgrade to enable
        unlimited packs and additional features.
      </p>
      <div className="gap-10 pb-32 flex flex-grow flex-wrap justify-center items-center">
        {OPTIONS.map((option) => (
          <Option option={option} key={option.title} />
        ))}
      </div>
    </div>
  );
}

function Option({
  option: { highlighted, price, subtitle, title, bullets },
}: {
  option: Option;
}) {
  return (
    <div
      className={cn(
        "w-96 border border-neutral-800 p-6 text-neutral-400 rounded-lg bg-neutral-900 md:w-80",
        highlighted && "bg-gradient-to-b from-neutral-600 to-neutral-800"
      )}
    >
      <div className="text-neutral-50">{title}</div>
      <div
        className={cn(
          "pt-1 text-lg font-medium",
          highlighted && "text-neutral-200"
        )}
      >
        ${price} {price === 0 ? "" : "per month"}
      </div>
      <div className={cn("text-sm py-6", highlighted && "text-neutral-200")}>
        {subtitle}
      </div>
      <Separator className={cn(highlighted && "dark:bg-neutral-500")} />
      {bullets.map((bullet) => (
        <div
          key={bullet}
          className={cn(
            "flex items-baseline text-sm space-y-6",
            highlighted && "text-neutral-200"
          )}
        >
          <Check
            className={cn(
              "size-3 text-neutral-600",
              highlighted && "text-neutral-200"
            )}
          />
          <p className="pl-3">{bullet}</p>
        </div>
      ))}
      <Button variant={highlighted ? "default" : "secondary"} className="mt-12">
        Get started
      </Button>
    </div>
  );
}
