export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>
                        &copy; {new Date().getFullYear()} ShopEase. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Contact
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Privacy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
