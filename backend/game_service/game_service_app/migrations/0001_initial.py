# Generated by Django 4.2.2 on 2024-05-31 23:57

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('game_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('player1_id', models.UUIDField()),
                ('player2_id', models.UUIDField()),
                ('score_player1', models.IntegerField(default=0)),
                ('score_player2', models.IntegerField(default=0)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('status', models.CharField(max_length=50)),
                ('type', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='PlayerStats',
            fields=[
                ('stats_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('user_id', models.UUIDField()),
                ('games_played', models.IntegerField()),
                ('games_won', models.IntegerField()),
                ('games_lost', models.IntegerField()),
                ('total_score', models.IntegerField()),
            ],
        ),
    ]