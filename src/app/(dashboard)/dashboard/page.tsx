import { PageHeader } from "@/components/shared/page-header";
import { CreditsBanner } from "@/components/dashboard/credits-banner";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentCalls } from "@/components/dashboard/recent-calls";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your AI calling campaigns"
        action={
          <Button>
            <PhoneCall className="w-4 h-4 mr-2" />
            Start a Call
          </Button>
        }
      />
      
      <CreditsBanner />
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-4">
          <ActivityChart />
        </div>
        <div className="lg:col-span-3">
          <RecentCalls />
        </div>
      </div>
    </div>
  );
}
