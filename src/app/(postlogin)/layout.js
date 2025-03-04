// layout.js
import NavbarClient from "@/components/NavbarClient";

export default function NavbarLayout({ children }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <NavbarClient />
            <div className="flex flex-1 overflow-hidden">
                <div className="hidden md:block w-16" />
                <div className="flex-1 w-full overflow-auto">
                    <div id="portal-root"></div>
                    {children}
                </div>
            </div>
        </div>
    );
}