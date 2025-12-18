import { GalleryVerticalEnd } from "lucide-react";

import { OTPForm } from "@/components/otp-form";
import Link from "next/link";
import Image from "next/image";

export default function VerifyRequest() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <div className=" flex items-center gap-2 self-center">
          <Image src="/logo2.png" alt="Logo" width={32} height={32} />
          ReppoLMS
        </div>
        <OTPForm />
      </div>
    </div>
  );
}
