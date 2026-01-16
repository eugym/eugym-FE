import { Suspense } from "react";
import VerifyEmail from "./verifyEmail";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
