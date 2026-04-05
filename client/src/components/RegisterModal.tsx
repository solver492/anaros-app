import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// ─── CATALOGUE PAR DÉFAUT ─────────────────────────────────────────────────────

const DEFAULT_CATALOG: Record<string, Array<{ name: string; price: number; duration: number }>> = {
  'Onglerie': [
    { name: 'Vernis semi permanent mains', price: 3000, duration: 45 },
    { name: 'Vernis semi permanent pieds', price: 3500, duration: 45 },
    { name: 'Gel mains', price: 3500, duration: 60 },
    { name: 'Gel pieds', price: 4000, duration: 60 },
    { name: 'Capsules', price: 4500, duration: 90 },
    { name: 'Extension chablon', price: 6000, duration: 120 },
    { name: 'Remplissage', price: 3500, duration: 60 },
    { name: 'Réparation ongle vsp', price: 200, duration: 15 },
    { name: 'Réparation ongle gel', price: 300, duration: 15 },
    { name: 'French ou Baby-boomer', price: 1000, duration: 30 },
  ],
  'Manucure': [
    { name: 'Manucure Thuya', price: 3500, duration: 45 },
    { name: 'Manucure à la paraffine', price: 4000, duration: 60 },
  ],
  'Pédicure': [
    { name: 'Pédicure Thuya', price: 4500, duration: 60 },
    { name: 'Pédicure complète à la paraffine', price: 5000, duration: 90 },
    { name: 'Peeling pieds', price: 6500, duration: 120 },
  ],
  'Hammam': [
    { name: 'Rituel Traditionnel', price: 2800, duration: 60 },
    { name: 'Rituel Royal', price: 3800, duration: 90 },
    { name: 'Rituel Impérial', price: 4800, duration: 120 },
    { name: 'Rituel Sultana', price: 7000, duration: 150 },
  ],
  'Massage': [
    { name: 'Massage anti-douleur', price: 6500, duration: 60 },
    { name: 'Massage anti-stress', price: 6500, duration: 60 },
    { name: 'Massage relaxant', price: 5000, duration: 60 },
    { name: 'Massage drainage lymphatique', price: 6500, duration: 60 },
    { name: 'Massage Pierre chaude', price: 7500, duration: 90 },
    { name: 'Massage drainage lifting Colombien', price: 8500, duration: 90 },
    { name: 'Massage madérothérapie', price: 10000, duration: 90 },
    { name: 'Rituel Anaros gommage massage', price: 6500, duration: 90 },
    { name: 'Massage protocole jambe lourde', price: 6500, duration: 60 },
    { name: 'Massage dos et jambes', price: 4500, duration: 60 },
    { name: 'Massage dos', price: 3000, duration: 45 },
    { name: 'Massage Femme enceinte', price: 5500, duration: 60 },
    { name: 'Massage Turc', price: 7500, duration: 90 },
  ],
  'Soins du visage': [
    { name: 'Beauty flash visage et yeux', price: 4000, duration: 60 },
    { name: 'Soin marin aux 3 algues', price: 6000, duration: 75 },
    { name: 'Rituel source marine peau déshydratée', price: 6500, duration: 75 },
    { name: 'Rituel cold cream peau sèche', price: 6500, duration: 75 },
    { name: 'Soin combleur hyaluronic rides profondes', price: 9500, duration: 90 },
    { name: 'Soin sullicium super lift rides', price: 10500, duration: 90 },
    { name: 'Cure Peeling grade 1 éclat', price: 9500, duration: 90 },
    { name: 'Cure Peeling grade 2 rides et pores', price: 9500, duration: 90 },
    { name: 'Egyptian rose éclat et hydratation', price: 15000, duration: 90 },
    { name: 'Hyaluronic Acid hydratant', price: 15000, duration: 90 },
    { name: 'Hydraskin coreen', price: 15000, duration: 90 },
    { name: 'Hydraskin esthemax', price: 20000, duration: 90 },
  ],
  'Coiffure': [
    { name: 'Brushing cheveux courts', price: 1000, duration: 30 },
    { name: 'Brushing cheveux mi-longs', price: 1500, duration: 45 },
    { name: 'Brushing cheveux longs', price: 2000, duration: 60 },
    { name: 'Brushing cheveux très longs', price: 2500, duration: 75 },
    { name: 'Coiffure simple', price: 5000, duration: 60 },
    { name: 'Coiffure travaillée', price: 12000, duration: 120 },
    { name: 'Coiffure mariée', price: 15000, duration: 180 },
    { name: 'Balayage cheveux courts', price: 15000, duration: 120 },
    { name: 'Balayage cheveux longs', price: 21000, duration: 180 },
    { name: 'Coloration complète', price: 5000, duration: 90 },
    { name: 'Kératine', price: 15000, duration: 180 },
    { name: 'Shampooing L\'Oréal', price: 500, duration: 15 },
  ],
  'Maquillage': [
    { name: 'Maquillage jour', price: 4500, duration: 45 },
    { name: 'Maquillage soirée', price: 6000, duration: 60 },
    { name: 'Maquillage mariée', price: 10000, duration: 120 },
    { name: 'Faux cils', price: 1000, duration: 20 },
  ],
  'Épilation': [
    { name: 'Épilation sourcils', price: 500, duration: 15 },
    { name: 'Épilation lèvre', price: 300, duration: 10 },
    { name: 'Épilation jambes', price: 2000, duration: 30 },
    { name: 'Épilation aisselles', price: 800, duration: 20 },
    { name: 'Épilation maillot', price: 1000, duration: 20 },
    { name: 'Épilation corps complet', price: 4000, duration: 60 },
  ],
};

