"use client";

import { useAuth } from "@/hooks/useAuth";

import { createNewCollection } from "@/utils/collections/createNew";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export const NewCollectionModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const auth = useAuth();
  const queryClient = useQueryClient();
  const createNewCollectionMutation = useMutation({
    mutationKey: ["createNewCollection"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCollections", auth.state?.fid],
      });
    },
    mutationFn: async (args: { title: string; description?: string }) => {
      if (!auth.state) return;

      const newCollection = await createNewCollection({
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        title: args.title,
        description: args.description,
      });

      return newCollection;
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setTitle(""), setDescription("");
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="my-1 mr-3 ml-0">+ New</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <p className="font-semibold text-lg">New Collection</p>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="title-input" hidden>
                  Title
                </Label>
                <Input
                  id="title-input"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                  type="text"
                  placeholder="Title"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="description-input" hidden>
                  Description
                </Label>
                <Textarea
                  style={{
                    resize: "none",
                  }}
                  value={description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  draggable={false}
                  placeholder="Description"
                />
              </div>
            </div>
          </DialogDescription>
          <DialogFooter className="flex flex-row items-end">
            <Button
              disabled={!title}
              onClick={async () => {
                await createNewCollectionMutation.mutateAsync({
                  title,
                  description,
                });

                setTitle("");
                setDescription("");
                setOpen(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
