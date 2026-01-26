"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import debounce from "lodash/debounce";

const QRCodeGenerator = () => {
    const qrRef = useRef(null);
    const qrCodeRef = useRef(null);
    const updateRef = useRef(null);

    // LOADING STATE
    const [isUpdating, setIsUpdating] = useState(false);

    // CORE
    const [url, setUrl] = useState("https://example.com");
    const [finalURL, setFinalURL] = useState(url);
    const [size, setSize] = useState(320);

    // COLORS
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    // DOTS
    const [dotStyle, setDotStyle] = useState("dots");

    // EYES
    const [eyeStyle, setEyeStyle] = useState("square");
    const [eyeColor, setEyeColor] = useState("#000000");

    // LOGO
    const [logoImage, setLogoImage] = useState("");
    const [logoSize, setLogoSize] = useState(0.25);
    const [logoMargin, setLogoMargin] = useState(10);

    // GRADIENT
    const [useGradient, setUseGradient] = useState(false);
    const [gradientFrom, setGradientFrom] = useState("#000000");
    const [gradientTo, setGradientTo] = useState("#6366f1");

    // QR OPTIONS
    const [errorCorrection, setErrorCorrection] = useState("M");
    const [quietZone, setQuietZone] = useState(10);

    // EXPORT
    const [exportType, setExportType] = useState("png");

    // URL SHORTENING
    const [shortenURL, setShortenURL] = useState(false);
    const [shortening, setShortening] = useState(false);

    // INIT QR ONCE
    useEffect(() => {
        if (!qrRef.current) return;

        qrCodeRef.current = new QRCodeStyling({
            width: size,
            height: size,
            data: finalURL,
            image: logoImage,
            dotsOptions: {
                type: dotStyle,
                color: fgColor,
            },
            backgroundOptions: {
                color: bgColor,
            },
            cornersSquareOptions: {
                type: eyeStyle,
                color: eyeColor,
            },
            cornersDotOptions: {
                color: eyeColor,
            },
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize: logoSize,
                margin: logoMargin,
            },
            qrOptions: {
                errorCorrectionLevel: errorCorrection,
                margin: quietZone,
            },
        });

        qrCodeRef.current.append(qrRef.current);

        updateRef.current = debounce((opts) => {
            setIsUpdating(true);

            requestAnimationFrame(() => {
                qrCodeRef.current?.update(opts);

                // let browser paint once, then fade back in
                requestAnimationFrame(() => {
                    setIsUpdating(false);
                });
            });
        }, 150);


        return () => updateRef.current?.cancel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // SHORTEN URL (SEPARATE SO IT DOESN’T FEEL LIKE ASS)
    useEffect(() => {
        let cancelled = false;

        const shorten = async () => {
            if (!shortenURL || url.length <= 30) {
                setFinalURL(url);
                return;
            }

            setShortening(true);
            try {
                const res = await fetch(
                    `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
                        url,
                    )}`,
                );
                const short = await res.text();
                if (!cancelled) setFinalURL(short);
            } catch {
                if (!cancelled) setFinalURL(url);
            } finally {
                if (!cancelled) setShortening(false);
            }
        };

        shorten();
        return () => (cancelled = true);
    }, [url, shortenURL]);

    // UPDATE QR
    useEffect(() => {
        updateRef.current?.({
            width: size,
            height: size,
            data: finalURL,
            image: logoImage,
            dotsOptions: {
                type: dotStyle,
                color: useGradient ? undefined : fgColor,
                gradient: useGradient
                    ? {
                          type: "linear",
                          rotation: 0,
                          colorStops: [
                              { offset: 0, color: gradientFrom },
                              { offset: 1, color: gradientTo },
                          ],
                      }
                    : undefined,
            },
            backgroundOptions: { color: bgColor },
            cornersSquareOptions: {
                type: eyeStyle,
                color: eyeColor,
            },
            cornersDotOptions: { color: eyeColor },
            imageOptions: {
                imageSize: logoSize,
                margin: logoMargin,
            },
            qrOptions: {
                errorCorrectionLevel: errorCorrection,
                margin: quietZone,
            },
        });
    }, [
        size,
        finalURL,
        fgColor,
        bgColor,
        dotStyle,
        eyeStyle,
        eyeColor,
        logoImage,
        logoSize,
        logoMargin,
        useGradient,
        gradientFrom,
        gradientTo,
        errorCorrection,
        quietZone,
    ]);

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col md:flex-row bg-neutral-100">
            {/* SIDEBAR */}
            <aside className="w-full md:w-[420px] border-r bg-white flex flex-col">
                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* URL */}
                    <section className="space-y-3">
                        <label className="text-sm font-semibold">
                            Destination URL
                        </label>
                        <input
                            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={shortenURL}
                                onChange={(e) =>
                                    setShortenURL(e.target.checked)
                                }
                            />
                            Auto-shorten long URLs
                        </label>
                    </section>

                    {/* SIZE */}
                    <section className="space-y-2">
                        <label className="text-sm font-semibold">
                            Size: {size}px
                        </label>
                        <input
                            type="range"
                            min="150"
                            max="800"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                        />
                    </section>

                    {/* APPEARANCE */}
                    <section className="rounded-xl border p-4 space-y-4">
                        <h3 className="text-sm font-semibold">Appearance</h3>

                        <label className="text-sm">
                            Dot Style
                            <select
                                className="mt-1 w-full border rounded p-2"
                                value={dotStyle}
                                onChange={(e) => setDotStyle(e.target.value)}
                            >
                                <option value="dots">Dots</option>
                                <option value="rounded">Rounded</option>
                                <option value="square">Square</option>
                                <option value="extra-rounded">
                                    Extra Rounded
                                </option>
                            </select>
                        </label>

                        <label className="text-sm">
                            Eye Style
                            <select
                                className="mt-1 w-full border rounded p-2"
                                value={eyeStyle}
                                onChange={(e) => setEyeStyle(e.target.value)}
                            >
                                <option value="square">Square</option>
                                <option value="dot">Dot</option>
                                <option value="extra-rounded">
                                    Extra Rounded
                                </option>
                            </select>
                        </label>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Eye Color</span>
                            <input
                                type="color"
                                value={eyeColor}
                                onChange={(e) => setEyeColor(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* LOGO */}
                    <section className="rounded-xl border p-4 space-y-4">
                        <h3 className="text-sm font-semibold">Logo</h3>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const reader = new FileReader();
                                reader.onload = () =>
                                    setLogoImage(reader.result);
                                reader.readAsDataURL(file);
                            }}
                        />

                        {logoImage && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm">
                                        Logo Size: {Math.round(logoSize * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="0.5"
                                        step="0.05"
                                        value={logoSize}
                                        onChange={(e) =>
                                            setLogoSize(Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm">
                                        Logo Margin: {logoMargin}px
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="40"
                                        value={logoMargin}
                                        onChange={(e) =>
                                            setLogoMargin(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    className="text-sm text-red-600 underline"
                                    onClick={() => setLogoImage("")}
                                >
                                    Remove logo
                                </button>
                            </>
                        )}
                    </section>

                    {/* COLORS */}
                    <section className="rounded-xl border p-4 space-y-3">
                        <h3 className="text-sm font-semibold">Colors</h3>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Foreground</span>
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Background</span>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={useGradient}
                                onChange={(e) =>
                                    setUseGradient(e.target.checked)
                                }
                            />
                            Use gradient
                        </label>

                        {useGradient && (
                            <div className="flex gap-4">
                                <input
                                    type="color"
                                    value={gradientFrom}
                                    onChange={(e) =>
                                        setGradientFrom(e.target.value)
                                    }
                                />
                                <input
                                    type="color"
                                    value={gradientTo}
                                    onChange={(e) =>
                                        setGradientTo(e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </section>

                    {/* QR OPTIONS */}
                    <section className="rounded-xl border p-4 space-y-4">
                        <h3 className="text-sm font-semibold">QR Options</h3>

                        <label className="text-sm">
                            Error Correction
                            <select
                                className="mt-1 w-full border rounded p-2"
                                value={errorCorrection}
                                onChange={(e) =>
                                    setErrorCorrection(e.target.value)
                                }
                            >
                                <option value="L">Low (L)</option>
                                <option value="M">Medium (M)</option>
                                <option value="Q">Quartile (Q)</option>
                                <option value="H">High (H)</option>
                            </select>
                        </label>

                        <div className="space-y-1">
                            <label className="text-sm">
                                Quiet Zone: {quietZone}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={quietZone}
                                onChange={(e) =>
                                    setQuietZone(Number(e.target.value))
                                }
                            />
                        </div>
                    </section>
                </div>

                {/* STICKY FOOTER */}
                <div className="sticky bottom-0 border-t bg-white p-4 space-y-3">
                    <select
                        className="w-full border rounded p-2"
                        value={exportType}
                        onChange={(e) => setExportType(e.target.value)}
                    >
                        <option value="png">PNG</option>
                        <option value="svg">SVG</option>
                    </select>

                    <button
                        disabled={shortening}
                        className={`w-full rounded-xl py-3 font-semibold text-white transition
        ${
            shortening
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
                        onClick={() =>
                            qrCodeRef.current?.download({
                                name: "qr-code",
                                extension: exportType,
                            })
                        }
                    >
                        {shortening ? "Optimizing…" : "Download QR"}
                    </button>
                </div>
            </aside>

            {/* PREVIEW */}
            <main className="flex-1 flex items-center justify-center relative p-4">
                <div
                    className={`rounded-2xl bg-white p-6 md:p-8 shadow-xl transition-opacity duration-200
        ${isUpdating ? "opacity-40" : "opacity-100"}
    `}
                >
                    <div ref={qrRef} />
                </div>

                {shortening && (
                    <div className="absolute bottom-4 text-sm text-gray-600">
                        Optimizing URL…
                    </div>
                )}
            </main>
        </div>
    );
};

export default QRCodeGenerator;
