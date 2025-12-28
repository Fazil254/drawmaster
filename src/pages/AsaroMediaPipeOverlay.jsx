import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
const px = (lm, w, h) => ({ x: lm.x * w, y: lm.y * h });
const mid = (a, b) => (a + b) / 2;
const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
const angle = (p1, p2) => {
    const dy = p2.y - p1.y;
    const dx = p2.x - p1.x;
    let rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI);
    if (deg > 90) deg -= 180;
    if (deg < -90) deg += 180;
    return deg;
};
const drawPoint = (ctx, p, label, color = "lime") => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "blue";
    ctx.font = "12px Arial";
    ctx.fillText(label, p.x + 5, p.y - 5);
};
const vLine = (ctx, x, y1, y2) => {
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
};
const hLine = (ctx, y, x1, x2, label) => {
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    if (label) ctx.fillText(label, x2 + 6, y - 4);
};
const dotted = (ctx, p1, p2, color = null) => {
    if (color) ctx.strokeStyle = color;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
};
const styles = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        color: "#333",
        backgroundColor: "#fafafa",
    },

    header: {
        borderBottom: "2px solid #4A90E2",
        paddingBottom: "10px",
        marginBottom: "10px",
        color: "#4A90E2",
        letterSpacing: "0.5px",
    },

    subtitle: {
        fontStyle: "italic",
        color: "#666",
        marginBottom: "20px",
    },
    controls: {
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center",
        marginBottom: "25px",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#f9f9f9",
    },

    inputGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    textInput: {
        padding: "6px 8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "80px",
    },

    button: {
        padding: "9px 18px",
        backgroundColor: "#50E3C2",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        letterSpacing: "0.3px",
        transition: "background-color 0.2s ease, transform 0.15s ease",
    },

    buttonHover: {
        backgroundColor: "#3fcfb0",
        transform: "translateY(-1px)",
    },

    imageContainer: {
        position: "relative",
        marginBottom: "30px",
        border: "2px solid #4A90E2",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#000",
    },

    image: {
        width: "100%",
        display: "block",
    },

    canvas: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    },
    gridLayout: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "25px",
    },
    panel: {
        padding: "20px",
        borderRadius: "10px",
        background: "#fff",
        border: "1px solid #eee",
        boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
    },

    panelAccentYellow: {
        borderLeft: "5px solid #E2BB4A",
    },

    panelAccentBlue: {
        borderLeft: "5px solid #3498DB",
    },

    panelTitle: {
        marginBottom: "15px",
        paddingBottom: "6px",
        borderBottom: "1px dashed #ccc",
        color: "#333",
        letterSpacing: "0.4px",
    },

    measurementGroup: {
        marginTop: "18px",
        paddingTop: "10px",
        borderTop: "1px dotted #ddd",
    },

    measurementItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 0",
        fontSize: "0.95em",
    },

    label: {
        color: "#555",
    },

    value: {
        fontWeight: "bold",
        color: "#000",
    },

    valueHighlight: {
        color: "#D9534F",
    },
    responsiveSmall: {
        "@media (max-width: 768px)": {
            container: {
                padding: "15px",
            },
            controls: {
                flexDirection: "column",
                alignItems: "stretch",
            },
            gridLayout: {
                gridTemplateColumns: "1fr",
            },
            button: {
                width: "100%",
            },

        },
    },
};
export default function Asaro_Loomis_Construction_Enhanced() {
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const faceMeshRef = useRef(null);
    const lastPoints = useRef(null);
    const [imageURL, setImageURL] = useState("");
    const [headHeight, setHeadHeight] = useState("");
    const [loomisRadius, setLoomisRadius] = useState(0);
    const [loomis, setLoomis] = useState({ HA: 0, AD: 0, DM: 0, ME: 0 });
    const [eyeBalance, setEyeBalance] = useState({ ECLP: 0, ECRP: 0, diff: 0, ALEi: 0, DLEi: 0, RLEi: 0, DREi: 0, DREo: 0, });
    const [noseHt, setNoseHt] = useState(0);
    const [noseMeasure, setNoseMeasure] = useState({ NtNl: 0, NlNb: 0, NbNr: 0, NrNt: 0, });
    const [newMeasures, setNewMeasures] = useState({
        ICD: 0,
        ULip: 0,
        LLip: 0,
        EarH: 0,
        LPToChin: 0,
        RPToChin: 0,
        AToNt: 0,
        ExoCD: 0,
        EyeSlantL: 0,
        LLOI: 0,
        EyeSlantR: 0,
        EyeHeightL: 0,
        EyeHeightR: 0,
        ELbToLPE: 0,
        ERbToRPE: 0,
        MouthW: 0,
        AToEC: 0,
        NLML: 0,
        NRMR: 0,
        ECLEo: 0,
        ECREo: 0,
        LEoELt: 0,
        REoERt: 0,
    });
    useEffect(() => {
        const fm = new FaceMesh({
            locateFile: (f) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
        });
        fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
        });
        fm.onResults(draw);
        faceMeshRef.current = fm;
    }, []);
    const draw = useCallback((results) => {
        if (!results.multiFaceLandmarks?.length) return;
        const img = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const lm = results.multiFaceLandmarks[0];
        const { width, height } = canvas;
        const A = px(lm[9], width, height);
        const D = px(lm[1], width, height);
        const E = px(lm[152], width, height);
        const H = { x: A.x, y: A.y - (D.y - A.y) };
        const M = { x: D.x, y: (D.y + E.y) / 2 };
        const F = px(lm[234], width, height);
        const G = px(lm[454], width, height);
        const L = px(lm[13], width, height);
        const LP = {
            x: mid(lm[33].x, lm[133].x) * width,
            y: mid(lm[159].y, lm[145].y) * height,
        };
        const RP = {
            x: mid(lm[263].x, lm[362].x) * width,
            y: mid(lm[386].y, lm[374].y) * height,
        };
        const eyeY = (LP.y + RP.y) / 2;
        const EC = { x: H.x, y: eyeY };
        const LEo = px(lm[33], width, height);
        const LEi = px(lm[133], width, height);
        const REi = px(lm[362], width, height);
        const REo = px(lm[263], width, height);
        const LUC = px(lm[159], width, height);
        const LLC = px(lm[144], width, height);
        const RUC = px(lm[386], width, height);
        const RLC = px(lm[373], width, height);
        const ELt = px(lm[127], width, height);
        const ELb = px(lm[93], width, height);
        const ERt = px(lm[356], width, height);
        const ERb = px(lm[323], width, height);
        const Nt = px(lm[6], width, height);
        const Nl = px(lm[48], width, height);
        const Nr = px(lm[278], width, height);
        const Nb = px(lm[94], width, height);
        const ULc = px(lm[0], width, height);
        const LLc = px(lm[17], width, height);
        const ML = px(lm[61], width, height);
        const MR = px(lm[291], width, height);
        const LP_on_E = { x: LP.x, y: E.y };
        const RP_on_E = { x: RP.x, y: E.y };
        lastPoints.current = {
            H, A, D, E, EC, LP, RP, Nt, Nl, Nb, Nr, M, L,
            LEi, REi, LEo, REo, LUC, LLC, RUC, RLC,
            ULc, LLc, ML, MR,
            ELt, ELb, ERt, ERb,
            LP_on_E,
            RP_on_E
        };
        const Hh = { x: A.x, y: H.y - (D.y - A.y) * 0.2 };
        const cY = (Hh.y + L.y) / 2;
        const r = Math.abs(L.y - Hh.y) / 2;
        const center = { x: A.x, y: cY };
        const radiusEnd = { x: A.x + r, y: cY };

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.stroke();
        dotted(ctx, center, radiusEnd, "blue");
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(255, 0, 0, 0.7)";

        vLine(ctx, H.x, H.y, E.y);
        hLine(ctx, H.y, F.x, G.x, "Top (H)");
        hLine(ctx, A.y, F.x, G.x, "Brow (A)");
        hLine(ctx, eyeY, F.x, G.x, "Eyes (EC)");
        hLine(ctx, D.y, F.x, G.x, "Nose (D)");
        hLine(ctx, M.y, F.x, G.x, "Mouth (M)");
        hLine(ctx, E.y, F.x, G.x, "Chin (E)");

        ctx.strokeStyle = "cyan";
        ctx.beginPath();
        ctx.moveTo(EC.x, EC.y); ctx.lineTo(LP.x, LP.y);
        ctx.moveTo(EC.x, EC.y); ctx.lineTo(RP.x, RP.y);
        ctx.stroke();

        ctx.strokeStyle = "magenta";
        dotted(ctx, A, EC);

        ctx.strokeStyle = "cyan";
        dotted(ctx, EC, LEo);
        dotted(ctx, EC, REo);


        ctx.strokeStyle = "purple"; dotted(ctx, LP, D); dotted(ctx, RP, D);

        ctx.strokeStyle = "blue";
        dotted(ctx, Nt, Nl); dotted(ctx, Nl, Nb); dotted(ctx, Nb, Nr); dotted(ctx, Nr, Nt); dotted(ctx, A, Nt);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        dotted(ctx, Nt, Nb);
        ctx.lineWidth = 1.2;

        ctx.strokeStyle = "olive";
        dotted(ctx, Nl, ML);
        dotted(ctx, Nr, MR);

        dotted(ctx, LEi, REi, "yellow");

        ctx.strokeStyle = "green";
        dotted(ctx, LEo, REo);

        dotted(ctx, LEo, ELt, "green");
        dotted(ctx, REo, ERt, "green");

        ctx.strokeStyle = "magenta";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(LEi.x, LEi.y); ctx.lineTo(LEo.x, LEo.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(REi.x, REi.y); ctx.lineTo(REo.x, REo.y); ctx.stroke();
        ctx.lineWidth = 1.2;

        dotted(ctx, ULc, D, "orange");

        ctx.strokeStyle = "darkgrey";
        dotted(ctx, { x: LUC.x, y: LUC.y }, { x: LUC.x, y: LLC.y });
        dotted(ctx, { x: RUC.x, y: RUC.y }, { x: RUC.x, y: RLC.y });

        ctx.strokeStyle = "red";
        dotted(ctx, ML, MR, "red");


        ctx.strokeStyle = "grey";
        vLine(ctx, ELt.x, ELt.y, ELb.y);
        vLine(ctx, ERt.x, ERt.y, ERb.y);

        ctx.strokeStyle = "yellowgreen";
        dotted(ctx, ELb, LP_on_E, "yellowgreen");
        dotted(ctx, ERb, RP_on_E, "yellowgreen");


        ctx.strokeStyle = "orange";
        ctx.lineWidth = 1.5;

        dotted(ctx, LP, LP_on_E, "orange");
        dotted(ctx, RP, RP_on_E, "orange");

        drawPoint(ctx, LP_on_E, "LPE", "orange");
        drawPoint(ctx, RP_on_E, "RPE", "orange");

        ctx.lineWidth = 1.2;
        drawPoint(ctx, H, "H"); drawPoint(ctx, A, "A"); drawPoint(ctx, D, "D"); drawPoint(ctx, E, "E");
        drawPoint(ctx, M, "M"); drawPoint(ctx, EC, "EC"); drawPoint(ctx, LP, "LP"); drawPoint(ctx, RP, "RP");
        drawPoint(ctx, LEi, "LEi", "yellow"); drawPoint(ctx, REi, "REi", "yellow");
        drawPoint(ctx, LEo, "LEo", "green"); drawPoint(ctx, REo, "REo", "green");
        drawPoint(ctx, LUC, "LUC", "darkgrey"); drawPoint(ctx, LLC, "LLc", "darkgrey");
        drawPoint(ctx, RUC, "RUC", "darkgrey"); drawPoint(ctx, RLC, "RLC", "darkgrey");
        drawPoint(ctx, ULc, "ULc", "red"); drawPoint(ctx, LLc, "LLc", "red");
        drawPoint(ctx, ML, "ML", "red"); drawPoint(ctx, MR, "MR", "red");
        drawPoint(ctx, ELt, "ELt", "grey"); drawPoint(ctx, ELb, "ELb", "grey");
        drawPoint(ctx, ERt, "ERt", "grey"); drawPoint(ctx, ERb, "ERb", "grey");
        drawPoint(ctx, Nt, "Nt", "orange"); drawPoint(ctx, Nl, "Nl", "orange");
        drawPoint(ctx, Nr, "Nr", "orange"); drawPoint(ctx, Nb, "Nb", "orange");
        drawPoint(ctx, L, "L", "red");

    }, []);
    const applyMeasurements = useCallback(() => {
        if (!headHeight || !lastPoints.current) return;

        const { H, A, D, E, EC, LP, RP, LEi, REi, LEo, REo, LUC, LLC, RUC, RLC, ULc, LLc, ELt, ELb, ERt, ERb, LP_on_E, RP_on_E, Nt, Nl, Nb, Nr, ML, MR, L } = lastPoints.current;

        const pixelHEDistance = dist(H, E);
        const scale = Number(headHeight) / pixelHEDistance;
        const unitAD = dist(A, D) * scale;
        const DToE = dist(D, E) * scale;

        const Hh_pixel_y = H.y - (D.y - A.y) * 0.2;
        const r_pixel = Math.abs(L.y - Hh_pixel_y) / 2;
        setLoomisRadius(r_pixel * scale);


        setLoomis({ HA: dist(H, A) * scale, AD: unitAD, DM: DToE / 2, ME: DToE / 2 });
        setEyeBalance({ ECLP: dist(EC, LP) * scale, ALEi: dist(A, LEi) * scale, RLEi: dist(A, REi) * scale, DLEi: dist(D, LEi) * scale, scale, DREi: dist(D, REi) * scale, DREo: dist(D, REo) * scale, ECRP: dist(EC, RP) * scale, diff: Math.abs(dist(EC, LP) - dist(EC, RP)) * scale, });
        setNoseMeasure({ NtNl: dist(Nt, Nl) * scale, NlNb: dist(Nl, Nb) * scale, NbNr: dist(Nb, Nr) * scale, NrNt: dist(Nr, Nt) * scale, });
        setNoseHt(dist(Nt, Nb) * scale);
        const eyeHeightLeft = (LUC && LLC) ? Math.abs(LUC.y - LLC.y) * scale : 0;
        const eyeHeightRight = (RUC && RLC) ? Math.abs(RUC.y - RLC.y) * scale : 0;
        const earHeightLeft = (ELt && ELb) ? Math.abs(ELt.y - ELb.y) * scale : 0;
        const earHeightRight = (ERt && ERb) ? Math.abs(ERt.y - ERb.y) * scale : 0;

        setNewMeasures({
            ICD: dist(LEi, REi) * scale,
            ULip: dist(D, ULc) * scale,
            LLip: dist(ULc, LLc) * scale,
            EarH: (earHeightLeft + earHeightRight) / 2,
            LPToChin: dist(LP, LP_on_E) * scale,
            RPToChin: dist(RP, RP_on_E) * scale,
            AToNt: dist(A, Nt) * scale,
            ExoCD: dist(LEo, REo) * scale,
            EyeSlantL: angle(LEi, LEo),
            LLOI: dist(LEi, LEo) * scale,
            EyeSlantR: angle(REi, REo),
            EyeHeightL: eyeHeightLeft,
            EyeHeightR: eyeHeightRight,
            ELbToLPE: (ELb && LP_on_E) ? dist(ELb, LP_on_E) * scale : 0,
            ERbToRPE: (ERb && RP_on_E) ? dist(ERb, RP_on_E) * scale : 0,
            MouthW: dist(ML, MR) * scale,
            AToEC: dist(A, EC) * scale,
            NLML: dist(Nl, ML) * scale,
            NRMR: dist(Nr, MR) * scale,
            ECLEo: dist(EC, LEo) * scale,
            ECREo: dist(EC, REo) * scale,
            LEoELt: (LEo && ELt) ? dist(LEo, ELt) * scale : 0,
            REoERt: (REo && ERt) ? dist(REo, ERt) * scale : 0,
        });

    }, [headHeight]);
    const handleUpload = (e) => {
        const f = e.target.files?.[0];
        if (f) setImageURL(URL.createObjectURL(f));
    };

    useEffect(() => {
        if (imageURL && faceMeshRef.current) {
            const timer = setTimeout(() => {
                faceMeshRef.current.send({ image: imgRef.current });
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [imageURL, draw]);

    useEffect(() => {
        if (headHeight) {
            applyMeasurements();
        }
    }, [headHeight, applyMeasurements]);
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>
                Head Drawing Precision Guide
            </h1>
            <p style={{ fontStyle: 'italic', marginBottom: 20, color: '#666' }}>
                Analyzing facial geometry using MediaPipe landmarks mapped to classical drawing construction methods.
            </p>

            <div style={styles.controls}>
                <input type="file" accept="image/*" onChange={handleUpload} />

                <div style={styles.inputGroup}>
                    <label>Head height (H–E in cm):</label>
                    <input
                        type="number"
                        value={headHeight}
                        onChange={(e) => setHeadHeight(e.target.value)}
                        style={{ width: 80, marginLeft: 10, padding: 5, border: '1px solid #ccc', borderRadius: 4 }}
                    />
                </div>
                <button onClick={applyMeasurements} style={styles.button}>
                    Apply Scale
                </button>
            </div>
            <div style={styles.imageContainer}>
                {imageURL && (
                    <>
                        <img ref={imgRef} src={imageURL} alt="Face to analyze" style={{ width: "100%", display: 'block' }} />
                        <canvas
                            ref={canvasRef}
                            style={{
                                position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
                            }}
                        />
                    </>
                )}
            </div>
            <div style={styles.gridLayout} className="panel">
                <div style={{ ...styles.panel, borderLeft: '4px solid #E2BB4A' }} className="panel2">
                    <h4 style={{ ...styles.panelTitle, color: '#E2BB4A' }}>Vertical Construction & Eye Metrics</h4>

                    <div style={styles.measurementGroup}>
                        <strong>Loomis Head Sphere Metrics</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>Sphere Radius</span><span style={{ ...styles.value, color: 'red' }}>{loomisRadius.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Sphere Diameter</span><span style={{ ...styles.value, color: 'red' }}>{(loomisRadius * 2).toFixed(2)} cm</span></div>
                    </div>

                    <div style={styles.measurementGroup}>
                        <strong>Loomis Vertical Divisions (H-A-D-E)</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>H (Top) to A (Brow)</span><span style={styles.value}>{loomis.HA.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>A (Brow) to EC (Eye Center)</span><span style={styles.value}>{newMeasures.AToEC.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>A (Brow) to D (Nose Base)</span><span style={styles.value}>{loomis.AD.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>D (Nose Base) to M (Mouth)</span><span style={styles.value}>{loomis.DM.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>M (Mouth) to E (Chin)</span><span style={styles.value}>{loomis.ME.toFixed(2)} cm</span></div>
                    </div>

                    <div style={styles.measurementGroup}>
                        <strong>Canthal Dimensions & Slant</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>Inter-Canthal Dist. (LEi to REi)</span><span style={styles.value}>{newMeasures.ICD.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Exo-Canthal Dist. (LEo to REo)</span><span style={styles.value}>{newMeasures.ExoCD.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Left Slant Angle</span><span style={styles.value}>{newMeasures.EyeSlantL.toFixed(2)}`</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>LLO to LLi </span><span style={styles.value}>{newMeasures.LLOI.toFixed(2)}cm</span></div>

                        <div style={styles.measurementItem}><span style={styles.label}>Right Slant Angle</span><span style={styles.value}>{newMeasures.EyeSlantR.toFixed(2)}`</span></div>
                    </div>
                    <div style={styles.measurementGroup}>
                        <strong>Pupil Balance & Projection</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>EC to Left Pupil (LP)</span><span style={styles.value}>{eyeBalance.ECLP.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>A to LEi</span><span style={styles.value}>{eyeBalance.ALEi.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>A to REi</span><span style={styles.value}>{eyeBalance.RLEi.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>D to LEi</span><span style={styles.value}>{eyeBalance.DLEi.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>D to REi</span><span style={styles.value}>{eyeBalance.DREi.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>D to REO</span><span style={styles.value}>{eyeBalance.DREo.toFixed(2)} cm</span></div>

                        <div style={styles.measurementItem}><span style={styles.label}>EC to Right Pupil (RP)</span><span style={styles.value}>{eyeBalance.ECRP.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Pupil Balance Difference</span><span style={{ ...styles.value, color: '#D9534F' }}>{eyeBalance.diff.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Left Pupil (LP) to Chin Line (E)</span><span style={styles.value}>{newMeasures.LPToChin.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>RP to Chin Line (E)</span><span style={styles.value}>{newMeasures.RPToChin.toFixed(2)} cm</span></div>

                    </div>
                </div>
                <div style={{ ...styles.panel, borderLeft: '4px solid #3498DB' }} className="panel2">
                    <h4 style={{ ...styles.panelTitle, color: '#3498DB' }}>Nose, Mouth, & Ear Ratios</h4>

                    <div style={styles.measurementGroup}>
                        <strong>Nose Geometry</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>Brow (A) to Nose Top (Nt)</span><span style={styles.value}>{newMeasures.AToNt.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Nose Height (Nt to Nb)</span><span style={styles.value}>{noseHt.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Nose Width (Nb to Nr)</span><span style={styles.value}>{noseMeasure.NbNr.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Nose Width (Nt to Nl)</span><span style={styles.value}>{noseMeasure.NtNl.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Nose Width (Nt to Nr)</span><span style={styles.value}>{noseMeasure.NrNt.toFixed(2)} cm</span></div>
                    </div>
                    <div style={styles.measurementGroup}>
                        <strong>Mouth & Lip Metrics</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>Mouth Width (ML to MR)</span><span style={styles.value}>{newMeasures.MouthW.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Upper Lip Height (D to ULc)</span><span style={styles.value}>{newMeasures.ULip.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Nose Left to Mouth Left (Nl to ML)</span><span style={styles.value}>{newMeasures.NLML.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Nose r to Mouth r (Nr to Mr)</span><span style={styles.value}>{newMeasures.NRMR.toFixed(2)} cm</span></div>
                    </div>
                    <div style={styles.measurementGroup}>
                        <strong>Ear & Alignment Metrics</strong>
                        <div style={styles.measurementItem}><span style={styles.label}>Avg. Ear Height (ELt to ELb)</span><span style={styles.value}>{newMeasures.EarH.toFixed(2)} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>Left Outer Eye to Ear Top</span><span style={styles.value}>{newMeasures.LEoELt?.toFixed(2) || 'N/A'} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>R to Outer Eye to Ear Top</span><span style={styles.value}>{newMeasures.REoERt?.toFixed(2) || 'N/A'} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}>L TO Ear Bottom to Chin Projection</span><span style={styles.value}>{newMeasures.ELbToLPE?.toFixed(2) || 'N/A'} cm</span></div>
                        <div style={styles.measurementItem}><span style={styles.label}> R TO Ear Bottom to Chin Projection</span><span style={styles.value}>{newMeasures.ERbToRPE?.toFixed(2) || 'N/A'} cm</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}