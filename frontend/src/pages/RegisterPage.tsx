/**
 * User registration page component.
 * 
 * Provides user account creation with form validation
 * and automatic login after successful registration.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types/auth';
import { validateEmail, validatePassword, validateRequired, validateForm } from '../utils/validators';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();

    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear field-specific errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: [] }));
        }
    };

    const validateFormData = () => {
        const validationRules = {
            email: (value: string) => validateEmail(value),
            password: (value: string) => validatePassword(value),
            first_name: (value: string) => validateRequired(value, 'First name'),
            last_name: (value: string) => validateRequired(value, 'Last name'),
        };

        return validateForm(formData, validationRules);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        // Validate form data
        const validation = validateFormData();
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        try {
            await register(formData);
            navigate('/events');
        } catch (err: any) {
            setApiError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-600 mt-2">Start reserving tickets today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            error={errors.first_name?.[0]}
                            required
                            fullWidth
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            error={errors.last_name?.[0]}
                            required
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email?.[0]}
                        required
                        fullWidth
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password?.[0]}
                        helperText="Must be at least 8 characters with uppercase, lowercase, and number"
                        required
                        fullWidth
                    />

                    {apiError && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                            {apiError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={isLoading}
                        fullWidth
                    >
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-2">Registration Benefits:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p>• Reserve tickets for events</p>
                        <p>• Manage your reservations</p>
                        <p>• Secure payment processing</p>
                        <p>• Reservation history and receipts</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RegisterPage;