"use client";

type ErrorViewProps = {
    message: string;
    onRetry: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
    return (
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        <h2>エラーが発生しました</h2>
        <p>{message}</p>
        <button
            onClick={onRetry}
            style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
            }}
        >
            再読み込み
        </button>
        </div>
    );
}