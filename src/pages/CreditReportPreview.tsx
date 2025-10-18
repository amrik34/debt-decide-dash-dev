import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Play, Trash2, Save, Info, Edit2, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditReportEditForm from "@/components/CreditReportEditForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DisputeItemDialog from "@/components/DisputeItemDialog";
import EditPersonalInfoDialog from "@/components/EditPersonalInfoDialog";

const CreditReportPreview = () => {
  const { id, reportId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInstructions, setShowInstructions] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldStatuses, setFieldStatuses] = useState<any>({});
  const [activeTab, setActiveTab] = useState("preview");
  const [disputeDialog, setDisputeDialog] = useState<{
    open: boolean;
    itemType: string;
    itemData: any;
    bureau: string;
  }>({
    open: false,
    itemType: '',
    itemData: null,
    bureau: '',
  });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    bureau: string;
    field: string;
    currentValue: any;
  }>({
    open: false,
    bureau: '',
    field: '',
    currentValue: null,
  });

  const openDisputeDialog = (itemType: string, itemData: any, bureau: string) => {
    setDisputeDialog({
      open: true,
      itemType,
      itemData,
      bureau,
    });
  };

  const openEditDialog = (bureau: string, field: string, currentValue: any) => {
    setEditDialog({
      open: true,
      bureau,
      field,
      currentValue,
    });
  };

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) throw error;
      setReport(data);
      setFieldStatuses(data.personal_info_field_statuses || {});
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: "Error",
        description: "Failed to load credit report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldStatusChange = async (field: string, bureau: string, status: string) => {
    const updatedStatuses = {
      ...fieldStatuses,
      [field]: {
        ...(fieldStatuses[field] || {}),
        [bureau]: status,
      },
    };

    setFieldStatuses(updatedStatuses);

    try {
      const { error } = await supabase
        .from('credit_reports')
        .update({ personal_info_field_statuses: updatedStatuses })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Field status updated",
      });
    } catch (error) {
      console.error('Error updating field status:', error);
      toast({
        title: "Error",
        description: "Failed to update field status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('credit_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Credit report deleted successfully",
      });

      navigate(`/clients/${id}/import-audit`);
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete credit report",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('credit_reports')
        .update({ status: 'saved' })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Credit report saved successfully",
      });

      navigate(`/clients/${id}`);
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: "Failed to save credit report",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Report not found</p>
      </div>
    );
  }

  const analysisData = report.analysis_data || {};
  const personalInfo = report.personal_info || {};
  const ficoScores = report.fico_scores || {};
  const summary = report.summary || {};
  const accounts = report.accounts || [];
  const inquiries = report.inquiries || [];
  const creditorContacts = report.creditor_contacts || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            <Link to={`/clients/${id}`}>
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to={`/clients/${id}/import-audit`}>
              <Button variant="ghost" size="sm">
                🔵 Import/Audit
              </Button>
            </Link>
            <Button variant="default" size="sm">
              🔵 Pending Report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Credit Report Editor</h1>
          <a href="#" className="text-primary hover:underline flex items-center gap-2">
            <Play className="h-4 w-4" />
            Watch a quick video
          </a>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete the pending credit report
          </Button>
          <Button className="bg-primary" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save this report as pending and finish later
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="preview">Preview Mode</TabsTrigger>
            <TabsTrigger value="edit">
              <FileEdit className="h-4 w-4 mr-2" />
              Edit Form
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6">
            <CreditReportEditForm
              reportId={reportId!}
              reportData={report}
              onSave={fetchReport}
            />
          </TabsContent>

          <TabsContent value="preview">{/* Preview content below */}</TabsContent>
        </Tabs>

        {/* Instructions Banner */}
        {showInstructions && (
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <strong>Instructions:</strong> The first time you import a credit report for a client, all items are flagged as "keep" or "positive." For a new client, there's no reason to change any item's status (unless it is incorrect). Your goal here is to create "dispute items" for the wizard. To do this, scroll down this page, look for "Keep" items highlighted red and choose a "Reason and Instructions" for each. When you get to the bottom, click to save and continue.{" "}
                  <a href="#" className="text-primary hover:underline">
                    Click here for a video demo.
                  </a>{" "}
                  **If the report below has no data, that means you have not imported the correct credit report source code.{" "}
                  <a href="#" className="text-primary hover:underline">
                    Click here for help with this task.
                  </a>
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(false)}
              >
                ×
              </Button>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Saved on: {new Date(report.saved_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Provider: {report.provider}
          </p>
        </div>

        {/* Personal Profile Section */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Personal Profile</h2>
            <p className="text-sm text-muted-foreground">
              Personal information as it appears on the credit file. Check carefully, as inaccuracies can mean identity theft. If any personal information is incorrect, click the record to save it as a saved dispute item for the wizard.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px] font-normal"></TableHead>
                  <TableHead className="text-center font-semibold">Experian</TableHead>
                  <TableHead className="text-center">
                    <span className="text-red-600 font-bold text-base">EQUIFAX</span>
                  </TableHead>
                  <TableHead className="text-center font-semibold">TransUnion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">Name:</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-primary hover:underline cursor-pointer">
                          {personalInfo.experian?.name || analysisData.experian?.name || '-'}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => openEditDialog('experian', 'name', personalInfo.experian?.name || analysisData.experian?.name)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Select
                        value={fieldStatuses.name?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('name', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-primary hover:underline cursor-pointer">
                          {personalInfo.equifax?.name || analysisData.equifax?.name || '-'}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => openEditDialog('equifax', 'name', personalInfo.equifax?.name || analysisData.equifax?.name)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Select
                        value={fieldStatuses.name?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('name', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-primary hover:underline cursor-pointer">
                          {personalInfo.transunion?.name || analysisData.transunion?.name || '-'}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => openEditDialog('transunion', 'name', personalInfo.transunion?.name || analysisData.transunion?.name)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Select
                        value={fieldStatuses.name?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('name', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">Year of Birth:</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.experian?.date_of_birth || analysisData.experian?.yearOfBirth || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.year_of_birth?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('year_of_birth', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.equifax?.date_of_birth || analysisData.equifax?.yearOfBirth || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.year_of_birth?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('year_of_birth', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.transunion?.date_of_birth || analysisData.transunion?.yearOfBirth || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.year_of_birth?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('year_of_birth', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">Current Employer:</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.experian?.employers?.[0] || analysisData.experian?.currentEmployer || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.current_employer?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('current_employer', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-muted-foreground">
                        {personalInfo.equifax?.employers?.[0] || analysisData.equifax?.currentEmployer || '-'}
                      </span>
                      <Select
                        value={fieldStatuses.current_employer?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('current_employer', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.transunion?.employers?.[0] || analysisData.transunion?.currentEmployer || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.current_employer?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('current_employer', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">Previous Employer(s):</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.experian?.employers?.slice(1).join(', ') || analysisData.experian?.previousEmployer || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.previous_employer?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('previous_employer', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-muted-foreground">
                        {personalInfo.equifax?.employers?.slice(1).join(', ') || analysisData.equifax?.previousEmployer || '-'}
                      </span>
                      <Select
                        value={fieldStatuses.previous_employer?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('previous_employer', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <a href="#" className="text-primary hover:underline">
                        {personalInfo.transunion?.employers?.slice(1).join(', ') || analysisData.transunion?.previousEmployer || '-'}
                      </a>
                      <Select
                        value={fieldStatuses.previous_employer?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('previous_employer', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-semibold text-muted-foreground align-top pt-4">Addresses:</TableCell>
                  <TableCell className="text-center align-top pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        {(personalInfo.experian?.current_addresses || analysisData.experian?.addresses || []).map((addr: any, idx: number) => {
                          const addressText = typeof addr === 'string' ? addr : `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}`;
                          return (
                            <a key={idx} href="#" className="text-primary hover:underline block mb-1">
                              {addressText}
                            </a>
                          );
                        })}
                      </div>
                      <Select
                        value={fieldStatuses.addresses?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('addresses', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-top pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        {(personalInfo.equifax?.current_addresses || analysisData.equifax?.addresses || []).map((addr: any, idx: number) => {
                          const addressText = typeof addr === 'string' ? addr : `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}`;
                          return (
                            <a key={idx} href="#" className="text-primary hover:underline block mb-1">
                              {addressText}
                            </a>
                          );
                        })}
                      </div>
                      <Select
                        value={fieldStatuses.addresses?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('addresses', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center align-top pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        {(personalInfo.transunion?.current_addresses || analysisData.transunion?.addresses || []).map((addr: any, idx: number) => {
                          const addressText = typeof addr === 'string' ? addr : `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}`;
                          return (
                            <a key={idx} href="#" className="text-primary hover:underline block mb-1">
                              {addressText}
                            </a>
                          );
                        })}
                      </div>
                      <Select
                        value={fieldStatuses.addresses?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('addresses', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* FICO Score Section */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">FICO® Score</h2>
            <p className="text-sm text-muted-foreground">
              Your Credit Score is a representation of your overall credit health. Most lenders utilize some form of credit scoring to help determine your credit worthiness.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px] font-normal"></TableHead>
                  <TableHead className="text-center font-semibold bg-cyan-500/10">TransUnion</TableHead>
                  <TableHead className="text-center font-semibold bg-blue-600/10">Experian</TableHead>
                  <TableHead className="text-center font-semibold bg-red-600/10">Equifax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">FICO® Score 8:</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {ficoScores.transunion?.score || analysisData.transunion?.score || '-'}
                      </span>
                      <Select
                        value={fieldStatuses.fico_score?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('fico_score', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {ficoScores.experian?.score || analysisData.experian?.score || '-'}
                      </span>
                      <Select
                        value={fieldStatuses.fico_score?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('fico_score', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {ficoScores.equifax?.score || analysisData.equifax?.score || '-'}
                      </span>
                      <Select
                        value={fieldStatuses.fico_score?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('fico_score', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
                
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">Lender Rank:</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-foreground">
                        {ficoScores.transunion?.rank || ficoScores.transunion?.lender_rank || 'Fair'}
                      </span>
                      <Select
                        value={fieldStatuses.lender_rank?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('lender_rank', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-foreground">
                        {ficoScores.experian?.rank || ficoScores.experian?.lender_rank || 'Fair'}
                      </span>
                      <Select
                        value={fieldStatuses.lender_rank?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('lender_rank', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-foreground">
                        {ficoScores.equifax?.rank || ficoScores.equifax?.lender_rank || 'Fair'}
                      </span>
                      <Select
                        value={fieldStatuses.lender_rank?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('lender_rank', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-semibold text-muted-foreground">FICO® Score 8 Scale:</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-foreground">
                        {ficoScores.transunion?.scale || '300-850'}
                      </span>
                      <Select
                        value={fieldStatuses.score_scale?.transunion || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('score_scale', 'transunion', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-foreground">
                        {ficoScores.experian?.scale || '300-850'}
                      </span>
                      <Select
                        value={fieldStatuses.score_scale?.experian || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('score_scale', 'experian', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-foreground">
                        {ficoScores.equifax?.scale || '300-850'}
                      </span>
                      <Select
                        value={fieldStatuses.score_scale?.equifax || 'keep'}
                        onValueChange={(value) => handleFieldStatusChange('score_scale', 'equifax', value)}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep">Keep</SelectItem>
                          <SelectItem value="remove">Remove</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Credit Summary Section */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Credit Summary</h2>
            <p className="text-sm text-muted-foreground">
              An overview of present and past credit status including open and closed accounts and balance information
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px] font-normal"></TableHead>
                  <TableHead className="text-center font-semibold">Experian</TableHead>
                  <TableHead className="text-center font-semibold">Equifax</TableHead>
                  <TableHead className="text-center font-semibold">TransUnion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(summary).length > 0 ? (
                  <>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Total Accounts:</TableCell>
                      <TableCell className="text-center">{summary.experian?.total_accounts || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.total_accounts || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.total_accounts || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Open Accounts:</TableCell>
                      <TableCell className="text-center">{summary.experian?.open_accounts || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.open_accounts || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.open_accounts || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Closed Accounts:</TableCell>
                      <TableCell className="text-center">{summary.experian?.closed_accounts || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.closed_accounts || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.closed_accounts || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Delinquent:</TableCell>
                      <TableCell className="text-center">{summary.experian?.delinquent || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.delinquent || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.delinquent || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Derogatory:</TableCell>
                      <TableCell className="text-center">{summary.experian?.derogatory || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.derogatory || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.derogatory || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Collection:</TableCell>
                      <TableCell className="text-center">{summary.experian?.collection || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.collection || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.collection || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Balances:</TableCell>
                      <TableCell className="text-center">{summary.experian?.balances || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.balances || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.balances || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Payments:</TableCell>
                      <TableCell className="text-center">{summary.experian?.payments || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.payments || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.payments || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-muted-foreground">Inquiries (2 years):</TableCell>
                      <TableCell className="text-center">{summary.experian?.inquiries || '-'}</TableCell>
                      <TableCell className="text-center">{summary.equifax?.inquiries || '-'}</TableCell>
                      <TableCell className="text-center">{summary.transunion?.inquiries || '-'}</TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No summary data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Account History Section */}
        {accounts.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Account History</h2>
              <p className="text-sm text-muted-foreground">
                Information on accounts you have opened in the past
              </p>
            </div>

            <div className="space-y-6">
              {accounts.map((account: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{account.creditor_name}</h3>
                    {account.original_creditor && (
                      <span className="text-sm text-muted-foreground">
                        Original: {account.original_creditor}
                      </span>
                    )}
                  </div>

                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold w-1/4">Account #:</TableCell>
                        <TableCell colSpan={3}>{account.account_number}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Account Type:</TableCell>
                        <TableCell colSpan={3}>{account.account_type} - {account.account_type_detail}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Account Status:</TableCell>
                        <TableCell colSpan={3}>
                          <Badge variant={account.account_status?.toLowerCase().includes('open') ? 'default' : 'secondary'}>
                            {account.account_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Date Opened:</TableCell>
                        <TableCell>{account.date_opened || '-'}</TableCell>
                        <TableCell className="font-semibold">Last Reported:</TableCell>
                        <TableCell>{account.last_reported || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Balance:</TableCell>
                        <TableCell>{account.balance || '-'}</TableCell>
                        <TableCell className="font-semibold">High Credit:</TableCell>
                        <TableCell>{account.high_credit || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Credit Limit:</TableCell>
                        <TableCell>{account.credit_limit || '-'}</TableCell>
                        <TableCell className="font-semibold">Past Due:</TableCell>
                        <TableCell>{account.past_due || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Payment Status:</TableCell>
                        <TableCell colSpan={3}>{account.payment_status}</TableCell>
                      </TableRow>
                      {account.comments && (
                        <TableRow>
                          <TableCell className="font-semibold">Comments:</TableCell>
                          <TableCell colSpan={3}>{account.comments}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDisputeDialog('account', account, 'all')}
                    >
                      Dispute This Account
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Credit Inquiries Section */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Credit Inquiries</h2>
            <p className="text-sm text-muted-foreground">
              Organizations who have obtained a copy of your Credit Report. Inquiries can remain on a credit file for up to two years.
            </p>
          </div>

          <div className="overflow-x-auto">
            {inquiries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Creditor Name</TableHead>
                    <TableHead className="font-semibold">Type of Business</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Bureau</TableHead>
                    <TableHead className="text-center font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry: any, idx: number) => (
                    <TableRow key={idx} className="border-b">
                      <TableCell className="font-semibold">{inquiry.creditor_name}</TableCell>
                      <TableCell>{inquiry.type_of_business || '-'}</TableCell>
                      <TableCell>{inquiry.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{inquiry.bureau}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => openDisputeDialog('inquiry', inquiry, inquiry.bureau)}
                          className="text-red-600 hover:underline text-xs font-semibold"
                        >
                          Dispute
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No inquiries found.
              </div>
            )}
          </div>
        </Card>

        {/* Public Records Section */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Public Records</h2>
            <p className="text-sm text-muted-foreground">
              Public records include bankruptcy filings, court records, tax liens and monetary judgements. remain for 7-10 years.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-[200px]"></TableHead>
                  <TableHead className="text-center font-semibold">Experian</TableHead>
                  <TableHead className="text-center font-semibold">Equifax</TableHead>
                  <TableHead className="text-center font-semibold">TransUnion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell className="font-semibold text-muted-foreground">Date Filed:</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-block bg-red-200 dark:bg-red-900/40 px-4 py-2 rounded">
                      <span className="font-semibold">5/3/2018</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">-</TableCell>
                  <TableCell className="text-center text-muted-foreground">-</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-semibold text-muted-foreground">Public Record Type:</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-block bg-red-200 dark:bg-red-900/40 px-4 py-2 rounded">
                      <span className="font-semibold">Bankruptcy chapter 7-discharged</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">-</TableCell>
                  <TableCell className="text-center text-muted-foreground">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <DisputeItemDialog
        open={disputeDialog.open}
        onOpenChange={(open) => setDisputeDialog({ ...disputeDialog, open })}
        reportId={reportId || ''}
        itemType={disputeDialog.itemType}
        itemData={disputeDialog.itemData}
        bureau={disputeDialog.bureau}
      />
      
      <EditPersonalInfoDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
        reportId={reportId || ''}
        bureau={editDialog.bureau}
        field={editDialog.field}
        currentValue={editDialog.currentValue}
        onSave={fetchReport}
      />
    </div>
  );
};

export default CreditReportPreview;
