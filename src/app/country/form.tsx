"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import setCountryAction from "@/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  country: z.string().min(2).max(10),
});

export default function CountryForm() {
  const router = useRouter();
  const localeInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
    },
  });

  const { country } = form.getValues();

  const {
    mutate: setCountry,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async () => await setCountryAction({ country }),
  });

  const Submit = isSuccess ? (
    <Check className="text-neutral-500" />
  ) : isError ? (
    "Error"
  ) : isPending ? (
    <Loader className="animate-spin text-neutral-500" />
  ) : (
    "Submit"
  );

  function onSubmit() {
    setCountry();
  }

  useEffect(() => {
    if (!isSuccess) return;
    router.push("/dashboard/onboarding");
  }, [isSuccess, router]);

  return (
    <div className="h-screen flex flex-col items-start justify-center w-full max-w-96 mx-auto space-y-4">
      <p>Set your country of residency</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const countryData = STRIPE_COUNTRY_LOCALES.get(value);
                      const locale = countryData ? countryData.locale : "";
                      field.onChange(locale);
                      if (!localeInputRef.current) return;
                      localeInputRef.current.value = locale;
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(STRIPE_COUNTRY_LOCALES.keys())
                        .sort((a, b) =>
                          a.split(" ")[1].localeCompare(b.split(" ")[1])
                        )
                        .map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  It will be used for payment processing
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <input type="hidden" ref={localeInputRef} name="stripeLocale" />
          <Button type="submit">{Submit}</Button>
        </form>
      </Form>
    </div>
  );
}

const STRIPE_COUNTRY_LOCALES = new Map([
  ["🇦🇺 Australia", { locale: "AU" }],
  ["🇦🇹 Austria", { locale: "AT" }],
  ["🇧🇪 Belgium", { locale: "BE" }],
  ["🇧🇬 Bulgaria", { locale: "BG" }],
  ["🇨🇦 Canada", { locale: "CA" }],
  ["🇪🇸 Spain", { locale: "ES" }],
  ["🇨🇾 Cyprus", { locale: "CY" }],
  ["🇨🇿 Czech Republic", { locale: "CZ" }],
  ["🇩🇰 Denmark", { locale: "DK" }],
  ["🇪🇪 Estonia", { locale: "EE" }],
  ["🇫🇮 Finland", { locale: "FI" }],
  ["🇫🇷 France", { locale: "FR" }],
  ["🇩🇪 Germany", { locale: "DE" }],
  ["🇬🇷 Greece", { locale: "GR" }],
  ["🇭🇰 Hong Kong", { locale: "HK" }],
  ["🇭🇺 Hungary", { locale: "HU" }],
  ["🇮🇪 Ireland", { locale: "IE" }],
  ["🇮🇹 Italy", { locale: "IT" }],
  ["🇱🇻 Latvia", { locale: "LV" }],
  ["🇱🇹 Lithuania", { locale: "LT" }],
  ["🇲🇹 Malta", { locale: "MT" }],
  ["🇲🇽 Mexico", { locale: "MX" }],
  ["🇳🇱 Netherlands", { locale: "NL" }],
  ["🇳🇿 New Zealand", { locale: "NZ" }],
  ["🇳🇴 Norway", { locale: "NO" }],
  ["🇺🇸 United States", { locale: "US" }],
]);
