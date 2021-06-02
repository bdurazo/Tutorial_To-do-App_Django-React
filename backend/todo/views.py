from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .orderingFilter import CaseInsensitiveOrderingFilter
from .models import Todo

# Create your views here.


class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    filter_backends = [CaseInsensitiveOrderingFilter]
    ordering_fields = ['priority', 'title']

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Todo.objects.all()
        wich_weekday = self.request.query_params.get('weekday')
        is_completed = True if self.request.query_params.get('completed') == "true" else False
        if(wich_weekday != None and is_completed != None):
            queryset = queryset.filter(weekday = wich_weekday)
            queryset = queryset.filter(completed = is_completed)
        return queryset

