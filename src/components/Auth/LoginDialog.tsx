import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type LoginDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
	const { signInLocal, signInWithGoogle } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign in</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 mt-2">
					<div className="space-y-2">
						<label className="text-sm font-medium">Name</label>
						<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Email (optional)</label>
						<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
					</div>
					<Button className="w-full" disabled={!name.trim()} onClick={() => { signInLocal(name.trim(), email.trim() || undefined); onOpenChange(false); }}>Continue</Button>
					{signInWithGoogle && (
						<Button className="w-full" variant="outline" onClick={async () => { await signInWithGoogle(); onOpenChange(false); }}>Sign in with Google</Button>
					)}
					<p className="text-xs text-muted-foreground">Your data stays in your browser. Google sign-in is optional.</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LoginDialog;

