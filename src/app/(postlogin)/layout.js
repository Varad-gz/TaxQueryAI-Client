import Navbar from "@/components/Navbar";

export default async function NavbarLayout({ children }) {
    return (
        <div className="flex h-screen">
            <div className="fixed h-full">
                <Navbar />
            </div>
            <div className="flex-1 overflow-auto ml-[100px] scrollbar-thin scrollbar-thumb-zinc-700">
                <div id="portal-root"></div>
                {children}
            </div>
        </div>
    );
}