import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { EditorSnapshot } from "@/hooks/useEditHistory";

type HistoryTabProps = {
	history: EditorSnapshot[];
	onSaveCurrent: () => void;
	onRestore: (id: string) => void;
	onDelete: (id: string) => void;
	onClear: () => void;
};

const HistoryTab: React.FC<HistoryTabProps> = ({ history, onSaveCurrent, onRestore, onDelete, onClear }) => {
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-medium">Snapshots</h4>
				<div className="flex gap-2">
					<Button size="sm" onClick={onSaveCurrent}>Save current</Button>
					<Button size="sm" variant="outline" onClick={onClear} disabled={history.length === 0}>Clear</Button>
				</div>
			</div>
			<Separator />
			{history.length === 0 ? (
				<p className="text-sm text-muted-foreground">No snapshots yet. Save your current settings to create one.</p>
			) : (
				<ScrollArea className="h-[300px] pr-2">
					<div className="space-y-3">
						{history.map((item) => (
							<Card key={item.id}>
								<CardContent className="p-3 flex items-center gap-3">
									<div className="w-16 h-10 bg-muted rounded overflow-hidden flex items-center justify-center">
										{item.image ? (
											<img src={item.image} alt="snapshot" className="max-w-full max-h-full" />
										) : (
											<div className="text-[10px] text-muted-foreground">No image</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium truncate">{item.label || "Snapshot"}</div>
										<div className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</div>
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" onClick={() => onRestore(item.id)}>Restore</Button>
										<Button size="sm" variant="outline" onClick={() => onDelete(item.id)}>Delete</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</ScrollArea>
			)}
		</div>
	);
};

export default HistoryTab;

