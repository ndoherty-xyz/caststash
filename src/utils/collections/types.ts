import { collections } from "../prisma";

export type CollectionReturn = collections & { object: "cast-collection" };
