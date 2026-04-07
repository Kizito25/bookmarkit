import { Tables } from "./supabase";

export type Bookmark = Tables<'bookmarks'> & {
    tags: Pick<Tables<'tags'>, 'id' | 'name'>[];
};

export type Tag = Tables<'tags'>;

export type DataRequest = Tables<'data_requests'>;
