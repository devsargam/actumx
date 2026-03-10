"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Ellipsis,
  Plus,
  X,
  Upload,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  apiRequest,
  formatMoney,
  type ServiceRecord,
  type EndpointRecord,
} from "@/lib/api";
import { env } from "@/lib/env";

const GATEWAY_BASE = `${env.GATEWAY_BASE_URL}/x402/purchase`;

const AUTH_METHOD_LABELS: Record<string, string> = {
  none: "No Auth",
  bearer: "Bearer Token",
  "x-api-key": "API Key",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={() => void handleCopy()}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  );
}

export function ServicesClient({
  initialServices,
}: {
  initialServices: ServiceRecord[];
}) {
  const [services, setServices] = useState<ServiceRecord[]>(initialServices);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [endpointsMap, setEndpointsMap] = useState<
    Record<string, EndpointRecord[]>
  >({});

  // Create service dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createBaseUrl, setCreateBaseUrl] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createFaviconUrl, setCreateFaviconUrl] = useState("");
  const [createWebsocketUrl, setCreateWebsocketUrl] = useState("");
  const [createAuthMethod, setCreateAuthMethod] = useState("none");
  const [createApiKey, setCreateApiKey] = useState("");
  const [createIsLive, setCreateIsLive] = useState(false);
  const [createStatus, setCreateStatus] = useState("");
  const createNameRef = useRef<HTMLInputElement>(null);

  // Edit service dialog
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBaseUrl, setEditBaseUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFaviconUrl, setEditFaviconUrl] = useState("");
  const [editWebsocketUrl, setEditWebsocketUrl] = useState("");
  const [editAuthMethod, setEditAuthMethod] = useState("none");
  const [editApiKey, setEditApiKey] = useState("");
  const [editIsLive, setEditIsLive] = useState(false);
  const [editStatus, setEditStatus] = useState("");

  // Add endpoint dialog
  const [addEndpointOpen, setAddEndpointOpen] = useState<string | null>(null);
  const [epMethod, setEpMethod] = useState("GET");
  const [epPath, setEpPath] = useState("/");
  const [epPrice, setEpPrice] = useState("0");
  const [epStatus, setEpStatus] = useState("");

  // Import dialog
  const [importOpen, setImportOpen] = useState<string | null>(null);
  const [importSpec, setImportSpec] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [importStatus, setImportStatus] = useState("");

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState("");

  const loadServices = useCallback(async () => {
    const response = await apiRequest<{ services: ServiceRecord[] }>(
      "/v1/services"
    );
    if (response.status < 400) {
      setServices(response.data.services);
    }
  }, []);

  const loadEndpoints = useCallback(async (serviceId: string) => {
    const response = await apiRequest<{ endpoints: EndpointRecord[] }>(
      `/v1/services/${serviceId}/endpoints`
    );
    if (response.status < 400) {
      setEndpointsMap((prev) => ({
        ...prev,
        [serviceId]: response.data.endpoints,
      }));
    }
  }, []);

  useEffect(() => {
    if (createOpen) {
      setTimeout(() => createNameRef.current?.focus(), 100);
    }
  }, [createOpen]);

  function toggleExpand(serviceId: string) {
    if (expandedId === serviceId) {
      setExpandedId(null);
    } else {
      setExpandedId(serviceId);
      void loadEndpoints(serviceId);
    }
  }

  async function handleCreateService() {
    if (!createName.trim() || !createBaseUrl.trim()) {
      setCreateStatus("Name and base URL are required.");
      return;
    }
    setCreateStatus("Creating...");

    const body: Record<string, unknown> = {
      name: createName.trim(),
      baseUrl: createBaseUrl.trim(),
      authMethod: createAuthMethod,
      isLive: createIsLive,
    };
    if (createDescription.trim()) body.description = createDescription.trim();
    if (createFaviconUrl.trim()) body.faviconUrl = createFaviconUrl.trim();
    if (createWebsocketUrl.trim())
      body.websocketUrl = createWebsocketUrl.trim();
    if (createAuthMethod !== "none") body.apiKey = createApiKey;

    const response = await apiRequest<{ service?: ServiceRecord; error?: string }>(
      "/v1/services",
      { method: "POST", body }
    );

    if (response.status >= 400) {
      setCreateStatus(
        `Failed: ${response.data.error ?? "unknown error"}`
      );
      return;
    }

    setCreateOpen(false);
    resetCreateForm();
    await loadServices();
  }

  function resetCreateForm() {
    setCreateName("");
    setCreateBaseUrl("");
    setCreateDescription("");
    setCreateFaviconUrl("");
    setCreateWebsocketUrl("");
    setCreateAuthMethod("none");
    setCreateApiKey("");
    setCreateIsLive(false);
    setCreateStatus("");
  }

  function openEditDialog(svc: ServiceRecord) {
    setEditName(svc.name);
    setEditBaseUrl(svc.baseUrl);
    setEditDescription(svc.description ?? "");
    setEditFaviconUrl(svc.faviconUrl ?? "");
    setEditWebsocketUrl(svc.websocketUrl ?? "");
    setEditAuthMethod(svc.authMethod);
    setEditApiKey("");
    setEditIsLive(svc.isLive === "true");
    setEditStatus("");
    setEditOpen(svc.id);
  }

  async function handleEditService() {
    if (!editOpen) return;
    setEditStatus("Saving...");

    const body: Record<string, unknown> = {
      name: editName.trim(),
      baseUrl: editBaseUrl.trim(),
      description: editDescription.trim() || null,
      faviconUrl: editFaviconUrl.trim() || null,
      websocketUrl: editWebsocketUrl.trim() || null,
      authMethod: editAuthMethod,
      isLive: editIsLive,
    };
    if (editApiKey) body.apiKey = editApiKey;

    const response = await apiRequest(`/v1/services/${editOpen}`, {
      method: "PATCH",
      body,
    });

    if (response.status >= 400) {
      setEditStatus("Failed to update service.");
      return;
    }

    setEditOpen(null);
    await loadServices();
  }

  async function handleDeleteService() {
    if (!deleteOpen) return;
    setDeleteStatus("Deleting...");

    const response = await apiRequest(`/v1/services/${deleteOpen}`, {
      method: "DELETE",
    });

    if (response.status >= 400) {
      setDeleteStatus("Failed to delete service.");
      return;
    }

    setDeleteOpen(null);
    setDeleteStatus("");
    if (expandedId === deleteOpen) setExpandedId(null);
    await loadServices();
  }

  async function handleAddEndpoint() {
    if (!addEndpointOpen) return;
    setEpStatus("Adding...");

    const response = await apiRequest(
      `/v1/services/${addEndpointOpen}/endpoints`,
      {
        method: "POST",
        body: {
          method: epMethod,
          path: epPath,
          priceCents: parseInt(epPrice, 10) || 0,
        },
      }
    );

    if (response.status >= 400) {
      setEpStatus("Failed to add endpoint.");
      return;
    }

    setAddEndpointOpen(null);
    setEpMethod("GET");
    setEpPath("/");
    setEpPrice("0");
    setEpStatus("");
    if (expandedId) void loadEndpoints(expandedId);
    await loadServices();
  }

  async function handleDeleteEndpoint(serviceId: string, endpointId: string) {
    await apiRequest(`/v1/services/${serviceId}/endpoints/${endpointId}`, {
      method: "DELETE",
    });
    void loadEndpoints(serviceId);
    await loadServices();
  }

  async function handleImportEndpoints() {
    if (!importOpen) return;
    setImportStatus("Importing...");

    const body: Record<string, string> = {};
    if (importUrl.trim()) {
      body.url = importUrl.trim();
    } else {
      body.spec = importSpec;
    }

    const response = await apiRequest<{ imported?: number; error?: string }>(
      `/v1/services/${importOpen}/endpoints/import`,
      { method: "POST", body }
    );

    if (response.status >= 400) {
      setImportStatus(
        `Failed: ${response.data.error ?? "unknown error"}`
      );
      return;
    }

    setImportStatus(`Imported ${response.data.imported ?? 0} endpoints.`);
    if (expandedId) void loadEndpoints(expandedId);
    await loadServices();
    setTimeout(() => {
      setImportOpen(null);
      setImportSpec("");
      setImportUrl("");
      setImportStatus("");
    }, 1500);
  }

  const isEmpty = services.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            API Services
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Register your upstream APIs and define per-request pricing for x402
            gateway monetization.
          </p>
          {!isEmpty && (
            <p className="mt-1 text-sm text-muted-foreground">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <AlertDialog open={createOpen} onOpenChange={setCreateOpen}>
          <AlertDialogTrigger asChild>
            <Button size="lg">
              <Plus className="size-4" />
              Add Service
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xl rounded-xl p-0">
            <AlertDialogHeader className="flex flex-row items-center justify-between border-b px-6 py-5 text-left">
              <AlertDialogTitle className="text-2xl">
                Add API Service
              </AlertDialogTitle>
              <AlertDialogCancel asChild className="p-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </Button>
              </AlertDialogCancel>
            </AlertDialogHeader>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Service Name</p>
                <Input
                  ref={createNameRef}
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="My API"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Base URL</p>
                <Input
                  value={createBaseUrl}
                  onChange={(e) => setCreateBaseUrl(e.target.value)}
                  placeholder="https://api.example.com"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  Description (optional)
                </p>
                <Textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="What does this API do?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    Favicon URL (optional)
                  </p>
                  <Input
                    value={createFaviconUrl}
                    onChange={(e) => setCreateFaviconUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    WebSocket URL (optional)
                  </p>
                  <Input
                    value={createWebsocketUrl}
                    onChange={(e) => setCreateWebsocketUrl(e.target.value)}
                    placeholder="wss://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">Auth Method</p>
                  <Select
                    value={createAuthMethod}
                    onValueChange={setCreateAuthMethod}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="x-api-key">API Key Header</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-3 pb-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={createIsLive}
                      onChange={(e) => setCreateIsLive(e.target.checked)}
                      className="size-4 rounded"
                    />
                    Live Mode
                  </label>
                </div>
              </div>
              {createAuthMethod !== "none" && (
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground">
                    API Key / Token
                  </p>
                  <Input
                    type="password"
                    value={createApiKey}
                    onChange={(e) => setCreateApiKey(e.target.value)}
                    placeholder="Enter your upstream API key"
                  />
                </div>
              )}
              {createStatus && (
                <p className="text-xs text-muted-foreground">{createStatus}</p>
              )}
            </div>
            <AlertDialogFooter className="border-t px-6 py-4 sm:justify-end">
              <AlertDialogCancel asChild>
                <Button variant="secondary">Cancel</Button>
              </AlertDialogCancel>
              <Button
                variant="outline"
                onClick={() => void handleCreateService()}
              >
                Create Service
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Service Cards */}
      {!isEmpty && (
        <div className="space-y-4">
          {services.map((svc) => {
            const isExpanded = expandedId === svc.id;
            const eps = endpointsMap[svc.id] ?? [];

            return (
              <Card
                key={svc.id}
                className="border-primary/25 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex flex-1 items-center gap-3 text-left"
                      onClick={() => toggleExpand(svc.id)}
                    >
                      <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                        {svc.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{svc.name}</p>
                          <Badge
                            variant={
                              svc.isLive === "true" ? "default" : "secondary"
                            }
                          >
                            {svc.isLive === "true" ? "Live" : "Test"}
                          </Badge>
                          <Badge variant="outline">
                            {AUTH_METHOD_LABELS[svc.authMethod] ?? svc.authMethod}
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {svc.baseUrl}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {svc.endpointCount ?? 0} endpoint
                          {(svc.endpointCount ?? 0) !== 1 ? "s" : ""}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </div>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="ml-2 h-8 w-8"
                        >
                          <Ellipsis className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => openEditDialog(svc)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setAddEndpointOpen(svc.id);
                            setEpStatus("");
                          }}
                        >
                          Add Endpoint
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setImportOpen(svc.id);
                            setImportStatus("");
                            setImportSpec("");
                            setImportUrl("");
                          }}
                        >
                          Import OpenAPI
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            setDeleteOpen(svc.id);
                            setDeleteStatus("");
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {svc.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {svc.description}
                    </p>
                  )}

                  {/* Expanded Endpoints Table */}
                  {isExpanded && (
                    <div className="mt-4 border-t pt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium">Endpoints</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImportOpen(svc.id);
                              setImportStatus("");
                              setImportSpec("");
                              setImportUrl("");
                            }}
                          >
                            <Upload className="size-3.5" />
                            Import
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAddEndpointOpen(svc.id);
                              setEpStatus("");
                            }}
                          >
                            <Plus className="size-3.5" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {eps.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No endpoints yet. Add one or import from an OpenAPI
                          spec.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b text-left text-muted-foreground">
                                <th className="pb-2 pr-4 font-medium">
                                  Method
                                </th>
                                <th className="pb-2 pr-4 font-medium">Path</th>
                                <th className="pb-2 pr-4 font-medium">
                                  Price
                                </th>
                                <th className="pb-2 pr-4 font-medium">
                                  Status
                                </th>
                                <th className="pb-2 pr-4 font-medium">
                                  Gateway URL
                                </th>
                                <th className="pb-2 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eps.map((ep) => {
                                const gatewayUrl = `${GATEWAY_BASE}/${svc.id}${ep.path}`;
                                return (
                                  <tr key={ep.id} className="border-b last:border-0">
                                    <td className="py-2 pr-4">
                                      <Badge variant="outline">
                                        {ep.method}
                                      </Badge>
                                    </td>
                                    <td className="py-2 pr-4 font-mono text-xs">
                                      {ep.path}
                                    </td>
                                    <td className="py-2 pr-4">
                                      {ep.priceCents === 0
                                        ? "Free"
                                        : formatMoney(ep.priceCents)}
                                    </td>
                                    <td className="py-2 pr-4">
                                      <Badge
                                        variant={
                                          ep.isEnabled === "true"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {ep.isEnabled === "true"
                                          ? "Enabled"
                                          : "Disabled"}
                                      </Badge>
                                    </td>
                                    <td className="py-2 pr-4">
                                      <div className="flex items-center gap-1">
                                        <code className="max-w-[200px] truncate text-xs text-muted-foreground">
                                          {gatewayUrl}
                                        </code>
                                        <CopyButton text={gatewayUrl} />
                                      </div>
                                    </td>
                                    <td className="py-2">
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() =>
                                          void handleDeleteEndpoint(
                                            svc.id,
                                            ep.id
                                          )
                                        }
                                      >
                                        <Trash2 className="size-3.5 text-destructive" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isEmpty && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium">No services yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first API service to start monetizing with x402.
            </p>
            <Button
              className="mt-4"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Service Dialog */}
      <AlertDialog
        open={!!editOpen}
        onOpenChange={(open) => !open && setEditOpen(null)}
      >
        <AlertDialogContent className="max-w-xl rounded-xl p-0">
          <AlertDialogHeader className="flex flex-row items-center justify-between border-b px-6 py-5 text-left">
            <AlertDialogTitle className="text-2xl">
              Edit Service
            </AlertDialogTitle>
            <AlertDialogCancel asChild className="p-0">
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" />
              </Button>
            </AlertDialogCancel>
          </AlertDialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Service Name</p>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Base URL</p>
              <Input
                value={editBaseUrl}
                onChange={(e) => setEditBaseUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Description</p>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Favicon URL</p>
                <Input
                  value={editFaviconUrl}
                  onChange={(e) => setEditFaviconUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">WebSocket URL</p>
                <Input
                  value={editWebsocketUrl}
                  onChange={(e) => setEditWebsocketUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Auth Method</p>
                <Select
                  value={editAuthMethod}
                  onValueChange={setEditAuthMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Auth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="x-api-key">API Key Header</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-3 pb-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editIsLive}
                    onChange={(e) => setEditIsLive(e.target.checked)}
                    className="size-4 rounded"
                  />
                  Live Mode
                </label>
              </div>
            </div>
            {editAuthMethod !== "none" && (
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  API Key / Token (leave empty to keep current)
                </p>
                <Input
                  type="password"
                  value={editApiKey}
                  onChange={(e) => setEditApiKey(e.target.value)}
                  placeholder="Enter new key or leave empty"
                />
              </div>
            )}
            {editStatus && (
              <p className="text-xs text-muted-foreground">{editStatus}</p>
            )}
          </div>
          <AlertDialogFooter className="border-t px-6 py-4 sm:justify-end">
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => void handleEditService()}
            >
              Save Changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Endpoint Dialog */}
      <AlertDialog
        open={!!addEndpointOpen}
        onOpenChange={(open) => !open && setAddEndpointOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Endpoint</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">HTTP Method</p>
              <Select value={epMethod} onValueChange={setEpMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "PATCH", "DELETE", "WEBSOCKET"].map(
                    (m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Path</p>
              <Input
                value={epPath}
                onChange={(e) => setEpPath(e.target.value)}
                placeholder="/v1/endpoint"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">
                Price (cents per request)
              </p>
              <Input
                type="number"
                min="0"
                value={epPrice}
                onChange={(e) => setEpPrice(e.target.value)}
              />
            </div>
            {epStatus && (
              <p className="text-xs text-muted-foreground">{epStatus}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => void handleAddEndpoint()}>
              Add Endpoint
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import OpenAPI Dialog */}
      <AlertDialog
        open={!!importOpen}
        onOpenChange={(open) => !open && setImportOpen(null)}
      >
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Import OpenAPI Spec</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">
                OpenAPI Spec URL (optional)
              </p>
              <Input
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://api.example.com/openapi.json"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">
                Or paste JSON spec below
              </p>
              <Textarea
                value={importSpec}
                onChange={(e) => setImportSpec(e.target.value)}
                placeholder='{"openapi":"3.0.0","paths":{...}}'
                className="min-h-[150px] font-mono text-xs"
              />
            </div>
            {importStatus && (
              <p className="text-xs text-muted-foreground">{importStatus}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => void handleImportEndpoints()}>
              Import
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Service Dialog */}
      <AlertDialog
        open={!!deleteOpen}
        onOpenChange={(open) => !open && setDeleteOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this service? All endpoints will
              also be deleted. This action cannot be undone.
            </p>
            {deleteStatus && (
              <p className="mt-2 text-sm text-muted-foreground">
                {deleteStatus}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteService()}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
