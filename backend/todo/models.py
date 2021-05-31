from django.db import models
from django.db.models.enums import Choices

# Create your models here.

class Todo(models.Model):

    class Priority(models.TextChoices):
        LOW = 'Low'
        MEDIUM = 'Medium'
        HIGH = 'High'
        URGENT = 'Urgent'

    class Weekdays(models.TextChoices):
        MONDAY = 'Monday'
        TUESDAY = 'Tuesday'
        WEDNESDAY = 'Wednesday'
        THURSDAY = 'Thursday'
        FRIDAY = 'Friday'
        SATURDAY = 'Saturday'
        SUNDAY = 'Sunday'

    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.LOW)
    weekday = models.CharField(max_length=10, choices=Weekdays.choices, default=Weekdays.MONDAY)

    def _str_(self):
        return self.title