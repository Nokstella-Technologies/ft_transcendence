from django.db import models
import uuid

class Game(models.Model):
    game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player1_id = models.UUIDField()
    player2_id = models.UUIDField()
    score_player1 = models.IntegerField(default=0)
    score_player2 = models.IntegerField(default=0)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=50)
    type = models.CharField(max_length=50)

    def __str__(self):
        return f"Game {self.game_id}"

class PlayerStats(models.Model):
    stats_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    games_played = models.IntegerField()
    games_won = models.IntegerField()
    games_lost = models.IntegerField()
    total_score = models.IntegerField()

    def __str__(self):
        return f"Stats for user {self.user_id}"


class GameAppearance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, related_name='game_appearance', on_delete=models.CASCADE)
    paddle_color = models.TextField(default='#FFF')
    ball_color = models.TextField(default='#FFF')
    background_color = models.TextField(default='#000')
    net_color = models.TextField(default='#FFF')

    def __str__(self):
        return f"{self.user_id} - GameAppearance"

