import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function ResetPassword() {
  const [ready,setReady]=useState(false); const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState(''); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
  useEffect(()=>{ const recovery=new URLSearchParams(window.location.hash.slice(1)).get('type')==='recovery'; const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setReady(true);}); if(recovery) void supabase.auth.getUser().then(({data})=>setReady(Boolean(data.user))); return ()=>subscription.unsubscribe(); },[]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(password!==confirm){setMessage('Passwords do not match.');return;}setBusy(true); const {error}=await supabase.auth.updateUser({password});setMessage(error?error.message:'Password updated. You can sign in now.');setBusy(false);};
  return <main className="container max-w-md px-5 py-16 min-h-[65vh]"><h1 className="text-3xl font-bold mb-8">Reset password</h1>{ready?<form onSubmit={submit} className="space-y-5"><Label htmlFor="newPassword">New password</Label><Input id="newPassword" type="password" minLength={6} maxLength={100} autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)}/><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" type="password" minLength={6} autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/><Button disabled={busy} type="submit">Update password</Button></form>:<p className="text-muted-foreground">Open the password reset link from your email.</p>}{message&&<p role="status" className="text-sm mt-5">{message}</p>}<Link className="block text-primary text-sm mt-6" to="/player-login">Back to player sign-in</Link></main>;
}