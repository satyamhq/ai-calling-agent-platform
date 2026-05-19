import { PageHeader } from "@/components/shared/page-header";
import { AgentList } from "./components/agent-list";
import { NewAgentDialog } from "./components/new-agent-dialog";

export default function AgentsPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="AI Agents" 
        description="Manage your voice AI assistants"
        action={<NewAgentDialog />}
      />
      
      <AgentList />
    </div>
  );
}
