import styles from "./styles.module.scss";

export const HeaderComponent = (props: any) => {
  const { headerName, field } = props;

  return (
    <div className={styles.wrapper}>
      <div>{headerName}</div>
    </div>
  );
};
