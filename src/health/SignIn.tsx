import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const SignIn: React.FC = () => {
  const [pass, setPass] = useState('')
  const nav = useNavigate()
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pass && pass === import.meta.env.VITE_HEALTH_PASS) {
      localStorage.setItem('hp_token', pass); nav('/health')
    } else { alert('Invalid passphrase.') }
  }
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-2">Sign in to Health Profile</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter passphrase" className="w-full border rounded-lg px-3 py-2" />
        <button className="w-full bg-brand-primary text-white rounded-lg px-3 py-2">Sign in</button>
      </form>
    </div>
  )
}
export default SignIn
