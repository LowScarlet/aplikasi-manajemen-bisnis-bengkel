/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { GoogleGenAI } from "@google/genai";
import { getDetail } from "../ubah/page";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";
import { getUser } from "@/libs/auth";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const prompt = `
Tugas: Ekstrak data item dari gambar invoice / struk / nota menjadi JSON valid.

Format output wajib:

{
  "item": [],
  "ongkos": number
}

Aturan utama:

- Ambil hanya daftar item/barang/jasa.

- Jika terdapat item ongkir / ongkos kirim / delivery / shipping / biaya kirim / courier / ekspedisi / jasa kirim atau sejenisnya:
  - jangan masukkan ke dalam array "item"
  - masukkan nilainya ke field "ongkos"

- Jika tidak ada ongkos kirim maka:
  "ongkos": 0

- Abaikan:
  header toko,
  alamat,
  nomor invoice,
  tanggal,
  subtotal,
  pajak,
  diskon,
  admin fee,
  total,
  QRIS,
  footer,
  ucapan terima kasih,
  dll.

Format item wajib:

{
  "nama": string,
  "qty": 1,
  "harga": number
}

Aturan parsing item:

- "nama" = nama item persis seperti tertulis di invoice.

- "qty" selalu bernilai 1.

- "harga" = total harga item dalam integer tanpa titik/koma.

- Jangan gunakan field:
  harga_satuan
  total

- Jika harga menggunakan format Indonesia seperti:
  85.000
  1.250.000

  maka ubah menjadi:
  85000
  1250000

Aturan OCR:

- Perbaiki typo OCR ringan jika jelas maksudnya.

- Jangan mengarang item yang tidak ada.

- Jika teks ambigu, pilih hasil paling masuk akal berdasarkan konteks invoice.

Aturan output:

- Output HARUS JSON valid.

- Jangan gunakan markdown.

- Jangan gunakan \`\`\`json

- Jangan tambahkan komentar.

- Jangan tambahkan kalimat pembuka atau penutup.

- Output hanya JSON.

Contoh output:

{
  "item": [
    {
      "nama": "rumah injeksi",
      "qty": 1,
      "harga": 125000
    },
    {
      "nama": "selang injeksi",
      "qty": 1,
      "harga": 85000
    }
  ],
  "ongkos": 15000
}
`;

export async function parseInvoices(
  formData: FormData
) {

  const files =
    formData.getAll("files") as File[];

  const contents: any[] = [];

  for (const file of files) {

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const base64 =
      buffer.toString("base64");

    contents.push({
      inlineData: {
        mimeType: file.type,
        data: base64,
      },
    });
  }

  contents.push({
    text: prompt,
  });

  const response =
    await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
    });

  let text =
    response.text ||
    '{"item":[],"ongkos":0}';

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed =
    JSON.parse(text);

  return {
    item: Array.isArray(parsed.item)
      ? parsed.item
      : [],
    ongkos:
      Number(parsed.ongkos) || 0,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const userauth = await getUser();

  if (!userauth) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const data = await getDetail(id);

  if (!data) {
    return (
      <div>
        Tagihan tidak ditemukan
      </div>
    );
  }

  return (
    <ClientPage data={data} />
  );
}