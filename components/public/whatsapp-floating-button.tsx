import { MessageCircle } from "lucide-react";

const whatsappNumber = "5547999253962";

export function WhatsappFloatingButton() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Entrar em contato pelo WhatsApp"
      className="fixed bottom-5 left-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-6 md:left-6"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
