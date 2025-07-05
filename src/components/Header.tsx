"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Music, Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { O } from "@mobily/ts-belt";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useTracksStore from "@/store/useTracksStore";
import { useGenresQuery } from "@/hooks/useTracksQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { SortValue } from "@/types/types";

const Header = memo(() => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const openCreateModal = useTracksStore((state) => state.openCreateModal);

	const getParam = (key: string) => O.fromNullable(searchParams.get(key));
	const initialSearch = useMemo(() => O.getWithDefault(getParam("search"), ""), []);

	const [searchTerm, setSearchTerm] = useState(initialSearch);
	const debouncedSearch = useDebounce(searchTerm, 500);

	const { data: genres = [] } = useGenresQuery();

	const updateQueryParams = useCallback((params: Record<string, string>) => {
		const newParams = new URLSearchParams(searchParams.toString());

		Object.entries(params).forEach(([key, value]) => {
			const isDefaultValue = !value || value === "all" || (key === "sort" && value === "title-asc");

			if (isDefaultValue) {
				newParams.delete(key);
			} else {
				newParams.set(key, value);
			}
		});

		const page = newParams.get("page");
		if (page === "1") {
			newParams.delete("page");
		}

		const newParamsString = newParams.toString() ? `?${newParams.toString()}` : "";
		const newUrl = `${window.location.pathname}${newParamsString}`;

		router.push(newUrl);
	}, [searchParams, router]);

	useEffect(() => {
		updateQueryParams({ search: debouncedSearch });
	}, [debouncedSearch, updateQueryParams]);

	const handleSortChange = useCallback((value: SortValue) => {
		updateQueryParams({ sort: value, page: "1" });
	}, [updateQueryParams]);

	const handleGenreChange = useCallback((value: string) => {
		updateQueryParams({ genre: value, page: "1" });
	}, [updateQueryParams]);

	const clearFilters = useCallback(() => {
		setSearchTerm("");
		updateQueryParams({
			search: "",
			genre: "all",
			sort: "title-asc",
			page: "1",
		});
	}, [updateQueryParams]);

	const hasActiveFilters =
		O.isSome(getParam("search")) ||
		O.getWithDefault(O.map(getParam("genre"), genre => genre !== "all"), false) ||
		O.getWithDefault(O.map(getParam("sort"), sort => sort !== "title-asc"), false);

	return (
		<>
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
				<h1
					className="text-3xl font-bold flex items-center"
					data-testid="tracks-header"
				>
					<Music className="mr-2 h-8 w-8" /> Track Manager
				</h1>

				<div className="flex items-center gap-2">
					<Button onClick={openCreateModal} data-testid="create-track-button">
						<Plus className="mr-2 h-4 w-4" /> Create Track
					</Button>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
				<div className="relative w-full md:w-auto flex-grow">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search tracks..."
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						data-testid="search-input"
					/>
				</div>

				<div className="flex gap-4 w-full md:w-auto flex-wrap">
					<Select
						value={O.getWithDefault(getParam("sort"), "title-asc")}
						onValueChange={handleSortChange}
					>
						<SelectTrigger
							className="w-full md:w-[180px]"
							data-testid="sort-select"
						>
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="title-asc">Title (A-Z)</SelectItem>
							<SelectItem value="title-desc">Title (Z-A)</SelectItem>
							<SelectItem value="artist-asc">Artist (A-Z)</SelectItem>
							<SelectItem value="artist-desc">Artist (Z-A)</SelectItem>
							<SelectItem value="createdAt-desc">Newest First</SelectItem>
							<SelectItem value="createdAt-asc">Oldest First</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={O.getWithDefault(getParam("genre"), "all")}
						onValueChange={handleGenreChange}
					>
						<SelectTrigger
							className="w-full md:w-[180px]"
							data-testid="filter-genre"
						>
							<SelectValue placeholder="Filter by genre" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Genres</SelectItem>
							{genres.map((genre: string) => (
								<SelectItem key={genre} value={genre}>
									{genre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{hasActiveFilters && (
						<Button
							variant="outline"
							size="icon"
							onClick={clearFilters}
							className="md:w-[40px] h-10"
							data-testid="clear-filters"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</>
	);
});

Header.displayName = 'Header';

export default Header;