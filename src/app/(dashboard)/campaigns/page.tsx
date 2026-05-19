import { PageHeader } from "@/components/shared/page-header";
import { CampaignList } from "./components/campaign-list";
import { NewCampaignDialog } from "./components/new-campaign-dialog";

export default function CampaignsPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="Campaigns" 
        description="Manage bulk outbound calling campaigns"
        action={<NewCampaignDialog />}
      />
      
      <CampaignList />
    </div>
  );
}
