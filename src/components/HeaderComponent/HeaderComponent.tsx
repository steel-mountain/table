import { ArrowDown } from "../../assets/components/ArrowDown";
import styles from "./styles.module.scss";

export const HeaderComponent = (props: any) => {
  const { headerName, field } = props;

  return (
    <div className={styles.wrapper}>
      <div>{headerName}</div>
      <div style={{ alignItems: "center" }}>{field === "vehicle" && <ArrowDown cursor="pointer" />}</div>
    </div>
  );
};
