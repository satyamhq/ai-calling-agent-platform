import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ContactList } from "./components/contact-list";
import { NewContactDialog } from "./components/new-contact-dialog";

export default function ContactsPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <PageHeader 
        title="Contacts" 
        description="Manage your leads and customers"
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <NewContactDialog />
          </div>
        }
      />
      
      <ContactList />
    </div>
  );
}
