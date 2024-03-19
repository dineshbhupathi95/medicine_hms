# Inside your Django app, create a templatetags directory if not exists, and within it create a file, e.g., custom_filters.py

# custom_filters.py

from django import template

register = template.Library()

@register.filter
def custom_range(value):
    return range(value)
