import { useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

/**
 * A debounced version of search
 */
export const useSearch = () => {
    const [search, setSearch] = useState<string>();
    const debouncedSearch = useDebounce<string | undefined>(search, 200);

    return [debouncedSearch, setSearch] as const
}