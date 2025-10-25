import { pgTable, varchar, text, integer, timestamp, boolean, decimal, date, pgEnum, serial } from "drizzle-orm/pg-core";

// ENUM definitions
export const tenantStatusEnum = pgEnum('tenant_status', ['active', 'inactive', 'suspended']);
export const roomStatusEnum = pgEnum('room_status', ['available', 'occupied', 'maintenance']);
export const contractStatusEnum = pgEnum('contract_status', ['active', 'completed', 'cancelled', 'terminated']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'overdue', 'cancelled']);
export const notificationTypeEnum = pgEnum('notification_type', ['reminder', 'invoice', 'overdue', 'confirmation', 'alert']);
export const notificationStatusEnum = pgEnum('notification_status', ['pending', 'sent', 'failed', 'read']);
export const notificationChannelEnum = pgEnum('notification_channel', ['email', 'whatsapp', 'sms', 'push']);

// ================= USERS =================
export const users = pgTable('users', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('member'), // admin, owner, member
  password: text('password'),
  otpCode: varchar('otp_code', { length: 6 }),
  otpExpiry: timestamp('otp_expiry'),
  resetPasswordCode: varchar('reset_password_code', { length: 6 }),
  resetPasswordExpiry: timestamp('reset_password_expiry'),
  loginMethod: text('login_method'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ================= TENANTS =================
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 191 }).references(() => users.id),
  fullName: varchar('full_name', { length: 100 }),
  phoneNumber: varchar('phone_number', { length: 15 }),
  idCardNumber: varchar('id_card_number', { length: 20 }),
  originAddress: text('origin_address'),
  occupation: varchar('occupation', { length: 100 }),
  emergencyContact: varchar('emergency_contact', { length: 15 }),
  emergencyContactName: varchar('emergency_contact_name', { length: 100 }),
  registrationDate: date('registration_date'),
  status: tenantStatusEnum('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ================= ROOMS =================
export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  roomNumber: varchar('room_number', { length: 10 }),
  floor: integer('floor'),
  pricePerMonth: decimal('price_per_month', { precision: 10, scale: 2 }),
  status: roomStatusEnum('status'),
  facilities: text('facilities'), // JSON array
  size: varchar('size', { length: 20 }),
  images: text('images'), // JSON array of URLs
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ================= CONTRACTS =================
export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  roomId: integer('room_id').references(() => rooms.id),
  startDate: date('start_date'),
  endDate: date('end_date'),
  durationMonths: integer('duration_months'),
  rentalPrice: decimal('rental_price', { precision: 10, scale: 2 }),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  status: contractStatusEnum('status'),
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 191 }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ================= PAYMENTS =================
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  contractId: integer('contract_id').references(() => contracts.id),
  dueDate: date('due_date'),
  paymentDate: date('payment_date'),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  status: paymentStatusEnum('status'),
  periodMonth: varchar('period_month', { length: 20 }),
  lateFee: decimal('late_fee', { precision: 10, scale: 2 }).default('0'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  proofOfPayment: text('proof_of_payment'),
  verifiedBy: varchar('verified_by', { length: 191 }).references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ================= NOTIFICATIONS =================
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').references(() => payments.id),
  tenantId: integer('tenant_id').references(() => tenants.id),
  type: notificationTypeEnum('type'),
  message: text('message'),
  sentAt: timestamp('sent_at'),
  status: notificationStatusEnum('status'),
  channel: notificationChannelEnum('channel'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ================= NOTIFICATION SETTINGS =================
export const notificationSettings = pgTable('notification_settings', {
  id: serial('id').primaryKey(),
  reminderDaysBefore: integer('reminder_days_before').default(7),
  lateFeePerDay: decimal('late_fee_per_day', { precision: 10, scale: 2 }).default('0'),
  maxOverdueDays: integer('max_overdue_days').default(7),
  autoReminder: boolean('auto_reminder').default(true),
  reminderChannels: text('reminder_channels'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ================= ACTIVITY LOGS =================
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 191 }).references(() => users.id),
  action: varchar('action', { length: 100 }),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: integer('entity_id'),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});
