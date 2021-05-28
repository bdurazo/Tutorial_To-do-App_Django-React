from django.db import models

# Create your models here.

class Todo(models.Model):

    class priority(models.TextChoices):
        LOW = 'Low'
        MEDIUM = 'Medium'
        HIGH = 'High'
        URGENT = 'Urgent'


    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=priority.choices, default='Low')

    def _str_(self):
        return self.title