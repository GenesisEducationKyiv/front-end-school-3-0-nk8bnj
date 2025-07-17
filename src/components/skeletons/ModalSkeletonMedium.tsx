const ModalSkeletonMedium = () => (
	<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
		<div className=" w-[31rem] bg-white rounded-lg p-6">
			<div className="animate-pulse space-y-6">
				<div className="h-6 bg-gray-200 rounded w-2/3"></div>

				<div className="flex items-center space-x-3">
					<div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						<div className="h-3 bg-gray-200 rounded w-full"></div>
					</div>
				</div>

				<div className="flex justify-end space-x-3 pt-2">
					<div className="h-10 bg-gray-200 rounded w-24"></div>
					<div className="h-10 bg-gray-200 rounded w-28"></div>
				</div>
			</div>
		</div>
	</div>
);

export default ModalSkeletonMedium;