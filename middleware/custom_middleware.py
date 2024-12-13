import time
import logging
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('performance')

class RequestTimingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            if duration > 2:  # Log if the request takes more than 1 second
                logger.warning(f"Slow request: {request.path} took {duration:.2f} seconds.")
        return response
