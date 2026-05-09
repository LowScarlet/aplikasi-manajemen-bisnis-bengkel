import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusPekerjaanEnum = pgEnum("status_pekerjaan", [
  "PROSES",
  "SELESAI",
  "BATAL",
]);

export const peranEnum = pgEnum("peran_pengguna", [
  "ADMIN",
  "MEKANIK",
]);

export const tipeDetailEnum = pgEnum("tipe_detail", [
  "BARANG",
  "LAYANAN",
  "CUSTOM",
]);

export const statusPembayaranEnum = pgEnum("status_pembayaran", [
  "BELUM_BAYAR",
  "SEBAGIAN",
  "LUNAS",
]);

export const pengguna = pgTable("pengguna", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  username: text("username").unique(),
  password: text("password"),
  peran: peranEnum("peran").notNull(),
  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

export const tagihan = pgTable("tagihan", {
  id: uuid("id").defaultRandom().primaryKey(),
  kode: text("kode").notNull(),

  namaCustomer: text("nama_customer"),

  status: statusPekerjaanEnum("status").default("PROSES"),

  statusPembayaran: statusPembayaranEnum("status_pembayaran")
    .default("BELUM_BAYAR"),

  mekanikId: uuid("mekanik_id").references(() => pengguna.id, {
    onDelete: "set null",
  }),

  subtotal: integer("subtotal").default(0),
  ongkos: integer("ongkos").default(0),
  diskon: integer("diskon").default(0),
  total: integer("total").default(0),
  dibayar: integer("dibayar").default(0),
  kembalian: integer("kembalian").default(0),

  catatan: text("catatan").default(''),

  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

export const tagihan_detail = pgTable("tagihan_detail", {
  id: uuid("id").defaultRandom().primaryKey(),

  tagihanId: uuid("tagihan_id")
    .notNull()
    .references(() => tagihan.id, {
      onDelete: "cascade",
    }),

  tipe: tipeDetailEnum("tipe").notNull(),

  nama: text("nama").notNull(),
  qty: integer("qty").notNull(),
  harga: integer("harga").notNull(),
  subtotal: integer("subtotal").notNull(),

  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

export const pembayaran = pgTable("pembayaran", {
  id: uuid("id").defaultRandom().primaryKey(),

  tagihanId: uuid("tagihan_id")
    .notNull()
    .references(() => tagihan.id, {
      onDelete: "cascade",
    }),

  jumlah: integer("jumlah").notNull(),

  metode: text("metode"),
  catatan: text("catatan"),

  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

export const penggunaRelations = relations(pengguna, ({ many }) => ({
  tagihan: many(tagihan),
}));

export const tagihanRelations = relations(tagihan, ({ one, many }) => ({
  mekanik: one(pengguna, {
    fields: [tagihan.mekanikId],
    references: [pengguna.id],
  }),
  details: many(tagihan_detail),
  pembayaran: many(pembayaran),
}));

export const tagihanDetailRelations = relations(
  tagihan_detail,
  ({ one }) => ({
    tagihan: one(tagihan, {
      fields: [tagihan_detail.tagihanId],
      references: [tagihan.id],
    }),
  })
);

export const pembayaranRelations = relations(pembayaran, ({ one }) => ({
  tagihan: one(tagihan, {
    fields: [pembayaran.tagihanId],
    references: [tagihan.id],
  }),
}));