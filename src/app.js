import { defaultErrorHandler } from '@/utils/requestError'

export const dva = {
	config: {
	  onError(e) {
		e.preventDefault();
		if (Object.getPrototypeOf(e).constructor.name == 'ResponseError' && e.type == 'HttpError') {
			defaultErrorHandler(e);
		}
	  },
	}
  };