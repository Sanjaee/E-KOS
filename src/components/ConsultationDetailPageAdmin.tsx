"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  adminResponse: z.string().min(1, 'Admin response is required'),
});

// Define the consultation data type structure
interface ConsultationData {
  id: string;
  userId: string;
  question: string;
  adminResponse: string | null;
  status: string;
  createdAt: string;
  responseDate: string | null;
  phoneNumber?: string;
  consultationType?: string;
  adminId?: string;
  notificationSentToUser?: boolean;
}

export default function ConsultationDetailPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState<boolean>(false);

  // Initialize form with type safety
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminResponse: '',
    },
  });

  // Mark component as mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get consultation ID from URL - handle safely with TypeScript
  const { id } = router.query;
  const consultationId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  // Fetch consultation data - with optimized dependencies
  useEffect(() => {
    // Only fetch when router is ready and ID is available
    if (!router.isReady || !consultationId) {
      return;
    }

    // Only fetch if user is authenticated and admin
    if (sessionStatus !== 'authenticated' || session?.user?.role !== 'admin') {
      return;
    }

    const fetchConsultation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/consultations/admin/${consultationId}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch consultation: ${response.status}`);
        }

        const data = await response.json();
        setConsultation(data);
        
        // Pre-fill the form if there's existing admin response
        if (data.adminResponse) {
          form.setValue('adminResponse', data.adminResponse);
        }
      } catch (err) {
        console.error('Error fetching consultation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load consultation data');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [router.isReady, consultationId, sessionStatus, session?.user?.role, form]);

  // Handle form submission to update consultation
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!consultationId || session?.user?.role !== 'admin') {
      toast({
        title: "Error",
        description: "You don't have permission to update this consultation",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/consultations/admin/${consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update consultation: ${response.status}`);
      }

      const updatedConsultation = await response.json();
      setConsultation(updatedConsultation);
      
      toast({
        title: "Success",
        description: "Your response has been submitted successfully",
      });

      router.push('/admin/consultations');
    } catch (err) {
      console.error('Error updating consultation:', err);
      setError(err instanceof Error ? err.message : 'Failed to update consultation');
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update consultation',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle consultation deletion
  const handleDelete = async () => {
    if (!consultationId) {
      toast({
        title: "Error",
        description: "Invalid consultation ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      
      const response = await fetch(`/api/consultations/admin/${consultationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete consultation: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Consultation has been deleted successfully",
      });

      // Redirect back to the consultations list page
      router.push('/admin/consultations');
    } catch (err) {
      console.error('Error deleting consultation:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete consultation');
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete consultation',
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle redirection for non-admin users - optimize with early returns
  if (mounted && sessionStatus === 'authenticated' && session?.user?.role !== 'admin') {
    router.push('/dashboard');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  // Don't render anything until the component is mounted on the client
  // This prevents hydration errors
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show loading state
  if (loading || sessionStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading consultation...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/admin/consultations')}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Consultations
        </Button>
      </div>
    );
  }

  // Show not found state
  if (!consultation && !loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>
            Consultation not found or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/admin/consultations')}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Consultations
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:pt-40 pt-10 pb-40">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Consultation Details</h1>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this consultation and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/consultations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>

      {consultation && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Question</CardTitle>
                <Badge variant={
                  consultation.status === 'pending' ? 'outline' :
                  consultation.status === 'success' ? 'default' : 'secondary'
                }>
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>
                {consultation.phoneNumber && (
                  <span className="block">Phone: {consultation.phoneNumber}</span>
                )}
                {consultation.consultationType && (
                  <span className="block">Type: {consultation.consultationType}</span>
                )}
                <span className="block">
                  Submitted on {formatDate(consultation.createdAt)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{consultation.question}</div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Admin Response</CardTitle>
                  <CardDescription>
                    {consultation.responseDate 
                      ? `Last updated on ${formatDate(consultation.responseDate)}`
                      : 'Provide your response to this consultation'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="adminResponse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Type your response here..." 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="min-w-[120px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : consultation.adminResponse ? 'Update Response' : 'Submit Response'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}