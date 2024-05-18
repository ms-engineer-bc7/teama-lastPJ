from django.test import TestCase
from ..models import User, Event
from django.utils import timezone

class UserModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(name="Test User 1", email="user1@example.com", role="user")
        self.user2 = User.objects.create(name="Test User 2", email="user2@example.com", role="partner", partner=self.user1)
        self.user1.partner = self.user2
        self.user1.save()

    def test_user_creation(self):
        self.assertEqual(self.user1.name, "Test User 1")
        self.assertEqual(self.user2.partner, self.user1)
        self.assertEqual(self.user1.partner, self.user2)

    def test_user_email_unique(self):
        with self.assertRaises(Exception): #例外発生
            User.objects.create(name="Test User 3", email="user1@example.com")

class EventModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(name="Event User", email="eventuser@example.com", role="user")
        self.event = Event.objects.create(
            user=self.user,
            title="Test Event",
            description="This is a test event.",
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1)
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, "Test Event")
        self.assertEqual(self.event.user, self.user)

    def test_event_dates(self):
        self.assertTrue(self.event.start_date < self.event.end_date)

    def test_event_string_representation(self):
        self.assertEqual(str(self.event), f"{self.event.title} - {self.event.start_date.strftime('%Y-%m-%d')}")
