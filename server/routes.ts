import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertServiceSchema, insertClientSchema, insertAppointmentSchema } from "@shared/schema";
import { db } from "./db";
import { tenants, profiles, serviceCategories, staffSkills } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ===== AUTH ROUTES =====
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }

      const user = await storage.authenticateUser(email, password);

      if (!user) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== PROFILES ROUTES =====
  app.get("/api/profiles", async (req: Request, res: Response) => {
    try {
      const profiles = await storage.getProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Get profiles error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/profiles/staff", async (req: Request, res: Response) => {
    try {
      const staff = await storage.getStaffProfiles();
      res.json(staff);
    } catch (error) {
      console.error("Get staff profiles error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profil non trouvé" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/profiles", async (req: Request, res: Response) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile({
        ...data,
        skills: req.body.skills || [],
      });
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create profile error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const profile = await storage.updateProfile(req.params.id, {
        ...req.body,
        skills: req.body.skills,
      });
      if (!profile) {
        return res.status(404).json({ error: "Profil non trouvé" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.delete("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProfile(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Profil non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete profile error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== STAFF SKILLS ROUTES =====
  app.get("/api/staff-skills", async (req: Request, res: Response) => {
    try {
      const skills = await storage.getStaffSkills();
      res.json(skills);
    } catch (error) {
      console.error("Get staff skills error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== SERVICE CATEGORIES ROUTES =====
  app.get("/api/service-categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get service categories error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== SERVICES ROUTES =====
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Get services error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service non trouvé" });
      }
      res.json(service);
    } catch (error) {
      console.error("Get service error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/services", async (req: Request, res: Response) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await storage.createService(data);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create service error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: "Service non trouvé" });
      }
      res.json(service);
    } catch (error) {
      console.error("Update service error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.delete("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete service error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== CLIENTS ROUTES =====
  app.get("/api/clients", async (req: Request, res: Response) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Get clients error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client non trouvé" });
      }
      res.json(client);
    } catch (error) {
      console.error("Get client error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/clients/:id/appointments", async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getAppointmentsByClient(req.params.id);
      res.json(appointments);
    } catch (error) {
      console.error("Get client appointments error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    try {
      const data = insertClientSchema.parse(req.body);
      const client = await storage.createClient(data);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create client error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const client = await storage.updateClient(req.params.id, req.body);
      if (!client) {
        return res.status(404).json({ error: "Client non trouvé" });
      }
      res.json(client);
    } catch (error) {
      console.error("Update client error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.delete("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Client non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete client error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== APPOINTMENTS ROUTES =====
  app.get("/api/appointments", async (req: Request, res: Response) => {
    try {
      const { staff: staffId } = req.query;

      if (staffId && typeof staffId === 'string') {
        const appointments = await storage.getAppointmentsByStaff(staffId);
        return res.json(appointments);
      }

      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/appointments", async (req: Request, res: Response) => {
    try {
      // Parse dates from strings
      const data = {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      };

      const parsed = insertAppointmentSchema.parse(data);
      const appointment = await storage.createAppointment(parsed);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create appointment error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: "Rendez-vous non trouvé" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Update appointment error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/appointments/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Statut invalide" });
      }

      const appointment = await storage.updateAppointmentStatus(req.params.id, status);
      if (!appointment) {
        return res.status(404).json({ error: "Rendez-vous non trouvé" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Update appointment status error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.delete("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Rendez-vous non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete appointment error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== DASHBOARD ROUTES =====
  app.get("/api/dashboard/kpis", async (req: Request, res: Response) => {
    try {
      const kpis = await storage.getDashboardKPIs();
      res.json(kpis);
    } catch (error) {
      console.error("Get dashboard KPIs error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/dashboard/top-employees", async (req: Request, res: Response) => {
    try {
      const topEmployees = await storage.getTopEmployees();
      res.json(topEmployees);
    } catch (error) {
      console.error("Get top employees error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/dashboard/top-services", async (req: Request, res: Response) => {
    try {
      const topServices = await storage.getTopServices();
      res.json(topServices);
    } catch (error) {
      console.error("Get top services error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/dashboard/golden-client", async (req: Request, res: Response) => {
    try {
      const goldenClient = await storage.getGoldenClient();
      res.json(goldenClient);
    } catch (error) {
      console.error("Get golden client error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ===== TENANTS / CONFIG ROUTES =====

  // GET config du tenant actif (premier tenant actif)
  app.get("/api/tenants/config", async (req: Request, res: Response) => {
    try {
      const [tenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.status, 'active'))
        .limit(1);

      if (!tenant) {
        // Retourne la config par défaut si aucun tenant
        return res.json({
          centerName: 'Anaros',
          centerDescription: 'Centre de Beauté - Gestion',
          currency: 'DA',
          locale: 'fr-DZ',
          openingTime: '09:00',
          closingTime: '20:00',
          logoUrl: null,
        });
      }

      res.json({
        centerName: tenant.centerName,
        centerDescription: tenant.centerDescription,
        currency: tenant.currency,
        locale: tenant.locale,
        openingTime: tenant.openingTime,
        closingTime: tenant.closingTime,
        logoUrl: tenant.logoUrl,
      });
    } catch (error) {
      console.error("Get tenant config error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // POST inscription nouveau centre de beauté
  app.post("/api/tenants/register", async (req: Request, res: Response) => {
    try {
      const {
        ownerFirstName,
        ownerLastName,
        ownerPhone,
        ownerEmail,
        password,
        centerName,
        centerDescription,
        currency,
        openingTime,
        closingTime,
        logoUrl,
        employees,
      } = req.body;

      // Validation basique
      if (!ownerEmail || !password || !centerName) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      // Vérifier email unique
      const existing = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, ownerEmail.toLowerCase()))
        .limit(1);

      if (existing.length > 0) {
        return res.status(409).json({ error: "Cet email est déjà utilisé" });
      }

      const tenantId = randomUUID();

      // Créer le tenant
      await db.insert(tenants).values({
        id: tenantId,
        ownerFirstName,
        ownerLastName,
        ownerPhone,
        ownerEmail: ownerEmail.toLowerCase(),
        centerName,
        centerDescription: centerDescription || null,
        currency: currency || 'DA',
        locale: currency === 'MAD' ? 'fr-MA' : currency === 'EUR' ? 'fr-FR' : currency === 'USD' ? 'en-US' : currency === 'TND' ? 'fr-TN' : 'fr-DZ',
        openingTime: openingTime || '09:00',
        closingTime: closingTime || '20:00',
        logoUrl: logoUrl || null,
        status: 'active',
      });

      // Créer le profil superadmin (propriétaire)
      const adminId = randomUUID();
      await db.insert(profiles).values({
        id: adminId,
        firstName: ownerFirstName,
        lastName: ownerLastName,
        email: ownerEmail.toLowerCase(),
        password,
        role: 'superadmin',
        colorCode: '#9F7AEA',
      });

      // Collecter les catégories de compétences des employés
      const requestedSkills = new Set<string>();
      if (Array.isArray(employees)) {
        for (const emp of employees) {
          if (Array.isArray(emp.skills)) {
            for (const s of emp.skills) requestedSkills.add(s);
          }
        }
      }

      // Catégories par défaut pour tout nouveau centre
      const defaultCategories = [
        'Coiffure', 'Esthétique', 'Manucure', 'Massage',
        'Maquillage', 'Soins du corps', 'Épilation', 'Onglerie'
      ];

      // Récupérer les catégories existantes
      const existingCats = await db.select().from(serviceCategories);
      const existingNames = existingCats.map((c) => c.name.toLowerCase());

      // Créer toutes les catégories demandées + les catégories par défaut si elles n'existent pas
      const toCreate = [...new Set([...defaultCategories, ...Array.from(requestedSkills)])];
      for (const catName of toCreate) {
        if (!existingNames.includes(catName.toLowerCase())) {
          try {
            await db.insert(serviceCategories).values({ name: catName });
          } catch {
            // Ignore duplicate
          }
        }
      }

      // Récupérer toutes les catégories (incluant les nouvelles) pour le mapping
      const allCats = await db.select().from(serviceCategories);
      // Mapping insensible à la casse
      const catMap: Record<string, number> = {};
      for (const c of allCats) {
        catMap[c.name.toLowerCase()] = c.id;
      }

      // Créer les profils employés
      const employeeColors = [
        '#F87171', '#34D399', '#60A5FA', '#FBBF24',
        '#A78BFA', '#F472B6', '#2DD4BF', '#FB923C',
      ];

      if (Array.isArray(employees)) {
        for (let i = 0; i < employees.length; i++) {
          const emp = employees[i];
          if (!emp.firstName || !emp.lastName) continue;

          const empId = randomUUID();
          const empEmail = `${emp.firstName.toLowerCase()}.${emp.lastName.toLowerCase()}${i}@${centerName.toLowerCase().replace(/\s+/g, '')}.local`;

          try {
            await db.insert(profiles).values({
              id: empId,
              firstName: emp.firstName,
              lastName: emp.lastName,
              email: empEmail,
              password: 'changeme123',
              role: emp.profession === 'Réceptionniste' ? 'reception' : 'staff',
              colorCode: employeeColors[i % employeeColors.length],
            });

            // Assigner les compétences (matching insensible à la casse)
            if (Array.isArray(emp.skills)) {
              for (const skillName of emp.skills) {
                const catId = catMap[skillName.toLowerCase()];
                if (catId) {
                  try {
                    await db.insert(staffSkills).values({ profileId: empId, categoryId: catId });
                  } catch {
                    // Ignore
                  }
                }
              }
            }
          } catch {
            // Ignore duplicate email errors
          }
        }
      }

      res.status(201).json({
        success: true,
        message: `Centre "${centerName}" créé avec succès`,
        tenantId,
        adminEmail: ownerEmail,
      });
    } catch (error) {
      console.error("Register tenant error:", error);
      res.status(500).json({ error: "Erreur lors de la création du compte" });
    }
  });

  return httpServer;
}
