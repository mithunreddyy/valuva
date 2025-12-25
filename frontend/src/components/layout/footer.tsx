import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/shop"
                className="text-sm text-neutral-600 hover:text-black"
              >
                All Products
              </Link>
              <Link
                href="/shop?isFeatured=true"
                className="text-sm text-neutral-600 hover:text-black"
              >
                Featured
              </Link>
              <Link
                href="/shop?isNewArrival=true"
                className="text-sm text-neutral-600 hover:text-black"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/contact"
                className="text-sm text-neutral-600 hover:text-black"
              >
                Contact Us
              </Link>
              <Link
                href="/shipping"
                className="text-sm text-neutral-600 hover:text-black"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="text-sm text-neutral-600 hover:text-black"
              >
                Returns
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-neutral-600 hover:text-black"
              >
                Our Story
              </Link>
              <Link
                href="/sustainability"
                className="text-sm text-neutral-600 hover:text-black"
              >
                Sustainability
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button size="sm">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-neutral-600">
          <p>© {new Date().getFullYear()} Valuva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
