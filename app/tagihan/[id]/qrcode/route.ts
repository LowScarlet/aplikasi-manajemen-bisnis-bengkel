import QRCode from "qrcode";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/tagihan/${id}`;

  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: 300,
    margin: 2,
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}