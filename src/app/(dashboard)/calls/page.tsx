import { PageHeader } from "@/components/shared/page-header";
import { CallList } from "./components/call-list";
import { NewCallDialog } from "./components/new-call-dialog";

export default function CallsPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="Call Log" 
        description="View and analyze all your past AI calls"
        action={<NewCallDialog />}
      />
      
      <CallList />
    </div>
  );
}
