import MealPlanCard from "@/components/cards/MealPlanCard";

export default function MealPlan() {
  return (
    <>
      <MealPlanCard
        category="Meal Plan"
        title="12 Weeks Strength and Conditioning"
        uploadedBy="Micheal Johnson"
        uploadedAt="September 23, 2025 13:50"
        downloadUrl="/plans/meal-plan.pdf"
      />

      <MealPlanCard
        category="Workout Plan"
        title="7 Days Fat Loss & Muscle Plan"
        uploadedBy="Micheal Johnson"
        uploadedAt="September 23, 2025 13:50"
        downloadUrl="/plans/workout-plan.pdf"
      />
    </>
  );
}
