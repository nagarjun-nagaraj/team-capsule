
import { Download, FileText, File, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PayslipDialog } from "@/components/resources/PayslipDialog";
import { useState } from "react";

const Resources = () => {
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  
  const resources = [
    {
      title: "Employment Agreement",
      description: "View and download your employment contract",
      icon: FileText,
      type: "PDF",
      variant: "default" as const,
    },
    {
      title: "Company Handbook",
      description: "Read about company policies and guidelines",
      icon: BookOpen,
      type: "PDF",
      variant: "secondary" as const,
    }
  ];

  const handleDownload = (resourceTitle: string) => {
    console.log(`Downloading ${resourceTitle}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5 text-purple-500" />
              Payslip
            </CardTitle>
            <CardDescription>Download your monthly payslip</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsPayslipOpen(true)}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Select Month
            </Button>
          </CardContent>
        </Card>

        {resources.map((resource) => (
          <Card key={resource.title} className="bg-gradient-to-br from-gray-50 to-white border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <resource.icon className="h-5 w-5 text-gray-500" />
                {resource.title}
              </CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleDownload(resource.title)}
                className="w-full"
                variant={resource.variant}
              >
                <Download className="mr-2 h-4 w-4" />
                Download {resource.type}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <PayslipDialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen} />
    </div>
  );
};

export default Resources;
