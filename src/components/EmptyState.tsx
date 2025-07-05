import React from "react";
import { Music, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateTrack: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters, onCreateTrack }) => {
  return (
    <div className="text-center py-16 bg-card rounded-lg">
      <Music className="h-12 w-12 mx-auto text-muted-foreground" />
      <h2 className="mt-4 text-xl font-medium">No tracks found</h2>
      <p className="mt-2 text-muted-foreground">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Add your first track to get started"}
      </p>
      <Button
        className="mt-4"
        onClick={onCreateTrack}
        data-testid="create-track-button"
      >
        <Plus className="mr-2 h-4 w-4" /> Create Track
      </Button>
    </div>
  );
};

export default EmptyState; 