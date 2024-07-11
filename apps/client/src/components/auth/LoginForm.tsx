import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import { useSendLoginOTPMutation } from '../../api/auth';

import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/error';

export function LoginForm() {
  const [sendLoginOtp, { isLoading }] = useSendLoginOTPMutation();
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const payload = await sendLoginOtp({ email }).unwrap();
      toast.success(payload.message);
      navigate('/a/verify-login-otp', { state: { email } });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleLoginFormSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="leafpetal@example.com"
              autoComplete="email"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This information is required to verify your identity. It is your
            responsibility to provide the correct information.
          </p>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Need help logging?{' '}
          <Link
            to={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
            className="text-blue-600 hover:underline"
          >
            Contact support
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
