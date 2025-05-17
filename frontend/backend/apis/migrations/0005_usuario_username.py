from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('apis', '0004_usuario_biografia'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='username',
            field=models.CharField(default='', max_length=160),
        ),
    ]