import { useQuery, useMutation } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Save
} from 'lucide-react';
import { useState, useEffect } from 'react';
import type { AppointmentWithDetails } from '@shared/schema';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function AppointmentCard({
  appointment,
  isCurrentOrUpcoming,
  onComplete,
  onCancel,
  onUpdateNotes,
}: {
  appointment: AppointmentWithDetails;
  isCurrentOrUpcoming: boolean;
  onComplete: () => void;
  onCancel: () => void;
  onUpdateNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  };

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  useEffect(() => {
    setNotes(appointment.notes || '');
  }, [appointment.notes]);

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    setIsNotesOpen(false);
  };

  return (
    <>
      <Card
        className={`border-card-border overflow-hidden transition-all duration-300 hover:shadow-md ${isCurrentOrUpcoming ? 'border-l-4 border-l-primary bg-primary/2' : ''
          }`}
        data-testid={`schedule-appointment-${appointment.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Time column */}
              <div className="text-center min-w-[70px] bg-muted/50 rounded-lg p-2 border border-border">
                <p className="text-xl font-bold text-foreground leading-tight">{formatTime(startTime)}</p>
                <div className="h-px bg-border my-1" />
                <p className="text-xs text-muted-foreground font-medium">
                  {formatTime(endTime)}
                </p>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-foreground truncate">{appointment.client.fullName}</h3>
                  <Badge className={`${statusColors[appointment.status]} border-none font-medium text-[10px]`}>
                    {statusLabels[appointment.status]}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <p className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Scissors className="h-4 w-4" />
                    {appointment.service.name}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {appointment.service.duration} min
                    </p>
                    <p className="font-bold text-foreground">
                      {appointment.service.price} DA
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Tél: <span className="font-semibold text-foreground">{appointment.client.phone}</span>
                  </p>

                  {appointment.notes && (
                    <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10 text-[11px] flex items-start gap-2 italic text-muted-foreground cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => setIsNotesOpen(true)}>
                      <MessageSquare className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                      <span className="line-clamp-2 max-w-[300px]">{appointment.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center shrink-0">
              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <div className="flex flex-row items-center gap-2 p-1.5 bg-muted/20 rounded-xl border border-border shadow-sm">
                  <Button
                    size="sm"
                    onClick={onComplete}
                    className="gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold h-9 px-4"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Terminer
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsNotesOpen(true)}
                    className="gap-2 bg-background border border-primary/20 text-primary hover:bg-primary/5 font-bold h-9 px-4"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Note
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCancel}
                    className="gap-2 text-destructive/70 hover:text-destructive hover:bg-destructive/5 font-medium h-9 px-4"
                  >
                    <XCircle className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              )}
              {appointment.status === 'completed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsNotesOpen(true)}
                  className="gap-2 border-primary/20 text-primary font-bold h-9 px-4"
                >
                  <MessageSquare className="h-4 w-4" />
                  {appointment.notes ? 'Modifier note' : 'Ajouter note'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Notes : {appointment.client.fullName}
            </DialogTitle>
            <DialogDescription>
              Ajoutez des détails sur la prestation (teinte, préférences, etc.)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Écrivez vos notes ici..."
              className="min-h-[150px] focus-visible:ring-primary text-base"
            />
          </div>
          <DialogFooter className="flex flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsNotesOpen(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleSaveNotes} className="bg-primary hover:bg-primary/90 flex-1">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MySchedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  const { data: appointments = [], isLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ['/api/appointments', 'staff', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/appointments?staff=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateAppointment = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status?: string; notes?: string }) => {
      const res = await apiRequest('PATCH', `/api/appointments/${id}`, { status, notes });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({ title: 'Succès', description: 'Rendez-vous mis à jour' });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le rendez-vous',
        variant: 'destructive',
      });
    },
  });

  const dayAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return (
        apt.staffId === user?.id &&
        aptDate.toDateString() === selectedDate.toDateString() &&
        apt.status !== 'cancelled'
      );
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = selectedDate.toDateString() === now.toDateString();

  const stats = {
    total: dayAppointments.length,
    pending: dayAppointments.filter((a) => a.status === 'pending').length,
    confirmed: dayAppointments.filter((a) => a.status === 'confirmed').length,
    completed: dayAppointments.filter((a) => a.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <Layout title="Mon Planning">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mon Planning (V3)">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mon Planning (V3)</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {selectedDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center min-w-48">
              <h2 className="text-xl font-semibold">
                {selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h2>
              {!isToday && (
                <Button variant="ghost" size="sm" onClick={goToToday} className="p-0 h-auto text-primary hover:bg-transparent hover:underline">
                  Retour à aujourd'hui
                </Button>
              )}
            </div>
            <Button size="icon" variant="outline" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stats.total} RDV</span>
            </div>
            {stats.pending > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                {stats.pending} en attente
              </Badge>
            )}
            {stats.completed > 0 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                {stats.completed} terminé(s)
              </Badge>
            )}
          </div>
        </div>

        {dayAppointments.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isToday ? 'Aucun rendez-vous aujourd\'hui' : 'Aucun rendez-vous ce jour'}
              </h3>
              <p className="text-muted-foreground">
                {isToday
                  ? 'Profitez de votre journée libre !'
                  : 'Sélectionnez une autre date pour voir vos rendez-vous.'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {dayAppointments.map((appointment) => {
              const isCurrentOrUpcoming =
                appointment.status === 'pending' || appointment.status === 'confirmed';

              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isCurrentOrUpcoming={isCurrentOrUpcoming}
                  onComplete={() =>
                    updateAppointment.mutate({ id: appointment.id, status: 'completed' })
                  }
                  onCancel={() =>
                    updateAppointment.mutate({ id: appointment.id, status: 'cancelled' })
                  }
                  onUpdateNotes={(notes) =>
                    updateAppointment.mutate({ id: appointment.id, notes })
                  }
                />
              );
            })}
          </div>
        )}

        {isToday && dayAppointments.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Il est actuellement{' '}
              <span className="font-medium">
                {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
