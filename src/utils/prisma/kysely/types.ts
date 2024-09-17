import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type collections = {
    id: Generated<string>;
    title: string;
    description: string;
    ownerFid: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type saved_casts = {
    id: Generated<string>;
    castHash: string;
    ownerFid: number;
    collectionsId: string;
};
export type DB = {
    collections: collections;
    saved_casts: saved_casts;
};
