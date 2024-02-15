from django.urls import path
from .views import *

urlpatterns = [
    path('api/create/', UserCreateAPIView.as_view(), name='user-create'),
    path('api/department/', DepartmentView.as_view(), name='department-create'),
    # path('api/login/', user_login, name='api_login'),
    path('api/login/', Login.as_view()),
    path('api/logout/', Logout.as_view(), name='logout'),

]