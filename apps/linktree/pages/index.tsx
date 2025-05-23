import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '../src/components/ui/input';
import { Button } from '../src/components/ui/button';
import { Label } from '../src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'iamgbayer' && password === 'g123g') {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              data-cy="login-username-input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-cy="login-password-input"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full" data-cy="login-submit-button">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 