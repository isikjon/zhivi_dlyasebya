<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\SiteContent;

return new class extends Migration
{
    public function up(): void
    {
        $contents = [
            // Hero
            ['page' => 'home', 'section' => 'Hero', 'key' => 'badge', 'value' => 'Твой квантовый переход', 'type' => 'text'],
            ['page' => 'home', 'section' => 'Hero', 'key' => 'author', 'value' => 'Виктории Неустроевой', 'type' => 'text'],
            ['page' => 'home', 'section' => 'Hero', 'key' => 'title_part1', 'value' => 'Открой тайну', 'type' => 'text'],
            ['page' => 'home', 'section' => 'Hero', 'key' => 'title_part2', 'value' => 'ЖЕНСКИХ АРХЕТИПОВ', 'type' => 'text'],
            ['page' => 'home', 'section' => 'Hero', 'key' => 'description', 'value' => 'Интерактивное пространство выбора. Перейди от состояния сомнения к состоянию абсолютной уверенности.', 'type' => 'text'],
            
            // Programs
            ['page' => 'home', 'section' => 'Programs', 'key' => 'title', 'value' => 'Наши программы', 'type' => 'text'],
            ['page' => 'home', 'section' => 'Programs', 'key' => 'subtitle', 'value' => 'Выбери свой путь трансформации. Каждая программа — это шаг навстречу к твоей истинной природе.', 'type' => 'text'],
            
            // Free Course
            ['page' => 'home', 'section' => 'FreeCourse', 'key' => 'badge', 'value' => 'Бонус от нас', 'type' => 'text'],
            ['page' => 'home', 'section' => 'FreeCourse', 'key' => 'title', 'value' => 'Начни свой путь БЕСПЛАТНО', 'type' => 'text'],
            ['page' => 'home', 'section' => 'FreeCourse', 'key' => 'description', 'value' => 'Мы верим, что каждая женщина заслуживает шанса познакомиться со своей истинной природой. Поэтому мы подготовили для тебя вводный курс «Пробуждение» абсолютно бесплатно.', 'type' => 'text'],
        ];

        foreach ($contents as $content) {
            SiteContent::create($content);
        }
    }

    public function down(): void
    {
        SiteContent::truncate();
    }
};
