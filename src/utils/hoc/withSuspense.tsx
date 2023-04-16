import * as React from 'react';
import Preloader from '../../UI/Preloader';

function withSuspense<T extends {}>(Component: React.ComponentType<T>) {
	return (props: T) => {
		return (
			<React.Suspense fallback={<Preloader />}>
				<Component { ...props as T} />
			</React.Suspense>
		);
	} 
}

export default withSuspense;