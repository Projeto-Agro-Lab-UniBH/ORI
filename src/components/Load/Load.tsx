import { HTMLAttributes } from 'react';

interface ILoadProps {
	divProps: HTMLAttributes<HTMLDivElement>;
}

const Load = (props: ILoadProps) => {
	return (
		<>
			<div className="container-load" {...props.divProps}>
				<div className="spinner">
				</div>
			</div>
		</>
	);
};

export default Load;
