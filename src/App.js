import React from "react";
import QRCodeGenerator from "./components/QRCodeGenerator";

const App = () => {
    return (
        <div className="h-screen flex flex-col">
            <nav className="h-16 bg-gray-800 text-white flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20">
                <h1 className="font-bold text-sm sm:text-base md:text-lg">SquibblyQR</h1>
                <a
                    href="https://www.github.com/RaunakDiesFromCode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-xs sm:text-sm md:text-base"
                >
                    RaunakDiesFromCode
                </a>
            </nav>

            <QRCodeGenerator />
        </div>
    );
};

export default App;
