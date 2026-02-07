import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, Clock, Scissors, Loader2, X, Check, XCircle, Phone, ChevronDown, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile, Client, ServiceWithCategory, AppointmentWithDetails, InsertAppointment } from '@shared/schema';

// Setup date-fns localizer for react-big-calendar
const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    appointment: AppointmentWithDetails;
    staffId: string;
    staffName: string;
    staffColor: string;
  };
}

function AppointmentModal({
  open,
  onOpenChange,
  selectedSlot,
  staff,
  clients,
  services,
  onSuccess,
  onStaffAssigned,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: { start: Date; end: Date; staffId?: string } | null;
  staff: Profile[];
  clients: Client[];
  services: ServiceWithCategory[];
  onSuccess: () => void;
  onStaffAssigned?: (staffId: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [clientSearch, setClientSearch] = useState('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('09:00');
  const { toast } = useToast();

  // Get staff skills from the API
  const { data: staffSkills = [] } = useQuery<{ profileId: string; categoryId: number }[]>({
    queryKey: ['/api/staff-skills'],
    enabled: open,
  });

  // Reset modal when it opens/closes
  useEffect(() => {
    if (open) {
      setStep(1);
      setClientSearch('');
      setSelectedClient('');
      setSelectedService('');

      if (selectedSlot) {
        // Use local date/time instead of ISO to avoid timezone shifts
        const year = selectedSlot.start.getFullYear();
        const month = String(selectedSlot.start.getMonth() + 1).padStart(2, '0');
        const day = String(selectedSlot.start.getDate()).padStart(2, '0');
        const hours = String(selectedSlot.start.getHours()).padStart(2, '0');
        const minutes = String(selectedSlot.start.getMinutes()).padStart(2, '0');

        setAppointmentDate(`${year}-${month}-${day}`);
        setAppointmentTime(`${hours}:${minutes}`);

        if (selectedSlot.staffId) {
          setSelectedStaff(selectedSlot.staffId);
        }
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        setAppointmentDate(`${year}-${month}-${day}`);
        setAppointmentTime('09:00');
      }
    } else {
      setSelectedStaff('');
    }
  }, [open, selectedSlot]);

  const createAppointment = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const res = await apiRequest('POST', '/api/appointments', data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Notify parent to select the staff member who was assigned the appointment
      if (onStaffAssigned) {
        onStaffAssigned(variables.staffId);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({ title: 'Succès', description: 'Rendez-vous créé avec succès' });
      onSuccess();
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de créer le rendez-vous', variant: 'destructive' });
    },
  });

  const handleCreateAppointment = async () => {
    if (!selectedClient || !selectedService || !selectedStaff || !appointmentDate || !appointmentTime) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs', variant: 'destructive' });
      return;
    }

    const [year, month, day] = appointmentDate.split('-').map(Number);
    const [hours, minutes] = appointmentTime.split(':').map(Number);

    // Create Date object in local time
    const startDateTime = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(startDateTime.getTime())) {
      toast({ title: 'Erreur', description: 'Date ou heure invalide', variant: 'destructive' });
      return;
    }

    const service = services.find(s => s.id === selectedService);
    const endDateTime = new Date(startDateTime.getTime() + (service?.duration || 60) * 60000);

    createAppointment.mutate({
      clientId: selectedClient,
      staffId: selectedStaff,
      serviceId: selectedService,
      startTime: startDateTime,
      endTime: endDateTime,
    });
  };

  const filteredClients = clients.filter(c =>
    c.fullName.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const availableServices = services.filter(s => {
    const staffSkill = staffSkills.find(
      sk => sk.profileId === selectedStaff && sk.categoryId === s.categoryId
    );
    return !!staffSkill;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un Rendez-vous</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <Label>Sélectionner un Client</Label>
                <Input
                  placeholder="Rechercher un client..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="mt-1"
                />
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                  {filteredClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client.id);
                        setStep(2);
                      }}
                      className="w-full text-left p-2 hover:bg-accent rounded"
                    >
                      <p className="font-medium">{client.fullName}</p>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>Sélectionner un Employé</Label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.firstName} {s.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label>Sélectionner une Prestation</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une prestation" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.duration}min - {s.price}DA)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Précédent
            </Button>
          )}
          {step < 4 && (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !selectedClient) ||
                (step === 2 && !selectedStaff) ||
                (step === 3 && !selectedService)
              }
            >
              Suivant
            </Button>
          )}
          {step === 4 && (
            <Button
              onClick={handleCreateAppointment}
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentDetailsModal({
  open,
  onOpenChange,
  appointment,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentWithDetails | null;
  onUpdate: (id: string, updates: { status?: string, notes?: string }) => void;
}) {
  const [notes, setNotes] = useState(appointment?.notes || '');

  useEffect(() => {
    if (appointment) {
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

  if (!appointment) return null;

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const handleUpdateNotes = () => {
    onUpdate(appointment.id, { notes });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du Rendez-vous</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex items-center justify-between">
            <Badge className={statusColors[appointment.status]}>
              {statusLabels[appointment.status]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(appointment.startTime).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{appointment.client.fullName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {appointment.client.phone}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  {new Date(appointment.startTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(appointment.endTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                Prestation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{appointment.service.name}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{appointment.service.category?.name}</Badge>
                  <span className="text-sm text-muted-foreground">{appointment.service.duration} min</span>
                </div>
                <span className="font-bold text-primary">{appointment.service.price} DA</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notes de la prestation
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des détails (ex: préférences cliente, produits utilisés...)"
              className="resize-none"
            />
            {notes !== (appointment.notes || '') && (
              <Button size="sm" onClick={handleUpdateNotes} className="w-full mt-2">
                Enregistrer la note
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row border-t pt-4">
          <div className="flex flex-wrap gap-2 w-full sm:justify-end">
            {appointment.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="text-emerald-600 hover:bg-emerald-50"
                  onClick={() => onUpdate(appointment.id, { status: 'confirmed' })}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirmer
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onUpdate(appointment.id, { status: 'cancelled' })}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={() => onUpdate(appointment.id, { status: 'completed' })}
              >
                <Check className="mr-2 h-4 w-4" />
                Marquer comme terminé
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Fermer</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
    staffId?: string;
  } | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('week');
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<string> | null>(null);
  const [searchStaff, setSearchStaff] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const { toast } = useToast();

  const { data: staff = [], isLoading: staffLoading } = useQuery<Profile[]>({
    queryKey: ['/api/profiles/staff'],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<ServiceWithCategory[]>({
    queryKey: ['/api/services'],
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<
    AppointmentWithDetails[]
  >({
    queryKey: ['/api/appointments'],
  });

  const updateAppointmentAction = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status?: string; notes?: string }) => {
      const res = await apiRequest('PATCH', `/api/appointments/${id}`, { status, notes });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({ title: 'Succès', description: 'Rendez-vous mis à jour' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le rendez-vous', variant: 'destructive' });
    },
  });

  const isLoading = staffLoading || clientsLoading || servicesLoading || appointmentsLoading;

  // Filter staff by search
  const filteredStaff = useMemo(() => {
    return staff.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchStaff.toLowerCase())
    );
  }, [staff, searchStaff]);

  // Initialize selectedStaffIds based on user role
  const activeStaffIds = useMemo(() => {
    // Si l'utilisateur est staff (employé), afficher seulement ses RDV
    if (user?.role === 'staff' && user?.id) {
      return new Set([user.id]);
    }

    // Si l'utilisateur est admin/superadmin/reception, afficher tous le personnel par défaut (null)
    // Sinon, utiliser la sélection explicite (même si elle est vide)
    if (selectedStaffIds === null) {
      return new Set(staff.map(s => s.id));
    }
    return selectedStaffIds;
  }, [selectedStaffIds, staff, user]);

  // Toggle staff selection
  const toggleStaff = (staffId: string) => {
    const currentSet = selectedStaffIds || new Set(staff.map(s => s.id));
    const newSet = new Set(currentSet);
    if (newSet.has(staffId)) {
      newSet.delete(staffId);
    } else {
      newSet.add(staffId);
    }
    setSelectedStaffIds(newSet);
  };

  // Select/deselect all filtered staff
  const toggleAllStaff = () => {
    const allFilteredAreSelected = filteredStaff.length > 0 && filteredStaff.every(s => activeStaffIds.has(s.id));

    if (allFilteredAreSelected) {
      // Si tout est sélectionné, on vide tout (Désélectionner tout)
      setSelectedStaffIds(new Set());
    } else {
      // Sinon, on sélectionne tout le personnel filtré (Sélectionner tout)
      setSelectedStaffIds(new Set(filteredStaff.map(s => s.id)));
    }
  };

  // Transform appointments to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return appointments
      .filter((a) => a.status !== 'cancelled' && activeStaffIds.has(a.staffId))
      .map((a) => ({
        id: a.id,
        title: `${a.client.fullName} - ${a.service.name}`,
        start: new Date(a.startTime),
        end: new Date(a.endTime),
        resource: {
          appointment: a,
          staffId: a.staffId,
          staffName: `${a.staff.firstName} ${a.staff.lastName}`,
          staffColor: a.staff.colorCode || '#3B82F6',
        },
      }));
  }, [appointments, activeStaffIds]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setShowNewAppointment(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedAppointment(event.resource.appointment);
    setShowAppointmentDetails(true);
  };

  if (isLoading) {
    return (
      <Layout title="Agenda">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-[calc(100vh-12rem)] w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Agenda">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-3">
              {activeStaffIds.size}/{staff.length} employé(e)s • {appointments.filter((a) => a.status !== 'cancelled' && activeStaffIds.has(a.staffId)).length} RDV
            </p>
            {/* Staff Dropdown - Only for admin/superadmin/reception */}
            {user?.role !== 'staff' && (
              <div className="relative inline-block">
                <Button
                  onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                  variant="outline"
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Liste des employé(e)s
                  <ChevronDown className={`h-4 w-4 transition-transform ${showStaffDropdown ? 'rotate-180' : ''}`} />
                </Button>

                {/* Dropdown Menu */}
                {showStaffDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 min-w-64">
                    {/* Search Input */}
                    <div className="p-3 border-b border-border">
                      <Input
                        placeholder="Rechercher un(e) employé(e)..."
                        value={searchStaff}
                        onChange={(e) => setSearchStaff(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    </div>

                    {/* Select All Button */}
                    <div className="p-2 border-b border-border">
                      <Button
                        variant={filteredStaff.every(s => activeStaffIds.has(s.id)) ? 'default' : 'outline'}
                        size="sm"
                        onClick={toggleAllStaff}
                        className="w-full font-medium"
                      >
                        {filteredStaff.every(s => activeStaffIds.has(s.id)) && activeStaffIds.size > 0 ? 'Désélectionner tout' : 'Sélectionner tout'}
                      </Button>
                    </div>

                    {/* Staff List */}
                    <div className="max-h-64 overflow-y-auto">
                      {filteredStaff.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                          Aucun(e) employé(e) trouvé(e)
                        </div>
                      ) : (
                        filteredStaff.map((s) => {
                          const isSelected = activeStaffIds.has(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => toggleStaff(s.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-muted ${isSelected ? 'bg-primary/10' : ''
                                }`}
                            >
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: s.colorCode || '#3B82F6' }}
                              />
                              <span className={`text-sm font-medium flex-1 text-left ${isSelected ? 'text-primary font-semibold' : 'text-foreground'
                                }`}>
                                {s.firstName} {s.lastName}
                              </span>
                              {isSelected && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <Button onClick={() => setShowNewAppointment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>

        <Card className="border-card-border overflow-hidden">
          <CardContent className="p-0">
            <div className="calendar-wrapper" style={{ height: 'calc(100vh - 14rem)' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                view={view}
                onView={setView as any}
                views={['month', 'week', 'day', 'agenda']}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                popup
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.resource.staffColor,
                    borderColor: event.resource.staffColor,
                    borderRadius: '0.375rem',
                    opacity: 0.9,
                    color: 'white',
                    border: '0px',
                    display: 'block',
                  },
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <AppointmentModal
        open={showNewAppointment}
        onOpenChange={setShowNewAppointment}
        selectedSlot={selectedSlot}
        staff={staff}
        clients={clients}
        services={services}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
        }}
        onStaffAssigned={(staffId) => {
          setSelectedStaffIds(new Set([staffId]));
        }}
      />

      <AppointmentDetailsModal
        open={showAppointmentDetails}
        onOpenChange={setShowAppointmentDetails}
        appointment={selectedAppointment}
        onUpdate={(id, updates) => updateAppointmentAction.mutate({ id, ...updates })}
      />

      <style>{`
        .calendar-wrapper .rbc-calendar {
          font-family: inherit;
        }
        .calendar-wrapper .rbc-header {
          padding: 0.5rem;
          font-weight: 600;
          background-color: hsl(var(--muted));
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-today {
          background-color: hsl(var(--primary) / 0.05);
        }
        .calendar-wrapper .rbc-off-range-bg {
          background-color: hsl(var(--muted) / 0.3);
        }
        .calendar-wrapper .rbc-event {
          padding: 2px 4px;
          border-radius: 0.375rem;
          font-size: 0.75rem;
        }
        .calendar-wrapper .rbc-event:hover {
          opacity: 0.8;
        }
        .calendar-wrapper .rbc-toolbar {
          padding: 1rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .calendar-wrapper .rbc-toolbar button {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .calendar-wrapper .rbc-toolbar button:hover {
          background-color: hsl(var(--primary) / 0.9);
        }
        .calendar-wrapper .rbc-toolbar button.rbc-active {
          background-color: hsl(var(--primary) / 0.8);
        }
        .calendar-wrapper .rbc-toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .calendar-wrapper .rbc-month-view,
        .calendar-wrapper .rbc-time-view {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-time-slot {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-current-time-indicator {
          background-color: hsl(var(--destructive));
          height: 2px;
        }
      `}</style>
    </Layout>
  );
}
