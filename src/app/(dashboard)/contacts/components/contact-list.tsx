"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string | null;
  company: string | null;
  created_at: string;
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contacts");
        if (res.ok) {
          const data = await res.json();
          setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_number.includes(search)
  );

  if (loading) {
    return <Card className="animate-pulse bg-muted/50 h-[400px] border-none" />;
  }

  if (contacts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/50 p-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl mb-2">No contacts yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
          Upload a CSV or add contacts manually to start making calls.
        </p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 max-w-sm px-2"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.first_name} {contact.last_name}</TableCell>
                  <TableCell>{contact.phone_number}</TableCell>
                  <TableCell>{contact.email || "-"}</TableCell>
                  <TableCell>{contact.company || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
