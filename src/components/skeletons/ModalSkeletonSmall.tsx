const ModalSkeletonSmall = () => (
	<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
		<div className="w-[31rem] bg-white rounded-lg p-6">
			<div className="animate-pulse space-y-4">
				<div className="h-6 bg-gray-200 rounded w-3/4"></div>
				<div className="space-y-3">
					<div className="h-4 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-5/6"></div>
				</div>
				<div className="flex justify-end space-x-2 pt-4">
					<div className="h-9 bg-gray-200 rounded w-16"></div>
					<div className="h-9 bg-gray-200 rounded w-20"></div>
				</div>
			</div>
		</div>
	</div>
);

export default ModalSkeletonSmall;