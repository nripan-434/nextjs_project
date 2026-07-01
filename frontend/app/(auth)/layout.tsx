import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
  <main>{children}</main>
  </div>
}