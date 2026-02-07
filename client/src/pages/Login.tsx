import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const success = await login(data);
      if (success) {
        toast({
          title: 'Bienvenue!',
          description: 'Connexion réussie',
        });
        setLocation('/');
      } else {
        toast({
          title: 'Erreur',
          description: 'Email ou mot de passe incorrect',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" style={{ zIndex: 1 }} />

      {/* Animated Leaves */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 2, pointerEvents: 'none' }}>
        <div className="absolute w-full h-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${20 + (i * 10)}%`,
                animation: `fall ${12 + (i * 2)}s linear infinite`,
              }}
            >
              <img
                src={`/leaf_0${((i - 1) % 4) + 1}.png`}
                alt="leaf"
                className="w-12 h-12 opacity-70"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-md mb-4 border border-white/50 overflow-hidden">
              <img src="/logo.jpg" alt="Anaros Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Anaros</h1>
            <p className="text-white/80 text-sm">Centre de Beauté - Gestion</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90 text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="admin@anaros.com"
                          data-testid="input-email"
                          className="bg-white/20 border border-white/30 text-white placeholder:text-white/50 rounded-lg focus:bg-white/30 focus:border-white/50 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90 text-sm font-medium">Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          data-testid="input-password"
                          className="bg-white/20 border border-white/30 text-white placeholder:text-white/50 rounded-lg focus:bg-white/30 focus:border-white/50 transition-all pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg backdrop-blur-md border border-white/50 transition-all duration-300 py-2.5 mt-6"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-white/70 text-xs">
              Demo: admin@anaros.com / admin123
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fall {
          0% {
            opacity: 0;
            top: -10%;
            transform: translateX(20px) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          20% {
            transform: translateX(-20px) rotate(45deg);
          }
          40% {
            transform: translateX(-20px) rotate(90deg);
          }
          60% {
            transform: translateX(20px) rotate(180deg);
          }
          80% {
            transform: translateX(-20px) rotate(45deg);
          }
          100% {
            opacity: 0;
            top: 110%;
            transform: translateX(20px) rotate(225deg);
          }
        }
      `}</style>
    </div>
  );
}
