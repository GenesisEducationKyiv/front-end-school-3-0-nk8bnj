import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateTrackButtonProps {
	onClick: () => void;
	className?: string;
	children?: React.ReactNode;
	disabled?: boolean;
}

const CreateTrackButton = ({ onClick, className, children = "Create Track", disabled }: CreateTrackButtonProps) => {
	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg px-6 py-3 flex items-center gap-2 transition-colors",
				className
			)}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="text-white"
			>
				<path
					d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
					fill="currentColor"
				/>
			</svg>
			{children}
		</Button>
	);
};

export default CreateTrackButton; 