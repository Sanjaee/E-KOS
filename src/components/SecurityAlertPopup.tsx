// components/SecurityAlertPopup.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Shield, Eye, Clock, Ban, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SecurityAlertData {
  error: string;
  securityAlert: {
    level: string;
    action: string;
    reference: string;
    timestamp: string;
  };
  violationDetails: {
    detectedIP: string;
    deviceInfo: string;
    location: string;
    threatLevel: string;
  };
  enforcement: {
    currentStatus: string;
    monitoring: string;
    adminNotified: boolean;
    evidenceLogged: boolean;
  };
  legalNotice: {
    warning: string;
    consequence: string;
    authority: string;
  };
  message: string;
  accessRestoration: {
    retryAfter: number;
    condition: string;
    contact: string;
  };
}

interface SecurityAlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  securityData: SecurityAlertData | null;
  onBlock?: () => void;
}

export default function SecurityAlertPopup({ 
  isOpen, 
  onClose, 
  securityData, 
  onBlock 
}: SecurityAlertPopupProps) {
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    if (securityData?.accessRestoration?.retryAfter && isOpen) {
      setCountdown(securityData.accessRestoration.retryAfter);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [securityData, isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAcknowledge = () => {
    onClose();
    onBlock?.();
    router.push("/");
  };

  const handleCopySecurityId = () => {
    if (securityData?.securityAlert?.reference) {
      navigator.clipboard.writeText(securityData.securityAlert.reference);
      toast({
        title: "Reference ID Copied",
        description: "Security reference ID copied to clipboard for support contact",
      });
    }
  };

  const parseMessage = (message: string) => {
    // Split message by newlines and format each line
    return message.split('\n').map((line, index) => (
      <div key={index} className={`mb-1 ${
        line.includes('🚨') ? 'font-bold text-red-700 dark:text-red-300' :
        line.includes('⚠️') ? 'font-semibold text-orange-600 dark:text-orange-400' :
        line.includes('🔒') || line.includes('⛔') ? 'font-medium text-red-600 dark:text-red-400' :
        'text-red-700 dark:text-red-300'
      }`}>
        {line}
      </div>
    ));
  };

  if (!securityData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-red-500 border-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 max-h-[85vh] overflow-y-auto mt-10">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-red-500 rounded-full p-4 animate-pulse">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <DialogTitle className="text-center text-2xl font-bold text-red-600 dark:text-red-400">
            🚨 SECURITY VIOLATION DETECTED 🚨
          </DialogTitle>
          
          <DialogDescription className="text-center text-red-700 dark:text-red-300 font-semibold">
            CRITICAL ALERT - IMMEDIATE ACTION REQUIRED
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Alert Level */}
          <div className="bg-red-600 text-white p-4 rounded-lg text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6" />
              <span className="font-bold text-lg">
                THREAT LEVEL: {securityData.securityAlert.level}
              </span>
            </div>
            <Badge variant="destructive" className="bg-red-800 text-white font-bold px-4 py-1 font-mono">
              {securityData.securityAlert.reference}
            </Badge>
            <div className="mt-2 text-sm opacity-90">
              Action: {securityData.securityAlert.action}
            </div>
          </div>

          {/* Main Threat Message */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 border-2 border-red-500 rounded-lg p-4">
            <div className="text-red-800 dark:text-red-200 font-bold text-center mb-3">
              ⚠️ SECURITY VIOLATION DETECTED ⚠️
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 text-center">
              {parseMessage(securityData.message)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Violation Details */}
            <div className="bg-white dark:bg-gray-800 border-2 border-red-300 rounded-lg p-4">
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                VIOLATION DETAILS
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">🎯 Detected IP:</span>
                  <Badge variant="destructive" className="font-mono font-bold">
                    {securityData.violationDetails.detectedIP}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">📱 Device:</span>
                  <Badge variant="outline" className="text-xs max-w-[150px] truncate">
                    {securityData.violationDetails.deviceInfo}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">📍 Location:</span>
                  <Badge variant="destructive" className="text-xs">
                    {securityData.violationDetails.location}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">⚡ Threat:</span>
                  <Badge variant="destructive" className="animate-pulse text-xs">
                    {securityData.violationDetails.threatLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enforcement Status */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4">
              <h4 className="font-bold text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
                <Ban className="h-5 w-5" />
                ENFORCEMENT
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant="destructive">
                    {securityData.enforcement.currentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Monitoring:</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-500 text-xs">
                    {securityData.enforcement.monitoring}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Admin Alert:</span>
                  <Badge variant={securityData.enforcement.adminNotified ? "destructive" : "secondary"}>
                    {securityData.enforcement.adminNotified ? "✅ SENT" : "❌ NO"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Evidence:</span>
                  <Badge variant={securityData.enforcement.evidenceLogged ? "destructive" : "secondary"}>
                    {securityData.enforcement.evidenceLogged ? "✅ LOGGED" : "❌ NO"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-4 rounded-lg border-2 border-red-600">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-center justify-center">
              ⚖️ LEGAL NOTICE
            </h4>
            <div className="space-y-2 text-sm text-center">
              <div className="font-semibold">
                {securityData.legalNotice.warning}
              </div>
              <div className="text-red-200">
                {securityData.legalNotice.consequence}
              </div>
              <div className="text-red-300 text-xs">
                {securityData.legalNotice.authority}
              </div>
            </div>
          </div>

          {/* Access Restoration */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4">
            <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              ACCESS RESTORATION
            </h4>
            <div className="space-y-3 text-sm">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(countdown)}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Time until access restored
                </div>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 text-center">
                <div className="font-medium mb-1">Condition:</div>
                <div>{securityData.accessRestoration.condition}</div>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 text-center">
                <div className="font-medium mb-1">Support:</div>
                <div>{securityData.accessRestoration.contact}</div>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 border-t pt-3">
            <div>
              Incident: {new Date(securityData.securityAlert.timestamp).toLocaleString()}
            </div>
            <div className="mt-1 font-mono text-red-600 dark:text-red-400">
              This violation has been permanently logged
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col space-y-3">
          <div className="bg-gray-900 dark:bg-gray-800 text-white p-3 rounded-lg text-center">
            <div className="text-sm font-bold text-red-400 mb-1">
              🚨 ACCESS DENIED - SYSTEM LOCKED 🚨
            </div>
            <div className="text-xs">
              Your activities are being monitored. Cease all unauthorized attempts immediately.
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              className="flex-1 bg-red-600 hover:bg-red-700 font-bold"
              onClick={handleAcknowledge}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              ACKNOWLEDGE VIOLATION
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              onClick={handleCopySecurityId}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Security ID
            </Button>
          </div>

          <div className="text-center text-xs text-red-600 dark:text-red-400 font-semibold">
            WARNING: This incident has been logged and reported to administrators
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}