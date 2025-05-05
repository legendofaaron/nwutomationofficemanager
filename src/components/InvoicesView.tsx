import React, { useState } from 'react';
import { Plus, Trash2, FileEdit, FileSearch, Download, Send, Upload, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  clientName: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  description: string;
}

const InvoicesView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      clientName: 'Acme Corporation',
      date: '2025-04-15',
      amount: 1200,
      status: 'paid',
      dueDate: '2025-04-30',
      description: 'Website redesign project'
    },
    {
      id: 'INV-002',
      clientName: 'TechStart Inc.',
      date: '2025-04-20',
      amount: 850,
      status: 'sent',
      dueDate: '2025-05-05',
      description: 'Monthly maintenance'
    },
    {
      id: 'INV-003',
      clientName: 'Global Solutions',
      date: '2025-04-25',
      amount: 3500,
      status: 'draft',
      dueDate: '2025-05-10',
      description: 'Software development services'
    },
    {
      id: 'INV-004',
      clientName: 'Smith Consulting',
      date: '2025-03-25',
      amount: 750,
      status: 'overdue',
      dueDate: '2025-04-10',
      description: 'Marketing consultation'
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: '',
    amount: 0,
    description: '',
    dueDate: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedInvoiceData, setAnalyzedInvoiceData] = useState<Partial<Invoice> | null>(null);

  const filteredInvoices = invoices.filter(invoice => 
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.amount || !newInvoice.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const invoice: Invoice = {
      id: newId,
      clientName: newInvoice.clientName || '',
      date: today,
      amount: newInvoice.amount || 0,
      status: 'draft',
      dueDate: newInvoice.dueDate || today,
      description: newInvoice.description || ''
    };
    
    setInvoices([...invoices, invoice]);
    setIsCreating(false);
    setNewInvoice({
      clientName: '',
      amount: 0,
      description: '',
      dueDate: ''
    });
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${newId} has been created as a draft`,
    });
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast({
      title: "Invoice Deleted",
      description: `Invoice ${id} has been deleted`,
    });
  };

  const handleChangeStatus = (id: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: newStatus } : invoice
    ));
    
    toast({
      title: "Status Updated",
      description: `Invoice ${id} status changed to ${newStatus}`,
    });
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalyzedInvoiceData(null);
    }
  };

  const handleAnalyzeFile = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedInvoiceData({
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        clientName: 'XYZ Corporation',
        date: new Date().toISOString().split('T')[0],
        amount: 1850.75,
        status: 'draft',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Consulting services'
      });
      
      toast({
        title: "Analysis Complete",
        description: "Invoice data extracted successfully",
      });
    }, 2000);
  };

  const handleApplyInvoiceData = () => {
    if (!analyzedInvoiceData) return;
    
    const newInvoiceFromFile: Invoice = {
      id: analyzedInvoiceData.id || `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: analyzedInvoiceData.clientName || 'Unknown Client',
      date: analyzedInvoiceData.date || new Date().toISOString().split('T')[0],
      amount: analyzedInvoiceData.amount || 0,
      status: 'draft',
      dueDate: analyzedInvoiceData.dueDate || new Date().toISOString().split('T')[0],
      description: analyzedInvoiceData.description || ''
    };
    
    setInvoices([...invoices, newInvoiceFromFile]);
    setSelectedFile(null);
    setAnalyzedInvoiceData(null);
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoiceFromFile.id} has been created from the uploaded file`,
    });
  };

  // Handle dragging of invoices
  const handleInvoiceDragStart = (invoice: Invoice, e: React.DragEvent) => {
    // Set data transfer object with invoice details
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: invoice.id,
      text: `${invoice.id} - ${invoice.clientName}`,
      type: 'invoice',
      originalData: invoice
    }));
    
    // Set the drag effect
    e.dataTransfer.effectAllowed = "copy";
    
    // Optional: Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `
      <div class="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded shadow-md">
        <Calendar class="h-4 w-4 mr-2" />
        <span>${invoice.id}</span>
      </div>
    `;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up after drag operation starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    toast({
      title: "Drag to Calendar",
      description: `Drag invoice ${invoice.id} to schedule processing`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>
      
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Invoice</CardTitle>
            <CardDescription>Fill in the details to create a new invoice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input 
                  id="clientName"
                  value={newInvoice.clientName}
                  onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.amount || ''}
                  onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                  placeholder="Describe the services or products"
                />
              </div>
              <div className="col-span-2 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={handleCreateInvoice}>Create Invoice</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="hover:bg-accent/10 cursor-grab"
                  draggable={true}
                  onDragStart={(e) => handleInvoiceDragStart(invoice, e)}
                >
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" title="View details">
                        <FileSearch className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Send to client"
                          onClick={() => handleChangeStatus(invoice.id, 'sent')}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {invoice.status === 'sent' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Mark as paid"
                          onClick={() => handleChangeStatus(invoice.id, 'paid')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Schedule processing"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>Total: {filteredInvoices.length} invoices</span>
        <span>
          Amount due: ${filteredInvoices
            .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
            .reduce((sum, inv) => sum + inv.amount, 0)
            .toFixed(2)}
        </span>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload & Analyze Invoices</CardTitle>
          <CardDescription>Upload invoice documents or images to extract information automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invoice-file-upload">Select Invoice File</Label>
            <div className="flex gap-4">
              <Input 
                id="invoice-file-upload" 
                type="file" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv"
              />
              <Button 
                onClick={handleAnalyzeFile} 
                disabled={!selectedFile || isAnalyzing}
                variant="secondary"
                className="whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </div>
          </div>

          {analyzedInvoiceData && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Extracted Invoice Data:</h3>
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(analyzedInvoiceData, null, 2)}
                </pre>
              </div>
              <Button 
                onClick={handleApplyInvoiceData}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Add as New Invoice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesView;
