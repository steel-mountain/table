import "./styles.scss";

export const NativeReactLoading = () => {
  return (
    <div className="loader-container">
      <div style={{ position: "absolute", color: "darkgray" }}>Нет данных</div>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
