import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginForm } from '../../lib/validations';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            await login(data);
            navigate('/');
        } catch {
            setError('root', { message: 'Invalid email or password' });
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Sign In
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        placeholder="you@example.com"
                    />

                    <Input
                        label="Password"
                        type="password"
                        {...register('password')}
                        error={errors.password?.message}
                        placeholder="••••••••"
                    />

                    {errors.root && (
                        <p className="text-sm text-red-600 text-center">
                            {errors.root.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
