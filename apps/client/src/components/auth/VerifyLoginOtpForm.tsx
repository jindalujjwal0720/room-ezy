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

import { useLoginMutation, useSendLoginOTPMutation } from '../../api/auth';

import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/auth';
import { getErrorMessage } from '../../utils/error';
import { useTimer } from '../../hooks/useTimer';
import { useEffect, useState } from 'react';

export function VerifyLoginOtpForm() {
  const [login, { isLoading }] = useLoginMutation();
  const [sendLoginOTP] = useSendLoginOTPMutation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [numberOfRequests, setNumberOfRequests] = useState(0);
  const { time: timeLeft, start: startTimer, reset: resetTimer } = useTimer(60);

  useEffect(() => {
    if (timeLeft > 0) {
      startTimer();
    }
  }, [timeLeft, startTimer]);

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

  const handleResendOTP = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();

    if (numberOfRequests >= 3) {
      toast.error(
        'There might be an issue with your email. Please contact support'
      );
      return;
    }

    if (timeLeft > 0) {
      toast.error('Please wait before requesting another OTP');
      return;
    }

    resetTimer((numberOfRequests + 1) * 60);
    setNumberOfRequests((prev) => prev + 1);
    startTimer();

    try {
      const payload = await sendLoginOTP({ email }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      resetTimer(0);
      toast.error(getErrorMessage(error));
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
          Didn't receive the OTP?{' '}
          <span
            onClick={handleResendOTP}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
          </span>
        </div>
        <div className="mt-4 text-center text-sm">
          Need help logging?{' '}
          <Link
            to={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Contact support
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
