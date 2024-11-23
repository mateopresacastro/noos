"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { subscribeToBetaAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Email is invalid",
  }),
});

const SUB_TO_BETA_KEY = "subscribed-to-beta";

export function EmailForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // to avoid hydration error with localStorage
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useLocalStorage(
    SUB_TO_BETA_KEY,
    false
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { email } = form.getValues();

  const {
    mutate: subscribe,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async () => await subscribeToBetaAction({ email }),
    onSuccess: () => {
      router.push("/");
      setIsAlreadySubscribed(true);
    },
  });

  function onSubmit() {
    subscribe();
  }

  const Submit = isSuccess
    ? "Thanks!"
    : isError
    ? "Error"
    : isPending
    ? "..."
    : "Submit";

  if (!mounted) return null;

  return isAlreadySubscribed ? (
    <div>You are already subscribed to the beta!</div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Noos is in closed beta. Sign up to get early access.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{Submit}</Button>
      </form>
    </Form>
  );
}
