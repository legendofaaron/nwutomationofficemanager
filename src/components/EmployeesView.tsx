import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
const mockEmployees = [{
  id: 1,
  name: 'John Smith',
  role: 'Software Engineer',
  department: 'Engineering',
  status: 'Active'
}, {
  id: 2,
  name: 'Sarah Johnson',
  role: 'Product Manager',
  department: 'Product',
  status: 'Active'
}, {
  id: 3,
  name: 'Michael Brown',
  role: 'UX Designer',
  department: 'Design',
  status: 'Active'
}];
const EmployeesView = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalyzedData(null);
    }
  };
  const handleAnalyzeFile = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    setIsAnalyzing(true);

    // Simulate analyzing the file
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedData({
        name: "Jennifer Wilson",
        role: "Marketing Specialist",
        department: "Marketing",
        status: "Active"
      });
      toast.success("File analyzed successfully");
    }, 1500);
  };
  const handleApplyData = () => {
    if (!analyzedData) return;
    toast.success("Employee data has been added to the system");
    setSelectedFile(null);
    setAnalyzedData(null);
  };
  return <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-500">Employees</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4 pb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input placeholder="Search employees..." className="pl-10" />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEmployees.map(employee => <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {employee.status}
                  </span>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      {/* Upload and Analyze Section at the bottom */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload & Analyze</CardTitle>
          <CardDescription>Upload employee documents or images to extract information automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file-upload">Select Employee File</Label>
            <div className="flex gap-4">
              <Input id="file-upload" type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv" />
              <Button onClick={handleAnalyzeFile} disabled={!selectedFile || isAnalyzing} variant="secondary">
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </div>
          </div>

          {analyzedData && <div className="mt-4 space-y-4">
              <h3 className="font-medium">Extracted Employee Data:</h3>
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(analyzedData, null, 2)}
                </pre>
              </div>
              <Button onClick={handleApplyData} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Apply to Employees
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default EmployeesView;