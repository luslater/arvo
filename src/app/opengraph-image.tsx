import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ARVO | Orientação Financeira Independente";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    backgroundColor: "#123044",
                    backgroundImage: "radial-gradient(circle at 20% 20%, #1b435e 0%, #123044 100%)",
                    padding: "70px 80px",
                    fontFamily: "sans-serif",
                    color: "#ffffff",
                }}
            >
                {/* Top Badge & Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            backgroundColor: "#2B6E76",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "26px",
                            fontWeight: "bold",
                            color: "#ffffff",
                        }}
                    >
                        A
                    </div>
                    <span style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "3px" }}>
                        ARVO
                    </span>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            backgroundColor: "rgba(79, 160, 128, 0.2)",
                            color: "#4FA080",
                            padding: "6px 18px",
                            borderRadius: "100px",
                            border: "1px solid rgba(79, 160, 128, 0.4)",
                            marginLeft: "16px",
                        }}
                    >
                        Fee-Only · 100% Independente
                    </span>
                </div>

                {/* Center Headline */}
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div
                        style={{
                            fontSize: "54px",
                            fontWeight: 300,
                            lineHeight: 1.15,
                            margin: 0,
                            color: "#fcfaf7",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <span>Planejamento patrimonial com método.</span>
                        <span style={{ color: "#4FA080", fontStyle: "italic", fontWeight: 400 }}>
                            Sem comissões. Sem conflito de interesse.
                        </span>
                    </div>
                    <p style={{ fontSize: "22px", color: "rgba(255, 255, 255, 0.7)", margin: 0, maxWidth: "850px" }}>
                        Jornada de 7 Pilares · Bússola de Alocação · Calculadora de Aposentadoria
                    </p>
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                        paddingTop: "28px",
                        fontSize: "18px",
                        color: "rgba(255, 255, 255, 0.6)",
                    }}
                >
                    <span style={{ fontWeight: 600, color: "#ffffff" }}>meuarvo.com.br</span>
                    <span>Tecnologia & Orientação Financeira</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
