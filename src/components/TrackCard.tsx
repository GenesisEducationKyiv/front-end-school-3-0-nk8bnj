import { Track } from "@/types/schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UploadCloud, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";
import useTracksStore from "@/store/useTracksStore";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

interface TrackCardProps {
  track: Track;
}

const TrackCard = memo(({ track }: TrackCardProps) => {
  const openEditModal = useTracksStore((state) => state.openEditModal);
  const openDeleteModal = useTracksStore((state) => state.openDeleteModal);
  const openUploadModal = useTracksStore((state) => state.openUploadModal);
  const currentlyPlaying = useTracksStore((state) => state.currentlyPlaying);
  const setCurrentlyPlaying = useTracksStore((state) => state.setCurrentlyPlaying);
  const toggleTrackSelection = useTracksStore((state) => state.toggleTrackSelection);
  const selectedTrackIds = useTracksStore((state) => state.selectedTrackIds);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isSelected = selectedTrackIds.includes(track.id);

  useEffect(() => {
    if (currentlyPlaying !== track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentlyPlaying, track.id, isPlaying]);

  const handlePlayPause = () => {
    if (!track.audioFile) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying && currentlyPlaying !== track.id) {
        const audioElements = document.querySelectorAll("audio");
        audioElements.forEach((audio) => audio.pause());
      }

      void audioRef.current?.play();
      setIsPlaying(true);
      setCurrentlyPlaying(track.id);
    }
  };

  return (
    <Card
      className="bg-card hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col relative"
      data-testid={`track-item-${track.id}`}
    >
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleTrackSelection(track.id)}
          className="bg-white/70 hover:bg-white/90"
          data-testid={`track-checkbox-${track.id}`}
        />
      </div>

      <CardHeader className="p-0 relative aspect-square overflow-hidden">
        {track.coverImage ? (
          <Image
            src={track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover"
            width={300}
            height={300}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No cover image</p>
          </div>
        )}
        {track.audioFile && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-3 right-3 rounded-full bg-white/60 hover:bg-white/40"
            onClick={handlePlayPause}
            data-testid={
              isPlaying ? `pause-button-${track.id}` : `play-button-${track.id}`
            }
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between p-4">
        <div>
          <h3
            className="font-semibold text-lg truncate"
            data-testid={`track-item-${track.id}-title`}
          >
            {track.title}
          </h3>
          <p
            className="text-muted-foreground truncate"
            data-testid={`track-item-${track.id}-artist`}
          >
            {track.artist}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {track.album}
          </p>

          <div className="flex flex-wrap gap-1 mt-2">
            {track.genres.map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {track.audioFile && (
          <audio
            ref={audioRef}
            src={`http://localhost:8000/api/files/${track.audioFile}`}
            className="audio-player w-full mt-4"
            controls={isPlaying}
            preload="none" // Don't preload audio until needed
            onEnded={() => {
              setIsPlaying(false);
              setCurrentlyPlaying(null);
            }}
            data-testid={`audio-player-${track.id}`}
          />
        )}
      </CardContent>

      <CardFooter className="border-t border-border p-4 pt-3 gap-2 flex justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openEditModal(track)}
          data-testid={`edit-track-${track.id}`}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => openUploadModal(track)}
            title={track.audioFile ? "Replace audio file" : "Upload audio file"}
            data-testid={`upload-track-${track.id}`}
          >
            <UploadCloud className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => openDeleteModal(track)}
            data-testid={`delete-track-${track.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

TrackCard.displayName = 'TrackCard';

export default TrackCard;
