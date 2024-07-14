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

import { useMeQuery, useUpdateUserMutation } from '../../api/auth';

import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/error';
import { selectIsProfileUpdated, setUser } from '../../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';

interface User {
  _id: string;
  name: string;
  admissionNumber: string;
}

export function UpdateUserForm() {
  const { data: { user } = {} } = useMeQuery<{ data: { user: User } }>({});
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useDispatch();
  const isProfileUpdated = useSelector(selectIsProfileUpdated);
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const admissionNumber = formData.get('admissionNumber') as string;

    try {
      const payload = await updateUser({ name, admissionNumber }).unwrap();
      toast.success(payload.message);
      dispatch(setUser(payload.user));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  const handleNavigateToHome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Update Profile</CardTitle>
        <CardDescription>
          Update your name and admission number to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleLoginFormSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              required
              defaultValue={user?.name}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admissionNumber">Admission Number</Label>
            <Input
              type="text"
              name="admissionNumber"
              id="admissionNumber"
              placeholder="Enter your admission number"
              required
              defaultValue={user?.admissionNumber}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This information is required to verify your identity. It is your
            responsibility to provide the correct information.
          </p>
          <Button
            size="sm"
            type="submit"
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
        {isProfileUpdated && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={handleNavigateToHome}
            className="mt-4 w-full"
          >
            Continue to Home
          </Button>
        )}
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
