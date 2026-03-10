"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Check, Plus, X, Trash2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, formatMoney, type PaymentLinkRecord } from "@/lib/api";
import { env } from "@/lib/env";

const PAYMENT_LINK_BASE = `${env.GATEWAY_BASE_URL}/x402/pay`;

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

export function PaymentLinksClient({
  initialLinks,
}: {
  initialLinks: PaymentLinkRecord[];
}) {
  const [links, setLinks] = useState<PaymentLinkRecord[]>(initialLinks);

  const [createOpen, setCreateOpen] = useState(false);
  const [createAmount, setCreateAmount] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createIsReusable, setCreateIsReusable] = useState(false);
  const [createStatus, setCreateStatus] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  const [deleteOpen, setDeleteOpen] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState("");

  const loadLinks = useCallback(async () => {
    const response = await apiRequest<{ paymentLinks: PaymentLinkRecord[] }>(
      "/v1/payment-links"
    );
    if (response.status < 400) {
      setLinks(response.data.paymentLinks);
    }
  }, []);

  useEffect(() => {
    if (createOpen) {
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  }, [createOpen]);

  async function handleCreate() {
    const cents = parseInt(createAmount, 10);
    if (!cents || cents < 1) {
      setCreateStatus("Amount must be at least 1 cent.");
      return;
    }

    setCreateStatus("Creating...");

    const body: Record<string, unknown> = {
      amountCents: cents,
      isReusable: createIsReusable,
    };
    if (createDescription.trim()) body.description = createDescription.trim();

    const response = await apiRequest<{
      paymentLink?: PaymentLinkRecord;
      error?: string;
    }>("/v1/payment-links", { method: "POST", body });

    if (response.status >= 400) {
      setCreateStatus(
        `Failed: ${response.data.error ?? "unknown error"}`
      );
      return;
    }

    setCreateOpen(false);
    setCreateAmount("");
    setCreateDescription("");
    setCreateIsReusable(false);
    setCreateStatus("");
    await loadLinks();
  }

  async function handleDelete() {
    if (!deleteOpen) return;
    setDeleteStatus("Deleting...");

    const response = await apiRequest(`/v1/payment-links/${deleteOpen}`, {
      method: "DELETE",
    });

    if (response.status >= 400) {
      setDeleteStatus("Failed to delete payment link.");
      return;
    }

    setDeleteOpen(null);
    setDeleteStatus("");
    await loadLinks();
  }

  const isEmpty = links.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Payment Links
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Create one-off or reusable payment links for x402-based payments.
          </p>
          {!isEmpty && (
            <p className="mt-1 text-sm text-muted-foreground">
              {links.length} payment link{links.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <AlertDialog open={createOpen} onOpenChange={setCreateOpen}>
          <AlertDialogTrigger asChild>
            <Button size="lg">
              <Plus className="size-4" />
              Create Link
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md rounded-xl p-0">
            <AlertDialogHeader className="flex flex-row items-center justify-between border-b px-6 py-5 text-left">
              <AlertDialogTitle className="text-2xl">
                Create Payment Link
              </AlertDialogTitle>
              <AlertDialogCancel asChild className="p-0">
                <Button variant="ghost" size="icon-sm">
                  <X className="size-4" />
                </Button>
              </AlertDialogCancel>
            </AlertDialogHeader>
            <div className="space-y-4 px-6 py-5">
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  Amount (cents)
                </p>
                <Input
                  ref={amountRef}
                  type="number"
                  min="1"
                  value={createAmount}
                  onChange={(e) => setCreateAmount(e.target.value)}
                  placeholder="100"
                />
                {createAmount && parseInt(createAmount, 10) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    = {formatMoney(parseInt(createAmount, 10))}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">
                  Description (optional)
                </p>
                <Textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="What is this payment for?"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={createIsReusable}
                  onChange={(e) => setCreateIsReusable(e.target.checked)}
                  className="size-4 rounded"
                />
                Reusable link (can be paid multiple times)
              </label>
              {createStatus && (
                <p className="text-xs text-muted-foreground">{createStatus}</p>
              )}
            </div>
            <AlertDialogFooter className="border-t px-6 py-4 sm:justify-end">
              <AlertDialogCancel asChild>
                <Button variant="secondary">Cancel</Button>
              </AlertDialogCancel>
              <Button variant="outline" onClick={() => void handleCreate()}>
                Create Link
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {!isEmpty && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => {
            const payUrl = `${PAYMENT_LINK_BASE}/${link.id}`;
            return (
              <Card
                key={link.id}
                className="border-primary/25 transition-colors hover:bg-muted/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-2xl font-semibold">
                        {formatMoney(link.amountCents)}
                      </p>
                      {link.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant={
                          link.isReusable === "true" ? "default" : "secondary"
                        }
                      >
                        {link.isReusable === "true" ? "Reusable" : "One-time"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setDeleteOpen(link.id);
                          setDeleteStatus("");
                        }}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 rounded-md border bg-muted/30 px-3 py-2">
                    <code className="flex-1 truncate text-xs text-muted-foreground">
                      {payUrl}
                    </code>
                    <CopyButton text={payUrl} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isEmpty && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium">No payment links yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first payment link.
            </p>
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Create Link
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteOpen}
        onOpenChange={(open) => !open && setDeleteOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Link</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this payment link? This action
              cannot be undone.
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
              onClick={() => void handleDelete()}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
