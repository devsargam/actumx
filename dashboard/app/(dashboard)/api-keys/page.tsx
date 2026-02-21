"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, formatTimestamp, type ApiKeyRecord } from "@/lib/api";

export default function ApiKeysPage() {
  const [name, setName] = useState("Production Key");
  const [status, setStatus] = useState("Ready");
  const [latestKey, setLatestKey] = useState<string | null>(null);
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);

  const activeCount = useMemo(() => keys.filter((key) => !key.revokedAt).length, [keys]);

  const loadKeys = useCallback(async () => {
    const response = await apiRequest<{ keys: ApiKeyRecord[] }>("/v1/api-keys");
    if (response.status < 400) {
      setKeys(response.data.keys);
    }
  }, []);

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  async function handleCreateKey() {
    setStatus("Creating API key...");
    const response = await apiRequest<{ apiKeyId?: string; apiKey?: string; error?: string }>("/v1/api-keys", {
      method: "POST",
      body: { name },
    });

    if (response.status >= 400 || !response.data.apiKeyId || !response.data.apiKey) {
      setStatus(`Failed: ${response.data.error ?? "unknown error"}`);
      return;
    }

    setLatestKey(response.data.apiKey);
    setStatus("API key created");
    await loadKeys();
  }

  async function handleRevokeKey(id: string) {
    setStatus("Revoking key...");
    await apiRequest(`/v1/api-keys/${id}`, { method: "DELETE" });
    setStatus("API key revoked");
    await loadKeys();
  }

  async function copyLatestKey() {
    if (!latestKey) {
      return;
    }

    await navigator.clipboard.writeText(latestKey);
    setStatus("Latest key copied");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Issue keys for users and revoke compromised credentials.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Key</CardTitle>
          <CardDescription>Raw key is shown only once. Store securely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
            <Button onClick={() => void handleCreateKey()}>Create</Button>
          </div>
          {latestKey ? (
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs">Latest key</p>
              <p className="mt-1 break-all font-mono text-xs">{latestKey}</p>
              <Button variant="outline" size="sm" onClick={() => void copyLatestKey()} className="mt-2">
                Copy
              </Button>
            </div>
          ) : null}
          <p className="text-muted-foreground text-xs">{status} • Active keys: {activeCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issued Keys</CardTitle>
          <CardDescription>Key prefixes and lifecycle status.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Prefix</th>
                <th className="py-2 text-left">Last Used</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="py-2">{key.name}</td>
                  <td className="py-2 font-mono text-xs">{key.keyPrefix}...</td>
                  <td className="py-2 text-xs">{formatTimestamp(key.lastUsedAt)}</td>
                  <td className="py-2">
                    <Badge variant={key.revokedAt ? "destructive" : "secondary"}>
                      {key.revokedAt ? "Revoked" : "Active"}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">
                    {!key.revokedAt ? (
                      <Button size="sm" variant="outline" onClick={() => void handleRevokeKey(key.id)}>
                        Revoke
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
