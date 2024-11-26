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
import { deleteSamplePackAction, updateSamplePackAction } from "@/lib/actions";
import { urlNameToTitle } from "@/lib/utils";
import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";

const editPackSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(5).max(100).optional(),
  price: z.number().min(0),
});

type EditPackSchema = z.infer<typeof editPackSchema>;

export default function EditPackButton({
  userName,
  samplePackName: name,
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
      title: urlNameToTitle(name),
      description,
      price,
    },
  });

  const {
    title: newTitle,
    description: newDescription,
    price: newPrice,
  } = form.getValues();

  const { mutate: deleteSamplePack } = useMutation({
    mutationFn: async () => {
      await deleteSamplePackAction({ samplePackName: name, userName });
    },
    onSuccess: () => router.push(`/${userName}`),
  });

  const { mutate: updateSamplePack, data: newSamplePackName } = useMutation({
    mutationFn: async () =>
      await updateSamplePackAction({
        name,
        userName,
        title: newTitle,
        description: newDescription,
        price: newPrice,
        samplePackName: name,
      }),
  });

  useEffect(() => {
    if (!newSamplePackName) {
      return;
    }

    router.push(`/${userName}/${newSamplePackName}`);
  }, [newSamplePackName, router, userName]);

  function onSubmit() {
    updateSamplePack();
  }

  return isOwner ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="cursor-pointer hover:scale-110 active:scale-90 active:text-neutral-300 mt-2"
      >
        <EllipsisVertical size={20} />
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
            <div className="flex justify-between items-center pt-8 flex-col w-full gap-2">
              <Button type="submit" className="w-full">
                Submit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  className={
                    buttonVariants({ variant: "destructive" }) + " w-full"
                  }
                >
                  Delete
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