const CATEGORY_NAMES = Object.keys(DEFAULT_CATALOG);

const PROFESSIONS = [
  'Coiffeuse', 'Esthéticienne', 'Ongliste', 'Masseuse',
  'Maquilleuse', 'Réceptionniste', 'Directrice / Manager', 'Autre',
];

const CURRENCIES = [
  { value: 'DA', label: 'Dinar Algérien (DA)' },
  { value: 'MAD', label: 'Dirham Marocain (MAD)' },
  { value: 'TND', label: 'Dinar Tunisien (TND)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dollar ($)' },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Prestation {
  name: string;
  price: number;
  duration: number;
}

interface ServiceCategory {
  name: string;
  checked: boolean;
  expanded: boolean;
  prestations: Prestation[];
}

interface Employee {
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  serviceNames: string[]; // noms de prestations assignées
}

// ─── SCHÉMAS ZOD ─────────────────────────────────────────────────────────────

const step1Schema = z.object({
  ownerFirstName: z.string().min(2, 'Prénom requis (min 2 car.)'),
  ownerLastName: z.string().min(2, 'Nom requis (min 2 car.)'),
  ownerPhone: z.string().min(8, 'Numéro de téléphone invalide'),
  ownerEmail: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe min 6 caractères'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
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

// ─── COMPOSANT PRESTATION ROW ─────────────────────────────────────────────────

function PrestationRow({
  prestation,
  currency,
  onChange,
  onRemove,
}: {
  prestation: Prestation;
  currency: string;
  onChange: (p: Prestation) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Input
        value={prestation.name}
        onChange={e => onChange({ ...prestation, name: e.target.value })}
        placeholder="Nom de la prestation"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-xs flex-1"
      />
      <div className="flex items-center gap-1 w-28">
        <Input
          type="number"
          value={prestation.price}
          onChange={e => onChange({ ...prestation, price: Number(e.target.value) })}
          className="bg-white/10 border-white/20 text-white text-xs w-20"
          min={0}
        />
        <span className="text-white/60 text-xs whitespace-nowrap">{currency}</span>
      </div>
      <div className="flex items-center gap-1 w-20">
        <Input
          type="number"
          value={prestation.duration}
          onChange={e => onChange({ ...prestation, duration: Number(e.target.value) })}
          className="bg-white/10 border-white/20 text-white text-xs w-14"
          min={5}
        />
        <span className="text-white/60 text-xs">min</span>
      </div>
      <button type="button" onClick={onRemove} className="text-red-300 hover:text-red-100 flex-shrink-0">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export function RegisterModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Data from each step
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Form | null>(null);

  // Step 3 — Service categories
  const [categories, setCategories] = useState<ServiceCategory[]>(
    CATEGORY_NAMES.map(name => ({ name, checked: false, expanded: false, prestations: [] }))
  );

  // Step 4 — Employees
  const [employees, setEmployees] = useState<Employee[]>([
    { firstName: '', lastName: '', phone: '', profession: '', serviceNames: [] },
  ]);

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: { ownerFirstName: '', ownerLastName: '', ownerPhone: '', ownerEmail: '', password: '', confirmPassword: '' },
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: { centerName: '', centerDescription: '', currency: 'DA', openingTime: '09:00', closingTime: '20:00', logoUrl: '' },
  });

  const currency = step2Data?.currency || step2Form.watch('currency') || 'DA';

  const handleReset = () => {
    setStep(1); setStep1Data(null); setStep2Data(null);
    setCategories(CATEGORY_NAMES.map(name => ({ name, checked: false, expanded: false, prestations: [] })));
    setEmployees([{ firstName: '', lastName: '', phone: '', profession: '', serviceNames: [] }]);
    step1Form.reset(); step2Form.reset();
  };

  // Step 3 helpers
  const toggleCategory = (name: string) => {
    setCategories(prev => prev.map(c => {
      if (c.name !== name) return c;
      if (!c.checked) {
        // Cocher → charger les prestations par défaut + ouvrir
        return { ...c, checked: true, expanded: true, prestations: [...DEFAULT_CATALOG[name]] };
      }
      return { ...c, checked: false, expanded: false, prestations: [] };
    }));
  };

  const toggleExpand = (name: string) => {
    setCategories(prev => prev.map(c => c.name === name ? { ...c, expanded: !c.expanded } : c));
  };

  const updatePrestation = (catName: string, idx: number, p: Prestation) => {
    setCategories(prev => prev.map(c => {
      if (c.name !== catName) return c;
      const newP = [...c.prestations];
      newP[idx] = p;
      return { ...c, prestations: newP };
    }));
  };

  const removePrestation = (catName: string, idx: number) => {
    setCategories(prev => prev.map(c => {
      if (c.name !== catName) return c;
      return { ...c, prestations: c.prestations.filter((_, i) => i !== idx) };
    }));
  };

  const addPrestation = (catName: string) => {
    setCategories(prev => prev.map(c => {
      if (c.name !== catName) return c;
      return { ...c, prestations: [...c.prestations, { name: '', price: 0, duration: 30 }] };
    }));
  };

  // All available prestations for step 4 assignment
  const allPrestations = categories
    .filter(c => c.checked)
    .flatMap(c => c.prestations.map(p => ({ catName: c.name, ...p })));

  // Step 4 helpers
  const updateEmployee = (idx: number, emp: Employee) => {
    const updated = [...employees];
    updated[idx] = emp;
    setEmployees(updated);
  };

  const removeEmployee = (idx: number) => setEmployees(employees.filter((_, i) => i !== idx));

  const toggleEmployeeService = (empIdx: number, svcName: string) => {
    const emp = employees[empIdx];
    const newNames = emp.serviceNames.includes(svcName)
      ? emp.serviceNames.filter(n => n !== svcName)
      : [...emp.serviceNames, svcName];
    updateEmployee(empIdx, { ...emp, serviceNames: newNames });
  };

  // Final submit
  const handleSubmit = async (skipEmployees = false) => {
    if (!step1Data || !step2Data) return;
    setIsLoading(true);
    try {
      const serviceCategories = categories.filter(c => c.checked && c.prestations.length > 0).map(c => ({
        name: c.name,
        services: c.prestations.filter(p => p.name.trim()),
      }));

      const payload = {
        ...step1Data, ...step2Data,
        serviceCategories,
        employees: skipEmployees ? [] : employees.filter(e => e.firstName && e.lastName).map(e => ({
          firstName: e.firstName,
          lastName: e.lastName,
          phone: e.phone,
          profession: e.profession,
          serviceNames: e.serviceNames,
          password: e.firstName.toLowerCase().trim() + '123',
        })),
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

      toast({ title: '🎉 Centre créé avec succès !', description: `Bienvenue ${step2Data.centerName} ! Connectez-vous avec votre email.` });
      onOpenChange(false);
      handleReset();
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const STEPS = ['Propriétaire', 'Centre', 'Services', 'Équipe'];

  return (
    <Dialog open={open} onOpenChange={o => { onOpenChange(o); if (!o) handleReset(); }}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto backdrop-blur-xl bg-white/10 border border-white/30 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            Créer votre centre de beauté
          </DialogTitle>
          <DialogDescription className="text-white/70">{STEPS[step - 1]}</DialogDescription>
        </DialogHeader>

        {/* Indicateur étapes */}
        <div className="flex items-center gap-1 py-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${step === i + 1 ? 'bg-white/40 text-white border border-white/60' : step > i + 1 ? 'bg-white/20 text-white/80' : 'text-white/40'}`}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs border border-current">{i + 1}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 rounded ${step > i + 1 ? 'bg-white/50' : 'bg-white/15'}`} />}
            </div>
          ))}
        </div>

        {/* ─── ÉTAPE 1 — Propriétaire ─── */}
        {step === 1 && (
          <form onSubmit={step1Form.handleSubmit(d => { setStep1Data(d); setStep(2); })} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[['ownerFirstName', 'Prénom *', 'Mohamed'], ['ownerLastName', 'Nom *', 'Benali']].map(([name, label, ph]) => (
                <div key={name} className="space-y-1">
                  <Label className="text-white/90 text-sm">{label}</Label>
                  <Input {...step1Form.register(name as any)} placeholder={ph} className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
                  {(step1Form.formState.errors as any)[name] && <p className="text-red-300 text-xs">{(step1Form.formState.errors as any)[name].message}</p>}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Téléphone *</Label>
              <Input {...step1Form.register('ownerPhone')} placeholder="+213 6XX XXX XXX" className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
              {step1Form.formState.errors.ownerPhone && <p className="text-red-300 text-xs">{step1Form.formState.errors.ownerPhone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Email (identifiant de connexion) *</Label>
              <Input {...step1Form.register('ownerEmail')} type="email" placeholder="contact@moncentre.com" className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
              {step1Form.formState.errors.ownerEmail && <p className="text-red-300 text-xs">{step1Form.formState.errors.ownerEmail.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Mot de passe *</Label>
                <Input {...step1Form.register('password')} type="password" placeholder="••••••••" className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
                {step1Form.formState.errors.password && <p className="text-red-300 text-xs">{step1Form.formState.errors.password.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Confirmation *</Label>
                <Input {...step1Form.register('confirmPassword')} type="password" placeholder="••••••••" className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
                {step1Form.formState.errors.confirmPassword && <p className="text-red-300 text-xs">{step1Form.formState.errors.confirmPassword.message}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-white/30 hover:bg-white/40 text-white border border-white/50">Suivant <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </form>
        )}

        {/* ─── ÉTAPE 2 — Centre ─── */}
        {step === 2 && (
          <form onSubmit={step2Form.handleSubmit(d => { setStep2Data(d); setStep(3); })} className="space-y-3">
            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Nom du centre *</Label>
              <Input {...step2Form.register('centerName')} placeholder="Institut Beauty Star" className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
              {step2Form.formState.errors.centerName && <p className="text-red-300 text-xs">{step2Form.formState.errors.centerName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Description (optionnel)</Label>
              <Input {...step2Form.register('centerDescription')} placeholder="Votre oasis de beauté..." className="bg-white/20 border-white/30 text-white placeholder:text-white/40" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/90 text-sm">Devise *</Label>
              <Select defaultValue={step2Form.getValues('currency') || 'DA'} onValueChange={v => step2Form.setValue('currency', v)}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Heure d'ouverture *</Label>
                <Input {...step2Form.register('openingTime')} type="time" className="bg-white/20 border-white/30 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/90 text-sm">Heure de fermeture *</Label>
                <Input {...step2Form.register('closingTime')} type="time" className="bg-white/20 border-white/30 text-white" />
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="text-white/70 hover:text-white hover:bg-white/10">
                <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
              <Button type="submit" className="bg-white/30 hover:bg-white/40 text-white border border-white/50">Suivant <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </form>
        )}

        {/* ─── ÉTAPE 3 — Services & Prestations ─── */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-white/70 text-sm">Sélectionnez les services proposés par votre centre. Vous pourrez modifier les prix et durées.</p>
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {categories.map(cat => (
                <div key={cat.name} className="border border-white/20 rounded-xl overflow-hidden">
                  {/* Header catégorie */}
                  <div className="flex items-center gap-3 p-3 bg-white/10">
                    <Checkbox
                      id={`cat-${cat.name}`}
                      checked={cat.checked}
                      onCheckedChange={() => toggleCategory(cat.name)}
                      className="border-white/50 data-[state=checked]:bg-white/30"
                    />
                    <label htmlFor={`cat-${cat.name}`} className="text-white font-semibold text-sm flex-1 cursor-pointer">{cat.name}</label>
                    {cat.checked && (
                      <span className="text-white/60 text-xs">{cat.prestations.length} prestation{cat.prestations.length > 1 ? 's' : ''}</span>
                    )}
                    {cat.checked && (
                      <button type="button" onClick={() => toggleExpand(cat.name)} className="text-white/60 hover:text-white">
                        {cat.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                  </div>

                  {/* Prestations */}
                  {cat.checked && cat.expanded && (
                    <div className="p-3 bg-white/5 space-y-1">
                      {/* En-tête colonnes */}
                      <div className="flex items-center gap-2 text-white/50 text-xs pb-1">
                        <span className="flex-1">Prestation</span>
                        <span className="w-28">Prix ({currency})</span>
                        <span className="w-20">Durée</span>
                        <span className="w-4"></span>
                      </div>
                      {cat.prestations.map((p, idx) => (
                        <PrestationRow
                          key={idx}
                          prestation={p}
                          currency={currency}
                          onChange={np => updatePrestation(cat.name, idx, np)}
                          onRemove={() => removePrestation(cat.name, idx)}
                        />
                      ))}
                      <Button type="button" variant="ghost" onClick={() => addPrestation(cat.name)}
                        className="w-full text-white/60 hover:text-white hover:bg-white/10 border border-dashed border-white/20 text-xs h-7 mt-1">
                        <Plus className="mr-1 h-3 w-3" /> Ajouter une prestation
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)} className="text-white/70 hover:text-white hover:bg-white/10">
                <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
              <Button type="button" onClick={() => setStep(4)} className="bg-white/30 hover:bg-white/40 text-white border border-white/50">
                Suivant <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ─── ÉTAPE 4 — Employés ─── */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-white/70 text-sm">Ajoutez votre équipe. Le mot de passe de connexion est généré automatiquement.</p>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {employees.map((emp, idx) => {
                const autoPassword = emp.firstName.toLowerCase().trim() + '123';
                return (
                  <div key={idx} className="border border-white/20 rounded-xl p-4 space-y-3 bg-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold text-sm">Employé(e) #{idx + 1}</h4>
                      {idx > 0 && (
                        <button type="button" onClick={() => removeEmployee(idx)} className="text-red-300 hover:text-red-100">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-white/80 text-xs">Prénom *</Label>
                        <Input value={emp.firstName} onChange={e => updateEmployee(idx, { ...emp, firstName: e.target.value })}
                          placeholder="Fatima" className="bg-white/20 border-white/30 text-white placeholder:text-white/40 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/80 text-xs">Nom *</Label>
                        <Input value={emp.lastName} onChange={e => updateEmployee(idx, { ...emp, lastName: e.target.value })}
                          placeholder="Zahra" className="bg-white/20 border-white/30 text-white placeholder:text-white/40 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-white/80 text-xs">Téléphone</Label>
                        <Input value={emp.phone} onChange={e => updateEmployee(idx, { ...emp, phone: e.target.value })}
                          placeholder="+213 6XX XXX XXX" className="bg-white/20 border-white/30 text-white placeholder:text-white/40 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/80 text-xs">Mot de passe auto</Label>
                        <Input value={emp.firstName ? autoPassword : '—'} readOnly
                          className="bg-white/10 border-white/20 text-white/60 text-sm cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-white/80 text-xs">Profession</Label>
                      <Select value={emp.profession} onValueChange={v => updateEmployee(idx, { ...emp, profession: v })}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white text-sm"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                        <SelectContent>{PROFESSIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>

                    {allPrestations.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-white/80 text-xs">Prestations assignées</Label>
                        <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                          {allPrestations.map(svc => (
                            <div key={svc.name} className="flex items-center gap-2">
                              <Checkbox
                                id={`emp-${idx}-${svc.name}`}
                                checked={emp.serviceNames.includes(svc.name)}
                                onCheckedChange={() => toggleEmployeeService(idx, svc.name)}
                                className="border-white/40 data-[state=checked]:bg-white/30 flex-shrink-0"
                              />
                              <label htmlFor={`emp-${idx}-${svc.name}`} className="text-white/80 text-xs cursor-pointer leading-tight">
                                {svc.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Button type="button" variant="ghost" onClick={() => setEmployees([...employees, { firstName: '', lastName: '', phone: '', profession: '', serviceNames: [] }])}
              className="w-full text-white/70 hover:text-white hover:bg-white/10 border border-dashed border-white/30">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un(e) autre employé(e)
            </Button>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(3)} className="text-white/70 hover:text-white hover:bg-white/10">
                <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => handleSubmit(true)} disabled={isLoading}
                  className="text-white/60 hover:text-white hover:bg-white/10 text-sm">Ignorer</Button>
                <Button type="button" onClick={() => handleSubmit(false)} disabled={isLoading}
                  className="bg-white/30 hover:bg-white/40 text-white border border-white/50">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</> : 'Finaliser'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
