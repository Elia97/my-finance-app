import { InvestmentsHeader } from "@/components/investments-header";
import { InvestmentsOverview } from "@/components/investments-overview";

export default function InvestmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <InvestmentsHeader />
      <div className="grid gap-6 xl:grid-cols-2">
        <InvestmentsOverview />
      </div>
    </div>
  );
}
