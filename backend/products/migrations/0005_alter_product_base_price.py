# Generated by Django 5.2.1 on 2025-06-08 10:26

import django.core.validators
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0004_alter_product_base_price"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="base_price",
            field=models.DecimalField(
                decimal_places=2,
                default=350,
                help_text="Price for base weight (1kg)",
                max_digits=8,
                validators=[django.core.validators.MinValueValidator(Decimal("0.01"))],
            ),
        ),
    ]
