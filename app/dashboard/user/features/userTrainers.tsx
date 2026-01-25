import { MessageSquare, Star, User } from "lucide-react";

export function UserTrainer() {
  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60"
            alt="trainer"
            className="w-16 h-16 rounded-full object-cover"
          />
          <h3 className="text-lg mt-3 font-semibold">My Personal Trainer</h3>
          <div className="mt-1">
            <div className="text-sm font-medium">Michael Johnson</div>
            <div className="text-xs text-gray-500">
              Certified Strength & Conditioning Specialist
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} />
                <span className="font-semibold">4.8 rating</span>
              </div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-500">8 years Experience</div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>95 clients</span>
              </div>
              <div className="text-gray-300">•</div>
              <div>7 years experience</div>
            </div>
          </div>
        </div>

        {/* Next session box */}
        <div className="sm:w-[260px] w-full rounded-lg px-5 py-6 text-center bg-linear-to-br from-primary to-green-700 text-white">
          <div className="text-sm opacity-90">Next Session</div>
          <div className="text-2xl font-semibold mt-1 text-bold">
            Tomorrow 4:00 PM
          </div>
          <div className="text-xs mt-3">Upper Body Focus</div>
        </div>
      </div>
      {/* <div className="mt-6 flex flex-wrap items-center gap-4"> */}
      <div className="mt-6 flex flex-wrap items-center justify-center align-middle">
        <div className="mt-1 grid sm:grid-cols-2 grid-cols-1 gap-5 w-full  sm:w-92">
          <button className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:brightness-95">
            Book New Session
          </button>
          <button className="border border-emerald-400 text-emerald-600 px-5 py-2 rounded-md font-semibold">
            Message Trainer
          </button>
        </div>
        <button className="ml-auto hidden lg:inline-flex items-center gap-2 text-sm text-gray-500 px-3 py-2 rounded-md border border-gray-200">
          <MessageSquare size={16} />
          Contact
        </button>
      </div>
    </>
  );
}
