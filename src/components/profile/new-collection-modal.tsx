"use client";

import { useAuth } from "@/hooks/useAuth";

import {
  createNewCollection,
  deleteCollection,
  updateCollection,
} from "@/utils/collections/crud";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
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
import { collections } from "@/utils/prisma";
import { Edit, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { AlertDialogOverlay } from "@radix-ui/react-alert-dialog";

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

export const EditCollectionModal = (props: { collection: collections }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.collection.title);
  const [description, setDescription] = useState<string>(
    props.collection.description
  );

  useEffect(() => {
    setTitle(props.collection.title);
    setDescription(props.collection.description);
  }, [props.collection]);

  const auth = useAuth();
  const queryClient = useQueryClient();
  const editCollectionMutation = useMutation({
    mutationKey: ["createNewCollection"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCollections", auth.state?.fid],
      });
    },
    mutationFn: async (args: { title: string; description?: string }) => {
      if (!auth.state) return;

      const newCollection = await updateCollection({
        collectionId: props.collection.id,
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
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <p className="font-semibold text-lg">Edit Collection</p>
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
                await editCollectionMutation.mutateAsync({
                  title,
                  description,
                });

                setOpen(false);
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export const DeleteCollectionModal = (props: {
  collection: collections;
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const auth = useAuth();
  const queryClient = useQueryClient();
  const deleteCollectionMutation = useMutation({
    mutationKey: ["createNewCollection"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCollections", auth.state?.fid],
      });
      props.onSuccess();
    },
    mutationFn: async (args: { collectionId: string }) => {
      if (!auth.state) return;

      const newCollection = await deleteCollection({
        collectionId: args.collectionId,
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
      });

      return newCollection;
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-red-100">
          <Trash color="red" size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-row items-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteCollectionMutation.mutateAsync({
                  collectionId: props.collection.id,
                });

                setOpen(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};
