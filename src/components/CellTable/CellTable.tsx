import { FC } from "react";
import { ArrowDown } from "../../assets/components/ArrowDown";
import { ArrowUp } from "../../assets/components/ArrowUp";
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
      <div>{typeof value === "object" ? +Object.keys(value ?? 0)?.[0] : value}</div>
      {data.totally === "group" && (
        <div>
          {column?.field === "vehicle" && !data.isVisibleChildren ? (
            <ArrowDown cursor="pointer" />
          ) : column?.field === "vehicle" && data.isVisibleChildren ? (
            <ArrowUp cursor="pointer" />
          ) : null}
        </div>
      )}
    </div>
  );
};
