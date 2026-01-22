export function AITrainer() {
  return (
    <div className="bg-white rounded-xl p-6  border border-gray-100 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="rounded-full p-2 bg-sky-50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C13.1 2 14 2.9 14 4V7H10V4C10 2.9 10.9 2 12 2Z"
              fill="#60A5FA"
            />
            <path
              d="M6 10V9C6 6.79086 7.79086 5 10 5H14C16.2091 5 18 6.79086 18 9V10"
              fill="#93C5FD"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">A.I Trainer</h4>
          <p className="text-sm text-gray-600 mt-2">Recommended for today</p>
          <p className="text-sm text-gray-500">
            20-minute full body HIIT workout
          </p>

          <div className="mt-4">
            <span className="text-sm text-emerald-600 font-medium">
              Beginner
            </span>
            <div className="mt-4">
              <button className="w-full border border-emerald-400 text-emerald-600 py-2 rounded-md font-semibold hover:bg-emerald-50">
                Start Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
