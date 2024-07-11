import AuthLayout from './AuthLayout';
import { UpdateUserForm } from '../../components/auth/UpdateUserForm';

const UpdateUser = () => {
  return (
    <AuthLayout redirect={false}>
      <UpdateUserForm />
    </AuthLayout>
  );
};

export default UpdateUser;
