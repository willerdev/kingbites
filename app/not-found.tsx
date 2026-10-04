import Link from "next/link";
import { Container } from "@/components/container";
import { goldButtonClass } from "@/lib/styles";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-script text-4xl text-gold-deep">Off the menu</p>
      <h1 className="mt-2 text-3xl font-extrabold">That page is not on the board.</h1>
      <Link href="/" className={`${goldButtonClass} mt-6`}>
        Back home
      </Link>
    </Container>
  );
}
