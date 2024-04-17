from django.db import models
from django.utils.translation import gettext_lazy as _

class User(models.Model):
    name = models.CharField(max_length=255, default='')
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=7, choices=[('user', '女性'), ('partner', 'パートナー')], blank=True)
    partner = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_partner')
    #Userモデルを参照する自己参照の外部キー パートナーがリンクを通じて登録するとこのフィールドにリンク

    def __str__(self):
        return self.name

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    tag = models.CharField(max_length=50, blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    hide_from_hr = models.BooleanField(default=False)
    alert_message_for_u = models.TextField(blank=True, null=True)
    alert_message_for_p = models.TextField(blank=True, null=True)
    alert_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.start_date.strftime('%Y-%m-%d')}"
    
class Viewer(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    allowed_email = models.EmailField(blank=True, null=True)  # 最初は空でもOK
    
    def __str__(self):
        return self.allowed_email or "No email set"   

class Cost(models.Model):
    treatment_type = models.CharField(max_length=100)
    insurance_coverage = models.TextField(blank=True, null=True)
    cost_details = models.TextField(blank=True, null=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.treatment_type} - {self.total_cost}"

class FAQ(models.Model):
    question = models.CharField(max_length=200)
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

class Testimonial(models.Model):
    tag = models.CharField(max_length=50, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # コンテンツの最初の50文字を表示する
        return self.content[:50]

class SpreadSheet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sheet_id = models.CharField(max_length=255, blank=True, null=True)
    shared_email = models.EmailField()

