import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles for the ERP system
export type UserRole = 'superadmin' | 'admin' | 'reception' | 'staff';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Profiles table (users/employees)
export const profiles = sqliteTable("profiles", {
    id: text("id").primaryKey(), // UUID pattern
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").$type<UserRole>().notNull().default('staff'),
    colorCode: text("color_code").default('#3B82F6'),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"), // ISO String in SQLite
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
    id: true,
    createdAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Service categories table
export const serviceCategories = sqliteTable("services_categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
    id: true,
});

export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

// Services table (catalog)
export const services = sqliteTable("services", {
    id: text("id").primaryKey(),
    categoryId: integer("category_id").notNull(),
    name: text("name").notNull(),
    price: integer("price").notNull(), // Price in DA
    duration: integer("duration").notNull(), // Duration in minutes
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
    id: true,
    createdAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Staff skills table (linking employees to service categories)
export const staffSkills = sqliteTable("staff_skills", {
    profileId: text("profile_id").notNull(),
    categoryId: integer("category_id").notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.profileId, table.categoryId] }),
}));

export const insertStaffSkillSchema = createInsertSchema(staffSkills);

export type InsertStaffSkill = z.infer<typeof insertStaffSkillSchema>;
export type StaffSkill = typeof staffSkills.$inferSelect;

// Clients table
export const clients = sqliteTable("clients", {
    id: text("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    notes: text("notes"),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const insertClientSchema = createInsertSchema(clients).omit({
    id: true,
    createdAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Appointments table
export const appointments = sqliteTable("appointments", {
    id: text("id").primaryKey(),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
    startTime: text("start_time").notNull(), // Store as ISO String
    endTime: text("end_time").notNull(), // Store as ISO String
    clientId: text("client_id").notNull(),
    staffId: text("staff_id").notNull(),
    serviceId: text("service_id").notNull(),
    status: text("status").$type<AppointmentStatus>().notNull().default('pending'),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
    id: true,
    createdAt: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Extended types for frontend use (Keep same interfaces)
export interface ProfileWithSkills extends Profile {
    skills: number[]; // category IDs
}

export interface ServiceWithCategory extends Service {
    category: ServiceCategory;
}

export interface AppointmentWithDetails extends Appointment {
    client: Client;
    staff: Profile;
    service: ServiceWithCategory;
}

// Auth types
export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    colorCode: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
