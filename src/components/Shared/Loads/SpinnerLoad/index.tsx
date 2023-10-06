import { HTMLAttributes } from 'react';

import styles from './styles.module.css';

interface ILoadProps {
	divProps: HTMLAttributes<HTMLDivElement>;
}

const SpinnerLoad = (props: ILoadProps) => {
	return (
		<>
			<div className={styles.containerLoad} {...props.divProps}>
				<div className={styles.spinner}>
				</div>
			</div>
		</>
	);
};

export default SpinnerLoad;
