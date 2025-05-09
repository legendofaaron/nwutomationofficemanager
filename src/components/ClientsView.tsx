
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, Search, Plus, Calendar, ArrowRight } from 'lucide-react';
import { DragDropProvider } from './schedule/DragDropContext';
import DraggableClientCard from './clients/DraggableClientCard';
import { Client } from './schedule/ScheduleTypes';

// Client form interface that matches the Client type from ScheduleTypes
interface ClientFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'active' | 'inactive' | 'pending';
  tags?: string[];
  active?: boolean; // Added to match the updated Client type
}

const ClientsView = React.memo(() => {
  const { clients, setClients } = useAppContext();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    status: 'active',
    tags: [],
    active: true // Initialize with true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients || []);

  // Update filtered clients when clients change or search query changes
  useEffect(() => {
    if (!clients) return;
    
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.phone && client.phone.includes(searchQuery))
    );
    
    setFilteredClients(filtered);
  }, [clients, searchQuery]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding a new client
  const handleAddClient = () => {
    if (formData.name) {
      const newClient: Client = {
        ...formData,
        id: Date.now().toString(),
        active: true // Ensure the active property is set
      };
      
      setClients([...(clients || []), newClient]);
      setIsAddClientOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        status: 'active',
        tags: [],
        active: true // Reset with default value
      });
    }
  };

  return (
    <DragDropProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Clients</h2>
            <p className="text-muted-foreground mt-1">
              Manage your clients and their details
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsAddClientOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search clients..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-card font-normal border px-3 py-1 h-9">
              <span className="font-semibold mr-1">{filteredClients.length}</span> clients
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Client List</h3>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Drag clients to calendar</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <DraggableClientCard key={client.id} client={client} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-center">
                <div className="p-3 bg-muted rounded-full mb-3">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg">No clients found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? 'Try adjusting your search query' : 'Start by adding your first client'}
                </p>
                {!searchQuery && (
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddClientOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Client Dialog */}
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Client Name</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter client name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">State</label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zip" className="text-sm font-medium">Zip</label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="Zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClient}>
                  Add Client
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DragDropProvider>
  );
});

export default ClientsView;
