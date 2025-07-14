import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import UserType from '../types/UserType';

interface SignInProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const Profile: React.FC<SignInProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {

        const res = await fetch('https://dev-api.quientiene.com/api/v1/profile', {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (res.ok) {
          const data = (await res.json()) as unknown;
          // Optionally, add runtime validation for data here
          const userData = data as {
            email: string;
            password: string;
            confirm_password: string;
            phone: string;
            store_name: string;
            store_uid: string;
          };
          setUser({
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirm_password,
            phone: userData.phone,
            storeName: userData.store_name,
            storeUid: userData.store_uid,
          } as UserType);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [navigate, setIsAuthenticated]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Profile</h1>
      {user && <UserForm user={user} />}
    </div>
  );
};

export default Profile;
