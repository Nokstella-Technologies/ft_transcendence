# Generated by Django 4.2.2 on 2024-06-15 16:11

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameStats',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('game_id', models.UUIDField()),
                ('player1_id', models.UUIDField()),
                ('player2_id', models.UUIDField()),
                ('score_player1', models.IntegerField()),
                ('score_player2', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='TournamentStats',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('tournament_id', models.UUIDField()),
                ('player1_id', models.UUIDField()),
                ('player2_id', models.UUIDField()),
                ('winner_id', models.UUIDField()),
                ('score', models.IntegerField()),
                ('round_number', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
