import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

//
// 🔥 ENUM
//
export const jenisTransaksiEnum = pgEnum("jenis_transaksi", [
  "MASUK",
  "KELUAR",
  "KOREKSI",
]);

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

//
// 📦 KATEGORI
//
export const kategori = pgTable("kategori", {
  id: uuid("id").defaultRandom().primaryKey(),
  kode: text("kode").unique(),
  nama: text("nama").notNull(),
  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// 🏢 SUPPLIER
//
export const supplier = pgTable("supplier", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  telepon: text("telepon"),
  alamat: text("alamat"),
  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// 👤 PENGGUNA
//
export const pengguna = pgTable("pengguna", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  username: text("username").unique(),
  password: text("password"),
  peran: peranEnum("peran").notNull(),
  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// 📦 BARANG
//
export const barang = pgTable("barang", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  kode: text("kode").unique(),

  kategoriId: uuid("kategori_id")
    .notNull()
    .references(() => kategori.id),

  catatan: text("catatan"),
  satuan: text("satuan").notNull(),

  hargaBeli: integer("harga_beli").default(0),
  hargaJual: integer("harga_jual").notNull(),

  stok: integer("stok").default(0),
  stokMinimum: integer("stok_minimum").default(0),

  dibuatPada: timestamp("dibuat_pada").defaultNow(),
  diperbaruiPada: timestamp("diperbarui_pada").defaultNow(),
});

//
// 🔄 TRANSAKSI BARANG
//
export const transaksi_barang = pgTable("transaksi_barang", {
  id: uuid("id").defaultRandom().primaryKey(),

  barangId: uuid("barang_id")
    .notNull()
    .references(() => barang.id),

  supplierId: uuid("supplier_id").references(() => supplier.id),

  tagihanId: uuid("tagihan_id"), // relasi ke tagihan

  jenis: jenisTransaksiEnum("jenis").notNull(),
  jumlah: integer("jumlah").notNull(),
  total: integer("total").notNull(),

  referensi: text("referensi"),
  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// 🧰 LAYANAN
//
export const layanan = pgTable("layanan", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  harga: integer("harga").notNull(),
  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// 🧾 TAGIHAN
//
export const tagihan = pgTable("tagihan", {
  id: uuid("id").defaultRandom().primaryKey(),
  kode: text("kode").notNull(),

  namaCustomer: text("nama_customer"),

  status: statusPekerjaanEnum("status").default("PROSES"),

  statusPembayaran: statusPembayaranEnum("status_pembayaran")
    .default("BELUM_BAYAR"),

  mekanikId: uuid("mekanik_id").references(() => pengguna.id),

  total: integer("total").default(0),
  dibayar: integer("dibayar").default(0),
  kembalian: integer("kembalian").default(0),

  catatan: text("catatan"),

  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// 📄 DETAIL TAGIHAN
//
export const tagihan_detail = pgTable("tagihan_detail", {
  id: uuid("id").defaultRandom().primaryKey(),

  tagihanId: uuid("tagihan_id")
    .notNull()
    .references(() => tagihan.id),

  tipe: tipeDetailEnum("tipe").notNull(),

  barangId: uuid("barang_id").references(() => barang.id),
  layananId: uuid("layanan_id").references(() => layanan.id),

  nama: text("nama").notNull(),
  qty: integer("qty").notNull(),
  harga: integer("harga").notNull(),
  subtotal: integer("subtotal").notNull(),
});

//
// 💰 PEMBAYARAN (INI YANG BIKIN CICILAN JADI WARAS)
//
export const pembayaran = pgTable("pembayaran", {
  id: uuid("id").defaultRandom().primaryKey(),

  tagihanId: uuid("tagihan_id")
    .notNull()
    .references(() => tagihan.id),

  jumlah: integer("jumlah").notNull(),

  metode: text("metode"),
  catatan: text("catatan"),

  dibuatPada: timestamp("dibuat_pada").defaultNow(),
});

//
// ================= RELATIONS =================
//

export const kategoriRelations = relations(kategori, ({ many }) => ({
  barang: many(barang),
}));

export const barangRelations = relations(barang, ({ one, many }) => ({
  kategori: one(kategori, {
    fields: [barang.kategoriId],
    references: [kategori.id],
  }),
  transaksi: many(transaksi_barang),
  tagihanDetail: many(tagihan_detail),
}));

export const supplierRelations = relations(supplier, ({ many }) => ({
  transaksi: many(transaksi_barang),
}));

export const transaksiRelations = relations(
  transaksi_barang,
  ({ one }) => ({
    barang: one(barang, {
      fields: [transaksi_barang.barangId],
      references: [barang.id],
    }),
    supplier: one(supplier, {
      fields: [transaksi_barang.supplierId],
      references: [supplier.id],
    }),
    tagihan: one(tagihan, {
      fields: [transaksi_barang.tagihanId],
      references: [tagihan.id],
    }),
  })
);

export const penggunaRelations = relations(pengguna, ({ many }) => ({
  tagihan: many(tagihan),
}));

export const tagihanRelations = relations(tagihan, ({ one, many }) => ({
  mekanik: one(pengguna, {
    fields: [tagihan.mekanikId],
    references: [pengguna.id],
  }),
  details: many(tagihan_detail),
  transaksi: many(transaksi_barang),
  pembayaran: many(pembayaran), // 🔥 penting
}));

export const tagihanDetailRelations = relations(
  tagihan_detail,
  ({ one }) => ({
    tagihan: one(tagihan, {
      fields: [tagihan_detail.tagihanId],
      references: [tagihan.id],
    }),
    barang: one(barang, {
      fields: [tagihan_detail.barangId],
      references: [barang.id],
    }),
    layanan: one(layanan, {
      fields: [tagihan_detail.layananId],
      references: [layanan.id],
    }),
  })
);

export const layananRelations = relations(layanan, ({ many }) => ({
  tagihanDetail: many(tagihan_detail),
}));

export const pembayaranRelations = relations(pembayaran, ({ one }) => ({
  tagihan: one(tagihan, {
    fields: [pembayaran.tagihanId],
    references: [tagihan.id],
  }),
}));