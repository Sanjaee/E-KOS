"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  MessageSquare,
  RefreshCw,
  TicketIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

// Define proper types for consultations
interface Consultation {
  id: string;
  ticketNumber: string;
  status: "pending" | "success";
  consultationContent: string;
  consultationType: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  responseDate?: string;
  adminResponse?: string;
}

export default function ConsultationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch when params are available and contains an id
    if (params && params.id) {
      fetchConsultationDetails(params.id as string);
    }
  }, [params]);

  const fetchConsultationDetails = async (consultationId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch consultation details");
      }
      
      const data: Consultation = await response.json();
      setConsultation(data);
    } catch (error) {
      console.error("Error fetching consultation details:", error);
      setError("Failed to load consultation details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Consultation not found"}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/consultations/history')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Consultations
        </Button>
      </div>
    );
  }

  const { 
    ticketNumber, 
    status, 
    createdAt, 
    consultationContent, 
    adminResponse, 
    responseDate, 
    consultationType, 
    email, 
    phoneNumber 
  } = consultation;

  const isResponded = status === "success";

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/consultations/history">Consultations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Ticket #{ticketNumber}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => router.push('/consultations/history')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Consultations
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => params && params.id ? fetchConsultationDetails(params.id as string) : null}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5" />
              Consultation Details
            </CardTitle>
            {!isResponded ? (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                Awaiting Response
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <Check className="h-3 w-3 mr-1" />
                Responded
              </Badge>
            )}
          </div>
          <CardDescription>
            Ticket #{ticketNumber} • Created on {formatDate(createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">
              Your Consultation Request
            </h3>
            <div className="whitespace-pre-wrap">
              {consultationContent}
            </div>
          </div>

          {isResponded && adminResponse ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="font-medium text-sm text-blue-500 dark:text-blue-400 mb-2">
                Response from Our Team
              </h3>
              <div className="whitespace-pre-wrap">
                {adminResponse}
              </div>
              {responseDate && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Responded on {formatDate(responseDate)}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="font-medium text-yellow-600 dark:text-yellow-400">
                  Awaiting Response
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Our team is currently reviewing your consultation request. 
                You will receive an email notification once we respond.
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Consultation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Consultation Type</p>
                <p>{consultationType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p>{!isResponded ? "Awaiting Response" : "Responded"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p>{email}</p>
              </div>
              {phoneNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p>{phoneNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</p>
                <p>{formatDate(createdAt)}</p>
              </div>
              {responseDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Responded On</p>
                  <p>{formatDate(responseDate)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push('/consultations/new')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Create New Consultation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}