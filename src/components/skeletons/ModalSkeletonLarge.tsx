const ModalSkeletonLarge = () => (
	<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
		<div className="bg-white rounded-lg p-6 w-full max-w-md">
			<div className="animate-pulse space-y-6">
				<div className="h-6 bg-gray-200 rounded w-1/2"></div>

				<div className="space-y-4">
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-16"></div>
						<div className="h-10 bg-gray-200 rounded w-full"></div>
					</div>

					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-12"></div>
						<div className="h-10 bg-gray-200 rounded w-full"></div>
					</div>

					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-14"></div>
						<div className="h-10 bg-gray-200 rounded w-full"></div>
					</div>

					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-24"></div>
						<div className="h-10 bg-gray-200 rounded w-full"></div>
					</div>

					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-16"></div>
						<div className="h-10 bg-gray-200 rounded w-full"></div>
						<div className="h-4 bg-gray-200 rounded w-32"></div>
					</div>
				</div>

				<div className="flex justify-end space-x-2 pt-4">
					<div className="h-9 bg-gray-200 rounded w-16"></div>
					<div className="h-9 bg-gray-200 rounded w-24"></div>
				</div>
			</div>
		</div>
	</div>
);

export default ModalSkeletonLarge;