import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#1a1a1a",
                    color: "#ff5555",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    zIndex: 99999,
                    overflow: "auto",
                    fontFamily: "monospace"
                }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>⚠️ Critical Error</h1>

                    <div style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        maxWidth: "800px",
                        width: "100%",
                        border: "2px solid #ff5555",
                        whiteSpace: "pre-wrap",
                        maxHeight: "60vh",
                        overflow: "auto"
                    }}>
                        <strong style={{ color: "#ff5555", fontSize: "1.2rem" }}>{this.state.error?.toString()}</strong>
                        <div style={{ marginTop: "10px", color: "#aaa", fontSize: "0.9rem" }}>
                            {this.state.error?.stack}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                        <button
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "#555",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(this.state.error?.toString() + "\n" + this.state.error?.stack);
                                alert("Error copied to clipboard!");
                            }}
                        >
                            📋 Copy Error
                        </button>

                        <button
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                        >
                            🔄 Clear Data & Reload
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
