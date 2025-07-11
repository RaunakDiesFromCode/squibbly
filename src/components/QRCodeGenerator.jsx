import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import debounce from "lodash/debounce";

const QRCodeGenerator = () => {
    const qrRef = useRef(null);
    const [url, setUrl] = useState("https://example.com");
    const [size, setSize] = useState(300);
    const [dotStyle, setDotStyle] = useState("dots");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [fgColor, setFgColor] = useState("#000000");
    const [logoImage, setLogoImage] = useState("");
    const [shortenURL, setShortenURL] = useState(false);
    const [finalEncodedURL, setFinalEncodedURL] = useState("");

    const qrCode = useRef(
        new QRCodeStyling({
            width: size,
            height: size,
            data: url,
            image: logoImage,
            dotsOptions: {
                color: fgColor,
                type: dotStyle,
            },
            backgroundOptions: {
                color: bgColor,
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10,
            },
        })
    );

    useEffect(() => {
        const generateQRCode = debounce(async () => {
            let finalURL = url;

            // Shorten the URL if toggle is enabled and it's long
            if (shortenURL && url.length > 30) {
                try {
                    const response = await fetch(
                        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
                            url
                        )}`
                    );
                    const shortUrl = await response.text();
                    finalURL = shortUrl;
                } catch (error) {
                    console.error("Failed to shorten URL. Using original.");
                }
            }

            qrCode.current.update({
                width: size,
                height: size,
                data: finalURL,
                image: logoImage,
                dotsOptions: {
                    color: fgColor,
                    type: dotStyle,
                },
                backgroundOptions: {
                    color: bgColor,
                },
            });

            qrRef.current.innerHTML = "";
            qrCode.current.append(qrRef.current);
        }, 300); // debounce delay in ms

        generateQRCode();
        return () => generateQRCode.cancel();
    }, [url, size, fgColor, bgColor, dotStyle, logoImage, shortenURL]);

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">
                Custom QR Code Generator
            </h1>

            <input
                className="w-full border p-2 mb-4"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />

            <div className="flex gap-4 mb-4">
                <div>
                    <label className="block text-sm">Foreground Color</label>
                    <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm">Background Color</label>
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm">Size</label>
                    <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        min="100"
                        max="1000"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm mb-1">Dot Style</label>
                <select
                    value={dotStyle}
                    onChange={(e) => setDotStyle(e.target.value)}
                    className="border p-2"
                >
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm mb-1">
                    Center Icon URL (Optional)
                </label>
                <input
                    type="text"
                    value={logoImage}
                    onChange={(e) => setLogoImage(e.target.value)}
                    className="w-full border p-2 mb-2"
                    placeholder="https://example.com/logo.png"
                />
                <label className="block text-sm mb-1">
                    Or upload image from computer
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                                setLogoImage(ev.target.result);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="w-full border p-2"
                />
            </div>

            <div className="mb-4">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={shortenURL}
                        onChange={(e) => setShortenURL(e.target.checked)}
                    />
                    Shorten long URLs using TinyURL
                </label>
            </div>

            <div
                ref={qrRef}
                className="flex justify-center items-center p-4 bg-gray-100 rounded-lg"
            />

            <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => {
                    qrCode.current.download({
                        name: "qr-code",
                        extension: "png",
                    });
                }}
            >
                Download QR Code
            </button>
        </div>
    );
};

export default QRCodeGenerator;
