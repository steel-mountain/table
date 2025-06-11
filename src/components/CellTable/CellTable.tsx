import { FC } from "react";
import { ArrowDown } from "../../assets/components/ArrowDown";
import { CellProps } from "../Table/components/types/types";
import styles from "./styles.module.scss";

export const CellTable: FC<CellProps> = (props) => {
  const { data, column, row, value, api } = props;

  return (
    <div
      className={styles.wrapper}
      style={{
        padding: "0 10px",
        fontWeight: data.totally === "group" ? "700" : "400",
      }}
    >
      <div>{value}</div>
      <div>{column?.pinned && column?.field !== "amount" ? <ArrowDown cursor="pointer" style={{}} /> : null}</div>
      {/* Следить за expendedIndexes, up or down arrow */}
    </div>
  );
};
