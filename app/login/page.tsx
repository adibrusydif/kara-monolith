import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">
          Login to Kara Akademi Indonesia
        </h1>
        <LoginForm />
      </div>
    </div>
  );
} 