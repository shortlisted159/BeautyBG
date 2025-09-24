import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
	id: string;
	name: string;
	email?: string;
	avatarUrl?: string;
	isAnonymous?: boolean;
};

type AuthContextValue = {
	user: AuthUser | null;
	signInLocal: (name: string, email?: string) => void;
	signOut: () => void;
	// Optional Google sign-in if VITE_GOOGLE_CLIENT_ID is set
	signInWithGoogle?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "auth:user";

function generateGuestId(): string {
	return `guest_${Math.random().toString(36).slice(2, 10)}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (raw) {
				setUser(JSON.parse(raw));
			} else {
				// Start as anonymous session so we can scope local history per device
				const guest: AuthUser = { id: generateGuestId(), name: "Guest", isAnonymous: true };
				setUser(guest);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guest));
			}
		} catch {}
	}, []);

	const signInLocal = (name: string, email?: string) => {
		const newUser: AuthUser = {
			id: `local_${Math.random().toString(36).slice(2, 10)}`,
			name,
			email,
			isAnonymous: false,
			avatarUrl: name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}` : undefined,
		};
		setUser(newUser);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
	};

	const signOut = () => {
		const guest: AuthUser = { id: generateGuestId(), name: "Guest", isAnonymous: true };
		setUser(guest);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guest));
	};

	// Optional Google Identity Services integration (client-only)
	const signInWithGoogle = useMemo(() => {
		const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined;
		if (!clientId) return undefined;
		return async () => {
			await loadGoogleScript();
			return new Promise<void>((resolve, reject) => {
				// @ts-ignore
				if (!window.google || !window.google.accounts || !window.google.accounts.id) {
					return reject(new Error("Google Identity Services not available"));
				}
				// @ts-ignore
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: (response: any) => {
						try {
							const credential = response.credential as string;
							// Parse JWT payload (no verification client-side; for demo only)
							const payload = JSON.parse(atob(credential.split(".")[1]));
							const profileName: string = payload.name || payload.email || "Google User";
							const newUser: AuthUser = {
								id: `google_${payload.sub}`,
								name: profileName,
								email: payload.email,
								avatarUrl: payload.picture,
								isAnonymous: false,
							};
							setUser(newUser);
							localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
							resolve();
						} catch (e) {
							reject(e);
						}
					},
				});
				// @ts-ignore
				window.google.accounts.id.prompt();
			});
		};
	}, []);

	const value: AuthContextValue = {
		user,
		signInLocal,
		signOut,
		signInWithGoogle,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

async function loadGoogleScript(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.getElementById("google-identity")) return resolve();
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.id = "google-identity";
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Google script"));
		document.body.appendChild(script);
	});
}

