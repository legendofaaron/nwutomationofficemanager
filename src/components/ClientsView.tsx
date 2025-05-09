
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Building, MapPin, Plus, Edit, Trash2, Mail, Phone, User, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ClientsView = () => {
  const { clients, setClients, clientLocations, setClientLocations } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    notes: ''
  });
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isPrimary: false
  });

  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [editLocationId, setEditLocationId] = useState<string | null>(null);

  // Filter clients based on search
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get locations for the selected client
  const clientLocationsList = clientLocations.filter(
    location => selectedClient && location.clientId === selectedClient
  );

  // Handle add/edit client
  const handleSaveClient = () => {
    if (!newClient.name) {
      toast.error("Client name is required");
      return;
    }

    if (isEditMode && editClientId) {
      // Edit existing client
      setClients(clients.map(client => 
        client.id === editClientId 
          ? { 
              ...client, 
              name: newClient.name,
              email: newClient.email,
              phone: newClient.phone,
              address: newClient.address,
              contactPerson: newClient.contactPerson,
              notes: newClient.notes
            } 
          : client
      ));
      toast.success("Client updated successfully");
    } else {
      // Add new client
      const newClientData = {
        id: Date.now().toString(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        contactPerson: newClient.contactPerson,
        notes: newClient.notes,
        active: true
      };
      setClients([...clients, newClientData]);
      toast.success("Client added successfully");
    }
    
    resetClientForm();
    setIsAddClientDialogOpen(false);
  };

  // Handle add/edit location
  const handleSaveLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      toast.error("Location name and address are required");
      return;
    }

    if (!selectedClient) {
      toast.error("No client selected");
      return;
    }

    if (isEditMode && editLocationId) {
      // Edit existing location
      setClientLocations(clientLocations.map(location => 
        location.id === editLocationId 
          ? { 
              ...location, 
              name: newLocation.name,
              address: newLocation.address,
              city: newLocation.city,
              state: newLocation.state,
              zipCode: newLocation.zipCode,
              isPrimary: newLocation.isPrimary
            } 
          : location
      ));
      toast.success("Location updated successfully");
    } else {
      // Add new location
      const newLocationData = {
        id: Date.now().toString(),
        clientId: selectedClient,
        name: newLocation.name,
        address: newLocation.address,
        city: newLocation.city,
        state: newLocation.state,
        zipCode: newLocation.zipCode,
        isPrimary: newLocation.isPrimary
      };
      
      // If setting this as primary, update other locations
      let updatedLocations = [...clientLocations];
      if (newLocation.isPrimary) {
        updatedLocations = updatedLocations.map(loc => 
          loc.clientId === selectedClient ? { ...loc, isPrimary: false } : loc
        );
      }
      
      setClientLocations([...updatedLocations, newLocationData]);
      toast.success("Location added successfully");
    }
    
    resetLocationForm();
    setIsAddLocationDialogOpen(false);
  };

  // Handle delete client
  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
    // Also delete all associated locations
    setClientLocations(clientLocations.filter(location => location.clientId !== clientId));
    if (selectedClient === clientId) {
      setSelectedClient(null);
    }
    toast.success("Client deleted successfully");
  };

  // Handle delete location
  const handleDeleteLocation = (locationId: string) => {
    setClientLocations(clientLocations.filter(location => location.id !== locationId));
    toast.success("Location deleted successfully");
  };

  // Edit client
  const handleEditClient = (client: typeof clients[0]) => {
    setNewClient({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      contactPerson: client.contactPerson || '',
      notes: client.notes || ''
    });
    setEditClientId(client.id);
    setIsEditMode(true);
    setIsAddClientDialogOpen(true);
  };

  // Edit location
  const handleEditLocation = (location: typeof clientLocations[0]) => {
    setNewLocation({
      name: location.name,
      address: location.address,
      city: location.city || '',
      state: location.state || '',
      zipCode: location.zipCode || '',
      isPrimary: location.isPrimary || false
    });
    setEditLocationId(location.id);
    setIsEditMode(true);
    setIsAddLocationDialogOpen(true);
  };

  // Reset forms
  const resetClientForm = () => {
    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      notes: ''
    });
    setIsEditMode(false);
    setEditClientId(null);
  };

  const resetLocationForm = () => {
    setNewLocation({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isPrimary: false
    });
    setIsEditMode(false);
    setEditLocationId(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Client Management</h1>
        <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetClientForm} className="gap-2">
              <Plus size={16} />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Client' : 'Add New Client'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update client information' : 'Enter details to add a new client'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="123 Business St, Suite 100"
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={newClient.contactPerson}
                  onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Additional information about the client..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddClientDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveClient}>{isEditMode ? 'Update Client' : 'Add Client'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Clients</CardTitle>
              <CardDescription>
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-2"
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md hover:bg-accent/50 cursor-pointer",
                        selectedClient === client.id && "bg-accent"
                      )}
                      onClick={() => setSelectedClient(client.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{client.name}</div>
                          {client.contactPerson && <div className="text-xs text-muted-foreground">{client.contactPerson}</div>}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClient(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClient(client.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No clients found. Try adjusting your search or add a new client.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedClient ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {clients.find(c => c.id === selectedClient)?.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClient(clients.find(c => c.id === selectedClient)!)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteClient(selectedClient)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  View and manage client details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="space-y-4">
                      {/* Client details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Contact Information</div>
                          <div className="space-y-2">
                            {clients.find(c => c.id === selectedClient)?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{clients.find(c => c.id === selectedClient)?.email}</span>
                              </div>
                            )}
                            {clients.find(c => c.id === selectedClient)?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{clients.find(c => c.id === selectedClient)?.phone}</span>
                              </div>
                            )}
                            {clients.find(c => c.id === selectedClient)?.contactPerson && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{clients.find(c => c.id === selectedClient)?.contactPerson}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Address</div>
                          {clients.find(c => c.id === selectedClient)?.address ? (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span>{clients.find(c => c.id === selectedClient)?.address}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No address provided</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Notes */}
                      {clients.find(c => c.id === selectedClient)?.notes && (
                        <div className="mt-6 space-y-2">
                          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Notes
                          </div>
                          <div className="bg-muted/30 p-3 rounded-md text-sm">
                            {clients.find(c => c.id === selectedClient)?.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="locations">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium">Client Locations</h3>
                      <Dialog open={isAddLocationDialogOpen} onOpenChange={setIsAddLocationDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={resetLocationForm}
                            className="gap-2"
                          >
                            <Plus size={16} />
                            Add Location
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isEditMode ? 'Edit Location' : 'Add New Location'}</DialogTitle>
                            <DialogDescription>
                              {isEditMode ? 'Update location information' : 'Enter details to add a new location'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-3">
                              <Label htmlFor="locationName">Location Name *</Label>
                              <Input
                                id="locationName"
                                value={newLocation.name}
                                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                placeholder="Headquarters, Warehouse, etc."
                              />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              <Label htmlFor="locationAddress">Address *</Label>
                              <Input
                                id="locationAddress"
                                value={newLocation.address}
                                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                                placeholder="123 Main St"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <Label htmlFor="locationCity">City</Label>
                                <Input
                                  id="locationCity"
                                  value={newLocation.city}
                                  onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                                  placeholder="City"
                                />
                              </div>
                              <div>
                                <Label htmlFor="locationState">State</Label>
                                <Input
                                  id="locationState"
                                  value={newLocation.state}
                                  onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                                  placeholder="State"
                                />
                              </div>
                              <div>
                                <Label htmlFor="locationZip">Zip Code</Label>
                                <Input
                                  id="locationZip"
                                  value={newLocation.zipCode}
                                  onChange={(e) => setNewLocation({ ...newLocation, zipCode: e.target.value })}
                                  placeholder="Zip Code"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="isPrimary"
                                checked={newLocation.isPrimary}
                                onChange={(e) => setNewLocation({ ...newLocation, isPrimary: e.target.checked })}
                                className="h-4 w-4"
                              />
                              <Label htmlFor="isPrimary">Set as primary location</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddLocationDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveLocation}>{isEditMode ? 'Update Location' : 'Add Location'}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {clientLocationsList.length > 0 ? (
                      <div className="space-y-3">
                        {clientLocationsList.map((location) => (
                          <div key={location.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{location.name}</span>
                                  {location.isPrimary && (
                                    <Badge variant="secondary" className="text-xs">Primary</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {location.address}
                                  {location.city && location.state && `, ${location.city}, ${location.state}`}
                                  {location.zipCode && ` ${location.zipCode}`}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditLocation(location)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteLocation(location.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No locations found for this client. Add a location to get started.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-8">
              <Building className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Client Selected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Select a client from the list to view details or add a new client.
              </p>
              <Button onClick={() => {
                resetClientForm();
                setIsAddClientDialogOpen(true);
              }} className="gap-2">
                <Plus size={16} />
                Add Client
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsView;
