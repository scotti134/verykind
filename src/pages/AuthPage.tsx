import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import PasswordResetForm from '../components/PasswordResetForm';

interface AuthPageProps {
  onNavigateToDashboard: () => void;
}

type AuthView = 'login' | 'signup' | 'reset';

export default function AuthPage({ onNavigateToDashboard }: AuthPageProps) {
  const [view, setView] = useState<AuthView>('login');

  if (view === 'reset') {
    return <PasswordResetForm onCancel={() => setView('login')} />;
  }

  return view === 'login' ? (
    <LoginForm
      onSwitchToSignUp={() => setView('signup')}
      onSwitchToPasswordReset={() => setView('reset')}
      onSuccess={onNavigateToDashboard}
    />
  ) : (
    <SignUpForm
      onSwitchToLogin={() => setView('login')}
      onSuccess={onNavigateToDashboard}
    />
  );
}
