"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Check, X } from "lucide-react";
import { PurchaseOrder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface EmailParserProps {
    onOrderParsed: (order: PurchaseOrder) => void;
}

export function EmailParser({ onOrderParsed }: EmailParserProps) {
    const [emailText, setEmailText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedOrder, setParsedOrder] = useState<PurchaseOrder | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleParse = async () => {
        if (!emailText.trim()) return;

        setIsParsing(true);
        setError(null);
        setParsedOrder(null);

        try {
            const result = await api.orders.parseEmail(emailText);
            setParsedOrder(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = () => {
        if (parsedOrder) {
            onOrderParsed(parsedOrder);
            setParsedOrder(null);
            setEmailText("");
        }
    };

    const handleDiscard = () => {
        setParsedOrder(null);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Email Parser</CardTitle>
                <CardDescription>Paste a supplier email to extract PO details with AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Paste email content here..."
                    className="min-h-[200px]"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    disabled={isParsing || !!parsedOrder}
                />

                {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                        Error: {error}
                    </div>
                )}

                {parsedOrder && (
                    <div className="bg-slate-50 p-4 rounded-md border space-y-2">
                        <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            AI Extracted Result:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-slate-500">PO ID:</div>
                            <div className="font-medium">{parsedOrder.id}</div>

                            <div className="text-slate-500">Supplier:</div>
                            <div className="font-medium">{parsedOrder.supplier}</div>

                            <div className="text-slate-500">Status:</div>
                            <div><Badge variant="outline">{parsedOrder.status}</Badge></div>

                            <div className="text-slate-500">Items:</div>
                            <div className="font-medium col-span-2">{parsedOrder.items}</div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-2 border-t">
                            <Button onClick={handleSave} className="w-full" size="sm">
                                <Check className="w-4 h-4 mr-2" /> Accept & Save
                            </Button>
                            <Button onClick={handleDiscard} variant="outline" className="w-full" size="sm">
                                <X className="w-4 h-4 mr-2" /> Discard
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {!parsedOrder && (
                    <Button
                        onClick={handleParse}
                        disabled={isParsing || !emailText.trim()}
                        className="w-full"
                    >
                        {isParsing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Parsing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Parse with AI
                            </>
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
