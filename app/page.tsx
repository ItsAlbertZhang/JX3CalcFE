export default function App() {
    const divStyle = {
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    };

    const ret = (
        <div style={divStyle}>
            <p>Hello, world!</p>
            <p>你好, 世界!</p>
        </div>
    );

    return ret;
}
