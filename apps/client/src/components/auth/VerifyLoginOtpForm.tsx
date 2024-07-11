import { Link, Navigate, useLocation } from 'react-router-dom';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

import { useLoginMutation } from '../../api/auth';

import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/auth';
import { getErrorMessage } from '../../utils/error';

export function VerifyLoginOtpForm() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const location = useLocation();

  const email = location.state?.email as string;

  if (!email) {
    return <Navigate to="/login" />;
  }

  const handleVerifyOTPFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const otp = formData.get('otp') as string;

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      const payload = await login({ email, otp }).unwrap();
      toast.success(payload.message);
      dispatch(setCredentials(payload));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Verify OTP</CardTitle>
        <CardDescription>
          Enter the one time login password sent to <strong>{email}</strong> to
          login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleVerifyOTPFormSubmit}>
          <div className="flex justify-center my-4 mb-8">
            <InputOTP maxLength={6} name="otp" id="otp" required>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
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
