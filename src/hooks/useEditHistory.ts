import { useCallback, useEffect, useMemo, useState } from "react";

export type EditorSnapshot = {
	id: string;
	createdAt: number;
	label?: string;
	// Core editor state
	image: string | null;
	logo: string | null;
	padding: number;
	showPadding: boolean;
	borderRadius: number;
	shadow: number;
	inset: boolean;
	logoSize: number;
	logoPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-bottom";
	imageSize: number;
	backgroundType: "gradient" | "plain" | "image";
	selectedBackground: { name: string; value: string; class: string };
	backgroundImage: string | null;
};

export type UseEditHistory = {
	history: EditorSnapshot[];
	saveSnapshot: (snapshot: Omit<EditorSnapshot, "id" | "createdAt">, label?: string) => void;
	deleteSnapshot: (id: string) => void;
	clearHistory: () => void;
	getSnapshot: (id: string) => EditorSnapshot | undefined;
};

export function useEditHistory(userId: string | undefined): UseEditHistory {
	const storageKey = useMemo(() => `editHistory:${userId || "guest"}`, [userId]);
	const [history, setHistory] = useState<EditorSnapshot[]>([]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey);
			setHistory(raw ? (JSON.parse(raw) as EditorSnapshot[]) : []);
		} catch {
			setHistory([]);
		}
	}, [storageKey]);

	useEffect(() => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(history));
		} catch {}
	}, [history, storageKey]);

	const saveSnapshot = useCallback(
		(snapshot: Omit<EditorSnapshot, "id" | "createdAt">, label?: string) => {
			const entry: EditorSnapshot = {
				...snapshot,
				id: `snap_${Math.random().toString(36).slice(2, 10)}`,
				createdAt: Date.now(),
				label,
			};
			setHistory((prev) => [entry, ...prev].slice(0, 100));
		},
		[]
	);

	const deleteSnapshot = useCallback((id: string) => {
		setHistory((prev) => prev.filter((s) => s.id !== id));
	}, []);

	const clearHistory = useCallback(() => {
		setHistory([]);
	}, []);

	const getSnapshot = useCallback(
		(id: string) => history.find((s) => s.id === id),
		[history]
	);

	return { history, saveSnapshot, deleteSnapshot, clearHistory, getSnapshot };
}

