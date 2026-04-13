import StarChart from "./StarChart";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function StarChartPage() {
  const [, navigate] = useLocation();
  return (
    <StarChart
      onComplete={(constellation) => {
        toast.success(`Constellation Mapped: ${constellation}`, {
          description: "+30 Dream, +20 XP. The Antiquarian nods approvingly.",
        });
        navigate("/ark");
      }}
      onClose={() => navigate("/ark")}
    />
  );
}
