import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignIn: React.FC = () => {
  const [pass, setPass] = useState('')
  const nav = useNavigate()
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const envPass = import.meta.env.VITE_HEALTH_PASS;
    
    // Check if envPass exists before trimming to avoid crash
    if (pass && envPass && pass.trim() === envPass.trim()) {
      localStorage.setItem('hp_token', pass.trim()); nav('/health')
    } else { alert('Invalid passphrase.') }
  }
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-2">Sign in to Portal</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter access key" className="w-full border rounded-lg px-3 py-2" />
        <button className="w-full bg-brand-primary text-white rounded-lg px-3 py-2">Sign in</button>
      </form>
    </div>
  )
}
export default SignIn
