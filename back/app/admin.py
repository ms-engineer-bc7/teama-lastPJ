from django.contrib import admin
from .models import User, Event, Viewer, Cost, FAQ, Testimonial

admin.site.register(User)
admin.site.register(Event)
admin.site.register(Viewer)
admin.site.register(Cost)
admin.site.register(FAQ)
admin.site.register(Testimonial)