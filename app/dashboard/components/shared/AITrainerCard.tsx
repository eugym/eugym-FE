import Image from "next/image";
import aiTrainer from "@/public/asset/aiTrainer.png";

interface AITrainerCardProps {
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  workout?: string;
}

const DIFFICULTY_COLORS = {
  Beginner:     "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced:     "bg-rose-50 text-rose-700",
};

export default function AITrainerCard({
  difficulty = "Beginner",
  workout = "20-minute full body HIIT workout",
}: AITrainerCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-sky-50 shrink-0">
          <Image src={aiTrainer} alt="AI Trainer" className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">A.I Trainer</h4>
          <p className="text-sm text-gray-500 mt-1">Recommended for today</p>
          <p className="text-sm text-gray-700 mt-1 font-medium">{workout}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[difficulty]}`}>
          {difficulty}
        </span>
        <button className="border border-emerald-400 text-emerald-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors">
          Start Workout
        </button>
      </div>
    </div>
  );
}
