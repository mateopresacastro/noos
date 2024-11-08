"use client";

import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  deleteSamplePackAction,
  updateSamplePackAction,
} from "@/lib/db/actions";
import { urlNameToTitle } from "@/lib/utils";
import { useEffect, useState } from "react";

// TODO: handle image upload
const editPackSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(5).max(100).optional(),
  price: z.number().min(0),
});

type EditPackSchema = z.infer<typeof editPackSchema>;

export default function EditPackButton({
  userName,
  samplePackName,
  description,
  price,
}: {
  userName: string;
  samplePackName: string;
  price: number;
  description?: string;
}) {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const isOwner = userName === user.user?.username;
  const router = useRouter();
  const form = useForm<EditPackSchema>({
    resolver: zodResolver(editPackSchema),
    defaultValues: {
      title: urlNameToTitle(samplePackName),
      description,
      price,
    },
  });

  const {
    title: newTitle,
    description: newDescription,
    price: newPrice,
  } = form.getValues();

  // TODO handle loading and error state
  const { mutate: deleteSamplePack } = useMutation({
    mutationFn: async () => {
      await deleteSamplePackAction({ samplePackName, userName });
    },
    onSuccess: () => router.push(`/${userName}`),
  });

  const { mutate: updateSamplePack, data: newSamplePackName } = useMutation({
    mutationFn: async () => {
      const res = await updateSamplePackAction({
        samplePackName,
        userName,
        title: newTitle,
        description: newDescription,
        price: newPrice,
      });
      console.log("res", res);
      return res;
    },
  });

  useEffect(() => {
    if (!newSamplePackName) {
      return;
    }

    router.push(`/${userName}/${newSamplePackName}`);
  }, [newSamplePackName, router, samplePackName, userName]);

  function onSubmit() {
    // TODO check that user actually changed values
    updateSamplePack();
  }

  return isOwner ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-medium w-full" variant="secondary" size="lg">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-1">
          <DialogTitle>Edit sample pack</DialogTitle>
          <DialogDescription>
            If you want to change the samples delete this pack and create a new
            one.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full pt-8 overflow-y-scroll px-1"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center pt-8">
              <Button type="submit">Submit</Button>
              <AlertDialog>
                <AlertDialogTrigger
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Delete Sample Pack
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the sample pack your account and remove your data from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonVariants({ variant: "destructive" })}
                      onClick={() => deleteSamplePack()}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  ) : null;
}
