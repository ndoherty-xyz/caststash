import React, { useCallback, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { neynarSearch } from "@/utils/neynar/utils/search";
import { useAuth } from "@/hooks/useAuth";
import GridLoader from "react-spinners/GridLoader";
import Link from "next/link";
import { Avatar } from "../users/avatar";

export const Search = (props: { fullWidth?: boolean }) => {
  const auth = useAuth();
  const [searchInput, _setSearchInput] = React.useState<string>("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState<string>("");

  const setSearchInputDebounced = useDebouncedCallback(
    // function
    (value) => {
      setDebouncedSearchInput(value);
    },
    // delay in ms
    1000
  );

  const setSearchInput = useCallback(
    (input: string) => {
      _setSearchInput(input);
      setSearchInputDebounced(input);
    },
    [_setSearchInput, setSearchInputDebounced]
  );

  const searchQuery = useQuery({
    queryKey: ["search", debouncedSearchInput],
    queryFn: async () => {
      const result = await neynarSearch({
        query: debouncedSearchInput,
        viewerFid: auth.state?.fid,
      });

      return result;
    },
  });

  const reset = useCallback(() => {
    setSearchInput("");
    setDebouncedSearchInput("");
  }, [setSearchInput, setDebouncedSearchInput]);

  const popoverContent = useMemo(() => {
    if (searchQuery.data?.channels.length || searchQuery.data?.users.length) {
      return (
        <div className="flex p-0 flex-col overflow-y-scroll max-h-64">
          {searchQuery.data.channels.length ? (
            <>
              <div className="py-2.5 pt-3.5 px-3.5 border-b border-stone-300/25 dark:border-stone-400/20">
                <p className="font-semibold">Channels</p>
              </div>
              {searchQuery.data.channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/feed/${channel.id}`}
                  onClick={reset}
                >
                  <div className="py-2.5 px-3.5 border-b border-stone-300/25 dark:border-stone-400/20 flex flex-row items-center gap-2">
                    <Avatar size="md" pfpUrl={channel.image_url} />
                    <p className="text-sm">#{channel.id}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : null}

          {searchQuery.data.users.length ? (
            <>
              <div className="py-2.5 px-3.5 pt-3.5 border-b border-stone-300/25 dark:border-stone-400/20">
                <p className="font-semibold">Users</p>
              </div>
              {searchQuery.data.users.map((user) => (
                <Link
                  key={user.username}
                  href={`/${user.username}`}
                  onClick={reset}
                >
                  <div className="py-2.5 px-3.5 border-b border-stone-300/25 dark:border-stone-400/20 flex flex-row items-center gap-2">
                    <Avatar size="md" pfpUrl={user.pfp_url} />
                    <p className="text-sm">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : null}
        </div>
      );
    } else if (!searchQuery.isLoading) {
      return (
        <div className="px-4 py-4 w-full flex justify-center items-center">
          <p className="text-xs font-semibold">No results!</p>
        </div>
      );
    } else {
      return (
        <div className="px-12 py-4 w-full flex justify-center items-center">
          <GridLoader color="#00000030" size={8} />
        </div>
      );
    }
  }, [searchQuery.data, searchQuery.isLoading, reset]);

  return (
    <Popover
      open={!!debouncedSearchInput}
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <PopoverTrigger asChild>
        <div className={`relative ${props.fullWidth ? "basis-full" : ""}`}>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-[34px] pt-2.5"
            placeholder="Search"
          />
          <div className="flex flex-col justify-center items-center absolute top-0 left-0 bottom-0 aspect-square">
            <SearchIcon size={16} color="#78716c" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" asChild>
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
};
