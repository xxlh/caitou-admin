import React from 'react';
import { defaultErrorHandler } from '@/utils/requestError'

class ErrorBoundary extends React.Component {
	constructor(props:any) {
		super(props);
		this.state = { hasError: false, prevError: new Error() };
	}

    componentWillMount() {
        window.addEventListener('error', event => {
			if (event.error) this.logErrorToMyService(event.error);
		}, true)
        window.addEventListener('unhandledrejection', event => {
			if (event.reason) this.logErrorToMyService(event.reason);
        })
    }
  
	componentDidCatch(error:any, info:any) {
		const isNewError = (error.toString() !== this.state.prevError.toString());// should only run once
		if (isNewError) {//判断两次错误不一致才再次执行，不然一直循环
			this.setState({ prevError: error });
			// Display fallback UI
			this.setState({ hasError: true });
			// You can also log the error to an error reporting service
			this.logErrorToMyService(error, info);
		}
	}

	logErrorToMyService (error:any, info:any = {}) {
		if (Object.getPrototypeOf(error).constructor.name == 'ResponseError' && error.type == 'HttpError') {
			defaultErrorHandler(error);
		} else if (error.toString() == 'Failed to fetch') {
			defaultErrorHandler(error);
		}
	}
  
	render() {
		// if (this.state.hasError) {
		// 	// You can render any custom fallback UI
		// 	return <h1>Something went wrong.</h1>;
		// }
		return this.props.children;
	}
}

export default ErrorBoundary;