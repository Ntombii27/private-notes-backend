import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import AuthLayout from '../components/AuthLayout.jsx';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) return setError('Your password needs at least 6 characters.');
    if (password !== confirm) return setError("Those passwords don't match.");

    setBusy(true);
    try {
      const res = await api.signup(email, password);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes about ten seconds."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-pine underline">Log in</Link></>}
    >
      {success ? (
        <div>
          <p role="status" className="text-sm">{success}</p>
          <Link to="/login" className="btn btn-primary mt-4 w-full">Go to log in</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" type="email" required autoComplete="email" className="field"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input id="password" type="password" required autoComplete="new-password" className="field"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="mt-1 text-xs text-muted">At least 6 characters.</p>
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium">Confirm password</label>
            <input id="confirm" type="password" required autoComplete="new-password" className="field"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>

          {error && <p role="alert" className="text-sm text-danger">{error}</p>}

          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
