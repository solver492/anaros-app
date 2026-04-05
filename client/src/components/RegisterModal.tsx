import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

// ─── Schémas de validation ───────────────────────────────────────────────────

const step1Schema = z.object({
  ownerFirstName: z.string().min(2, 'Prénom requis (min 2 car.)'),
  ownerLastName: z.string().min(2, 'Nom requis (min 2 car.)'),
  ownerPhone: z.string().min(8, 'Numéro de téléphone invalide'),
  ownerEmail: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe min 6 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const step2Schema = z.object({
  centerName: z.string().min(2, 'Nom du centre requis'),
  centerDescription: z.string().optional(),
  currency: z.string().min(1, 'Devise requise'),
  openingTime: z.string().min(1, 'Heure d\'ouverture requise'),
  closingTime: z.string().min(1, 'Heure de fermeture requise'),
  logoUrl: z.string().url('URL invalide').optional().or(z.literal('')),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;

// ─── Listes de référence ─────────────────────────────────────────────────────

const PROFESSIONS = [
  'Coiffeuse',
  'Esthéticienne',
  'Manucure',
  'Masseuse',
  'Maquilleuse',
  'Réceptionniste',
  'Directrice / Manager',
  'Autre',
];

const SERVICE_CATEGORIES = [
  'Coiffure',
  'Esthétique',
  'Manucure',
  'Massage',
  'Maquillage',
  'Soins du corps',
  'Épilation',
  'Onglerie',
];

const CURRENCIES = [
  { value: 'DA', label: 'Dinar Algérien (DA)' },
  { value: 'MAD', label: 'Dirham Marocain (MAD)' },
  { value: 'TND', label: 'Dinar Tunisien (TND)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dollar ($)' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  skills: string[];
}

// ─── Sous-composant employé ───────────────────────────────────────────────────

function EmployeeForm({
  index,
  employee,
  onChange,
  onRemove,
}: {
  index: number;
  employee: Employee;
  onChange: (emp: Employee) => void;
  onRemove: () => void;
}) {
  const toggleSkill = (skill: string) => {
    const newSkills = employee.skills.includes(skill)
      ? employee.skills.filter((s) => s !== skill)
      : [...employee.skills, skill];
    onChange({ ...employee, skills: newSkills });
  };

  return (
    <div className="border border-white/20 rounded-xl p-4 space-y-3 bg-white/10">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold text-sm">Employé(e) #{index + 1}</h4>
        {index > 0 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-300 hover:text-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-white/80 text-xs">Prénom</Label>
          <Input
            value={employee.firstName}
            onChange={(e) => onChange({ ...employee, firstName: e.target.value })}
            placeholder="Fatima"
            className="bg-white/20 border-white/30 text-white placeholder:text-white/40 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-white/80 text-xs">Nom</Label>
          <Input
            value={employee.lastName}
            onChange={(e) => onChange({ ...employee, lastName: e.target.value })}
            placeholder="Benali"
            className="bg-white/20 border-white/30 text-white placeholder:text-white/40 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-white/80 text-xs">Téléphone</Label>
        <Input
          value={employee.phone}
          onChange={(e) => onChange({ ...employee, phone: e.target.value })}
          placeholder="+212 6XX XXX XXX"
          className="bg-white/20 border-white/30 text-white placeholder:text-white/40 text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-white/80 text-xs">Profession / Spécialité</Label>
        <Select
          value={employee.profession}
          onValueChange={(v) => onChange({ ...employee, profession: v })}
        >
          <SelectTrigger className="bg-white/20 border-white/30 text-white text-sm">
            <SelectValue placeholder="Choisir..." />
          </SelectTrigger>
          <SelectContent>
            {PROFESSIONS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white/80 text-xs">Services pris en charge</Label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`${index}-${cat}`}
                checked={employee.skills.includes(cat)}
                onCheckedChange={() => toggleSkill(cat)}
                className="border-white/40 data-[state=checked]:bg-white/30"
              />
              <label
                htmlFor={`${index}-${cat}`}
                className="text-white/80 text-xs cursor-pointer"
              >
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Form | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([
    { firstName: '', lastName: '', phone: '', profession: '', skills: [] },
  ]);

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      ownerFirstName: '',
      ownerLastName: '',
      ownerPhone: '',
      ownerEmail: '',
      password: '',
      confirmPassword: '',
    },
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      centerName: '',
      centerDescription: '',
      currency: 'DA',
      openingTime: '09:00',
      closingTime: '20:00',
      logoUrl: '',
    },
  });

  const handleReset = () => {
    setStep(1);
    setStep1Data(null);
    setStep2Data(null);
    setEmployees([{ firstName: '', lastName: '', phone: '', profession: '', skills: [] }]);
    step1Form.reset();
    step2Form.reset();
  };

  const handleStep1Submit = step1Form.handleSubmit((data) => {
    setStep1Data(data);
    setStep(2);
  });

  const handleStep2Submit = step2Form.handleSubmit((data) => {
    setStep2Data(data);
    setStep(3);
  });

  const handleFinalSubmit = async (skipEmployees = false) => {
    if (!step1Data || !step2Data) return;
    setIsLoading(true);

    try {
      const payload = {
        // Propriétaire
        ownerFirstName: step1Data.ownerFirstName,
        ownerLastName: step1Data.ownerLastName,
        ownerPhone: step1Data.ownerPhone,
        ownerEmail: step1Data.ownerEmail,
        password: step1Data.password,
        // Centre
        centerName: step2Data.centerName,
        centerDescription: step2Data.centerDescription || null,
        currency: step2Data.currency,
        openingTime: step2Data.openingTime,
        closingTime: step2Data.closingTime,
        logoUrl: step2Data.logoUrl || null,
        // Employés
        employees: skipEmployees
          ? []
          : employees.filter((e) => e.firstName && e.lastName),
      };

      const res = await fetch('/api/tenants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de l\'inscription');
      }

      toast({
        title: '🎉 Centre créé avec succès !',
        description: `Bienvenue ${step2Data.centerName} ! Connectez-vous avec votre email.`,
      });

      onOpenChange(false);
      handleReset();
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = () => {
    setEmployees([...employees, { firstName: '', lastName: '', phone: '', profession: '', skills: [] }]);
  };

  const updateEmployee = (index: number, emp: Employee) => {
    const updated = [...employees];
    updated[index] = emp;
    setEmployees(updated);
  };

  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) handleReset(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/10 border border-white/30 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            Créer votre centre de beauté
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {step === 1 && 'Vos informations personnelles'}
            {step === 2 && 'Informations de votre centre'}
            {step === 3 && 'Votre équipe (optionnel)'}
          </DialogDescription>
        </DialogHeader>

        {/* Indicateur étapes */}
        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= s
                    ? 'bg-white/40 text-white border border-white/60'
                    : 'bg-white/10 text-white/40 border border-white/20'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-2 rounded transition-all ${step > s ? 'bg-white/50' : 'bg-white/15'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ─── ÉTAPE 1 — Infos propriétaire ─── */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Prénom *</Label>
                <Input
                  {...step1Form.register('ownerFirstName')}
                  placeholder="Mohamed"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
                />
                {step1Form.formState.errors.ownerFirstName && (
                  <p className="text-red-300 text-xs">{step1Form.formState.errors.ownerFirstName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Nom *</Label>
                <Input
                  {...step1Form.register('ownerLastName')}
                  placeholder="Benali"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
                />
                {step1Form.formState.errors.ownerLastName && (
                  <p className="text-red-300 text-xs">{step1Form.formState.errors.ownerLastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Téléphone *</Label>
              <Input
                {...step1Form.register('ownerPhone')}
                placeholder="+212 6XX XXX XXX"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
              {step1Form.formState.errors.ownerPhone && (
                <p className="text-red-300 text-xs">{step1Form.formState.errors.ownerPhone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Email (identifiant de connexion) *</Label>
              <Input
                {...step1Form.register('ownerEmail')}
                type="email"
                placeholder="contact@moncentre.com"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
              {step1Form.formState.errors.ownerEmail && (
                <p className="text-red-300 text-xs">{step1Form.formState.errors.ownerEmail.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Mot de passe *</Label>
              <Input
                {...step1Form.register('password')}
                type="password"
                placeholder="••••••••"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
              {step1Form.formState.errors.password && (
                <p className="text-red-300 text-xs">{step1Form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Confirmer le mot de passe *</Label>
              <Input
                {...step1Form.register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
              {step1Form.formState.errors.confirmPassword && (
                <p className="text-red-300 text-xs">{step1Form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-white/30 hover:bg-white/40 text-white border border-white/50">
                Suivant <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ─── ÉTAPE 2 — Infos centre ─── */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Nom du centre *</Label>
              <Input
                {...step2Form.register('centerName')}
                placeholder="Institut Beauty Star"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
              {step2Form.formState.errors.centerName && (
                <p className="text-red-300 text-xs">{step2Form.formState.errors.centerName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Description (optionnel)</Label>
              <Input
                {...step2Form.register('centerDescription')}
                placeholder="Votre oasis de beauté..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Devise *</Label>
              <Select
                defaultValue={step2Form.getValues('currency') || 'DA'}
                onValueChange={(v) => step2Form.setValue('currency', v)}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Heure d'ouverture *</Label>
                <Input
                  {...step2Form.register('openingTime')}
                  type="time"
                  className="bg-white/20 border-white/30 text-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Heure de fermeture *</Label>
                <Input
                  {...step2Form.register('closingTime')}
                  type="time"
                  className="bg-white/20 border-white/30 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-white/90 text-sm">URL du logo (optionnel)</Label>
              <Input
                {...step2Form.register('logoUrl')}
                placeholder="https://..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
              />
              {step2Form.formState.errors.logoUrl && (
                <p className="text-red-300 text-xs">{step2Form.formState.errors.logoUrl.message}</p>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
              <Button type="submit" className="bg-white/30 hover:bg-white/40 text-white border border-white/50">
                Suivant <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ─── ÉTAPE 3 — Employés ─── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {employees.map((emp, index) => (
                <EmployeeForm
                  key={index}
                  index={index}
                  employee={emp}
                  onChange={(e) => updateEmployee(index, e)}
                  onRemove={() => removeEmployee(index)}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={addEmployee}
              className="w-full text-white/70 hover:text-white hover:bg-white/10 border border-dashed border-white/30"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un(e) autre employé(e)
            </Button>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(2)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleFinalSubmit(true)}
                  disabled={isLoading}
                  className="text-white/60 hover:text-white hover:bg-white/10 text-sm"
                >
                  Ignorer
                </Button>
                <Button
                  type="button"
                  onClick={() => handleFinalSubmit(false)}
                  disabled={isLoading}
                  className="bg-white/30 hover:bg-white/40 text-white border border-white/50"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</>
                  ) : (
                    'Finaliser'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
