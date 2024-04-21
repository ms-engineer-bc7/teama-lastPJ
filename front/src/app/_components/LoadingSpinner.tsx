import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};
