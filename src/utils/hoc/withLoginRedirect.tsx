import { ComponentType } from "react";

export function withLoginRedirect <P extends {}>(Component: ComponentType<P>)  {
	return (props: P) => {
		// const isAuthed = useSelector(selectAuthedStatus);

		// if(!isAuthed) return <Navigate to='/login' replace />
	
		return <Component {...props as P} />
	}
}