import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterForm } from '../../lib/validations';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            await registerUser({ email: data.email, password: data.password });
            navigate('/login');
        } catch {
            setError('root', {
                message: 'Registration failed. Email may already be in use.',
            });
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Create Account
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

                    <Input
                        label="Confirm Password"
                        type="password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
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
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
