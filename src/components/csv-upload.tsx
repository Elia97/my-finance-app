"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloudIcon } from "lucide-react";

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setStatus({ type: "info", message: "Caricamento in corso..." });

    const res = await fetch("/api/import-expenses", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus({
        type: "success",
        message: `✅ ${data.count} transazioni importate`,
      });
      setFile(null);
    } else {
      setStatus({ type: "error", message: `❌ Errore: ${data.error}` });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importa transazioni da CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="cursor-pointer"
          />
          <Button
            type="submit"
            disabled={loading || !file}
            className="cursor-pointer"
          >
            <UploadCloudIcon className="w-4 h-4 mr-2" />
            {loading ? "Caricamento..." : "Carica CSV"}
          </Button>
          {status && (
            <Alert
              variant={status.type === "error" ? "destructive" : "default"}
            >
              <AlertTitle>
                {status.type === "error" ? "Errore" : "Stato"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
